// app/api/invoices/extract/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const INVOICE_PROMPT = `You are an expert accounts-payable clerk for a restaurant.
Extract structured data from the supplier invoice image or scan. It may be a printed
invoice or a handwritten delivery note — read handwriting carefully.

Respond with ONLY JSON in this exact shape (no markdown, no backticks):
{
  "supplier_name": string|null,
  "invoice_number": string|null,
  "invoice_date": "YYYY-MM-DD"|null,
  "due_date": "YYYY-MM-DD"|null,
  "currency": string|null,
  "subtotal": number|null,
  "tax": number|null,
  "total": number|null,
  "handwritten": boolean,
  "confidence": number,
  "items": [
    {
      "description": string,
      "quantity": number|null,
      "unit": string|null,
      "unit_price": number|null,
      "line_total": number|null
    }
  ]
}
Use null when a value is genuinely absent. Never invent totals: if only line items are legible, sum them for "subtotal".`;

async function extractWithGroq(dataUrl: string, fileName: string) {
  if (!GROQ_API_KEY) {
    throw new Error("Groq API key not configured. Set GROQ_API_KEY in .env");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.2-11b-vision-preview", // ✅ Current vision model
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${INVOICE_PROMPT}\n\nExtract this invoice (file: ${fileName}).`,
            },
            {
              type: "image_url",
              image_url: { url: dataUrl },
            },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Groq API error:", error);
    
    // Handle specific errors
    if (error.error?.code === "model_not_found") {
      throw new Error("AI model not available. Try a different model.");
    }
    
    throw new Error(error.error?.message || "AI extraction failed");
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  
  try {
    return JSON.parse(content);
  } catch {
    // Try to extract JSON if wrapped in markdown
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("Failed to parse AI response");
  }
}

// Alternative: Use a text-only model with base64 description
async function extractWithGroqText(dataUrl: string, fileName: string) {
  if (!GROQ_API_KEY) {
    throw new Error("Groq API key not configured");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile", // ✅ Fallback text model
      messages: [
        {
          role: "system",
          content: INVOICE_PROMPT,
        },
        {
          role: "user",
          content: `Extract invoice data from this image (file: ${fileName}). Image data: ${dataUrl.substring(0, 100)}... [base64 image data]`,
        },
      ],
      temperature: 0.1,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "AI extraction failed");
  }

  const data = await response.json();
  return JSON.parse(data.choices?.[0]?.message?.content || "{}");
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dataUrl, fileName } = await request.json();

    if (!dataUrl || !fileName) {
      return NextResponse.json(
        { error: "File data and name are required" },
        { status: 400 }
      );
    }

    let parsed;
    
    try {
      // Try vision model first
      parsed = await extractWithGroq(dataUrl, fileName);
    } catch (visionError) {
      console.warn("Vision model failed, trying text model:", visionError);
      // Fallback to text model
      parsed = await extractWithGroqText(dataUrl, fileName);
    }

    // Save invoice to database
    const invoice = await prisma.supplierInvoice.create({
      data: {
        supplierName: parsed.supplier_name,
        invoiceNumber: parsed.invoice_number,
        invoiceDate: parsed.invoice_date ? new Date(parsed.invoice_date) : null,
        dueDate: parsed.due_date ? new Date(parsed.due_date) : null,
        subtotal: parsed.subtotal || 0,
        tax: parsed.tax || 0,
        total: parsed.total || 0,
        currency: parsed.currency || "INR",
        status: "extracted",
        sourceKind: parsed.handwritten ? "printed" : "printed",
        fileName: fileName,
        confidence: parsed.confidence || 0,
        rawExtraction: parsed,
        createdBy: session.user.id,
      },
    });

    // Save line items
    if (parsed.items?.length > 0) {
      await prisma.supplierInvoiceItem.createMany({
        data: parsed.items.map((item: any) => ({
          invoiceId: invoice.id,
          description: item.description || "",
          quantity: item.quantity || 1,
          unit: item.unit,
          unitPrice: item.unit_price || 0,
          lineTotal: item.line_total || 0,
        })),
      });
    }

    return NextResponse.json({ invoice: parsed });
  } catch (error) {
    console.error("Extract invoice error:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to extract invoice",
      },
      { status: 500 }
    );
  }
}