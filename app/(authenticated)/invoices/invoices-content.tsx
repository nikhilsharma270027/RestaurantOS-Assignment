// app/(authenticated)/invoices/invoices-content.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { FileScan, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "../../components/layout/app-shell";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

interface ExtractedInvoice {
  supplier_name: string | null;
  invoice_number: string | null;
  invoice_date: string | null;
  due_date: string | null;
  currency: string | null;
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  confidence: number | null;
  handwritten: boolean;
  items: {
    description: string;
    quantity: number | null;
    unit: string | null;
    unit_price: number | null;
    line_total: number | null;
  }[];
}

interface InvoiceRow {
  id: string;
  supplier_name: string | null;
  supplierName: string | null;
  invoice_number: string | null;
  invoiceNumber: string | null;
  invoice_date: string | null;
  invoiceDate: string | null;
  source_kind: string | null;
  sourceKind: string | null;
  confidence: number | null;
  total: number | null;
  created_at: string;
  createdAt: string;
}

function currency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function InvoicesContent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<ExtractedInvoice | null>(null);
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/invoices");
      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      toast.error("Failed to load invoices");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpload(file: File) {
    try {
      setIsUploading(true);
      
      // Convert file to base64
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Could not read file"));
        reader.readAsDataURL(file);
      });

      // Send to API for AI extraction
      const response = await fetch("/api/invoices/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, fileName: file.name }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to extract invoice");
      }

      setPreview(result.invoice);
      toast.success("Invoice extracted and saved");
      fetchInvoices(); // Refresh list
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <AppShell
      title="AI Invoices"
      description="Drop in a printed invoice or a handwritten delivery note — AI reads it for you."
      actions={
        <Button onClick={() => inputRef.current?.click()} disabled={isUploading}>
          {isUploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Upload className="size-4" />
          )}
          Upload invoice
        </Button>
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />

      {/* Preview of extracted invoice */}
      {preview && (
        <div className="surface-card mb-6 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <FileScan className="size-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">
              {preview.supplier_name ?? "Unknown supplier"} ·{" "}
              {preview.invoice_number ?? "no number"}
            </h2>
            <Badge variant="secondary">
              {Math.round((preview.confidence ?? 0) * 100)}% confidence
            </Badge>
            <Badge variant="outline">
              {preview.handwritten ? "Handwritten" : "Printed"}
            </Badge>
          </div>

          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit price</TableHead>
                  <TableHead>Line total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(preview.items ?? []).map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      {item.quantity ?? "—"} {item.unit ?? ""}
                    </TableCell>
                    <TableCell>{currency(item.unit_price ?? 0)}</TableCell>
                    <TableCell>{currency(item.line_total ?? 0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Total {currency(preview.total ?? 0)} (subtotal{" "}
            {currency(preview.subtotal ?? 0)}, tax {currency(preview.tax ?? 0)})
          </p>
        </div>
      )}

      {/* Processed Invoices List */}
      <div className="surface-card overflow-hidden">
        <div className="border-b p-4">
          <h2 className="font-display text-lg font-semibold">Processed invoices</h2>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted-foreground">
            No invoices processed yet. Upload one to see AI extraction in action.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      {row.supplier_name || row.supplierName || "—"}
                    </TableCell>
                    <TableCell>
                      {row.invoice_number || row.invoiceNumber || "—"}
                    </TableCell>
                    <TableCell>
                      {formatDate(row.invoice_date || row.invoiceDate || null)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {row.source_kind || row.sourceKind || "printed"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {Math.round(Number(row.confidence ?? 0) * 100)}%
                    </TableCell>
                    <TableCell>{currency(Number(row.total ?? 0))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AppShell>
  );
}