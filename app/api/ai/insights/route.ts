// app/api/ai/insights/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

// Groq API (console.groq.com)
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function callGroq(prompt: string) {
  if (!GROQ_API_KEY) {
    throw new Error("Groq API key is not configured. Set GROQ_API_KEY in .env");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile", // Fast and free on Groq
      messages: [
        {
          role: "system",
          content: "You are a restaurant operations analyst. You MUST respond with ONLY valid JSON. Do not include markdown formatting, backticks, or any text outside the JSON object.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: "json_object" }, // Forces JSON output
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Groq API error:", error);
    
    if (response.status === 401) {
      throw new Error("Invalid Groq API key. Get a new key from https://console.groq.com/keys");
    }
    if (response.status === 429) {
      throw new Error("Groq rate limit reached. Try again in a moment.");
    }
    
    throw new Error(error.error?.message || "Groq API error");
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  
  try {
    return JSON.parse(content);
  } catch (parseError) {
    console.error("Failed to parse Groq response:", content);
    throw new Error("Failed to parse AI response");
  }
}

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all data in parallel
    const [products, ingredients, orders, expenses, menu] = await Promise.all([
      prisma.product.findMany({
        select: {
          name: true,
          quantityOnHand: true,
          reorderLevel: true,
          unitCost: true,
        },
        take: 80,
      }),
      prisma.ingredient.findMany({
        select: {
          name: true,
          currentStock: true,
          reorderLevel: true,
          costPerUnit: true,
          wasteQty: true,
        },
        take: 80,
      }),
      prisma.order.findMany({
        select: {
          orderNumber: true,
          status: true,
          total: true,
          orderType: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 120,
      }),
      prisma.expense.findMany({
        select: {
          title: true,
          amount: true,
          expenseDate: true,
        },
        orderBy: { expenseDate: "desc" },
        take: 80,
      }),
      prisma.menuItem.findMany({
        select: {
          name: true,
          price: true,
          cost: true,
          isAvailable: true,
        },
        take: 80,
      }),
    ]);

    const snapshot = {
      products,
      ingredients,
      recent_orders: orders,
      recent_expenses: expenses,
      menu_items: menu,
    };

    const prompt = `Analyze this restaurant operating data and provide actionable insights. Return ONLY a JSON object with this exact structure:

{
  "headline": "A one-sentence summary of the most critical insight",
  "demand_forecast": [
    {"item": "product name", "expected_units": number, "rationale": "brief explanation"}
  ],
  "stock_alerts": [
    {"product": "product name", "risk": "high" or "medium" or "low", "action": "recommended action"}
  ],
  "cost_savings": [
    {"area": "area name", "suggestion": "how to save money", "potential_monthly_saving": number or null}
  ],
  "menu_moves": [
    {"item": "menu item name", "recommendation": "what to change"}
  ]
}

Rules:
- Maximum 5 items per array
- Use null for unknown monetary values (not 0)
- Base ALL suggestions on the actual data provided
- If data is sparse or empty, say so in the headline
- Be specific and actionable

Restaurant Data:
${JSON.stringify(snapshot, null, 2)}`;

    const result = await callGroq(prompt);
    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Insights error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate insights",
      },
      { status: 500 }
    );
  }
}