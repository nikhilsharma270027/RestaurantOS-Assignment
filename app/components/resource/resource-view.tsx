// components/resource/resource-view.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/use-auth";
import { canWrite } from "../../lib/rbac";
import { AppShell } from "../../components/layout/app-shell";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

// Types
export type FieldType = "text" | "textarea" | "number" | "currency" | "date" | "select" | "switch" | "reference";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  refTable?: string;
  refLabel?: string;
  required?: boolean;
  placeholder?: string;
  step?: string;
  inTable?: boolean;
  inForm?: boolean;
  badge?: boolean;
}

export interface ResourceConfig {
  table: string;
  title: string;
  singular: string;
  description: string;
  fields: FieldDef[];
  searchKeys: string[];
  orderBy?: { column: string; ascending: boolean };
  readOnly?: boolean;
  extraHeader?: React.ReactNode;
}

type Row = Record<string, unknown>;

const BADGE_TONE: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  occupied: "bg-yellow-100 text-yellow-800",
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  served: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  draft: "bg-gray-100 text-gray-800",
};

function currency(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function titleCase(str: string): string {
  return str.toLowerCase().split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function renderCell(field: FieldDef, row: Row, refs: Record<string, { value: string; label: string }[]>) {
  const value = row[field.name];
  if (value === null || value === undefined || value === "") return <span className="text-gray-400">—</span>;

  switch (field.type) {
    case "currency": return currency(Number(value));
    case "date": return formatDate(String(value));
    case "switch": return <Badge variant="outline">{value ? "Yes" : "No"}</Badge>;
    case "select": {
      const label = field.options?.find(o => o.value === String(value))?.label ?? titleCase(String(value));
      return field.badge ? <Badge className={BADGE_TONE[String(value)]}>{label}</Badge> : label;
    }
    default: return String(value);
  }
}

export function ResourceView({ config }: { config: ResourceConfig }) {
  const { user } = useAuth();
  const roles: any = user?.role ? [user.role] : [];
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>({});
  const [saving, setSaving] = useState(false);
  const [refs, setRefs] = useState<Record<string, { value: string; label: string }[]>>({});

  // ✅ Debug: Log roles to see what's happening
  console.log("Current user:", user);
  console.log("Current roles:", roles);
  console.log("Config table:", config.table);
  console.log("Can write:", canWrite(roles, config.table));

  // ✅ Fix: Default to allowing write if roles are still loading
  const writable = !config.readOnly && (roles.length === 0 || canWrite(roles, config.table));

  useEffect(() => {
    fetchData();
    fetchReferences();
  }, [config.table]);

  async function fetchData() {
    try {
      setIsLoading(true);
      const orderBy = config.orderBy?.column || "createdAt";
      const order = config.orderBy?.ascending ? "asc" : "desc";
      const res = await fetch(`/api/resource/${config.table}?orderBy=${orderBy}&order=${order}`);
      const result = await res.json();
      setData(result.data || []);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchReferences() {
    const refFields = config.fields.filter(f => f.type === "reference" && f.refTable);
    if (refFields.length === 0) return;

    const entries = await Promise.all(
      refFields.map(async (f) => {
        const res = await fetch(`/api/resource/${f.refTable}`);
        const result = await res.json();
        const list = result.data || [];
        return [f.refTable!, list.map((r: any) => ({ value: r.id, label: r[f.refLabel || "name"] || "—" }))];
      })
    );
    setRefs(Object.fromEntries(entries));
  }

  const rows = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(row => config.searchKeys.some(k => String(row[k] ?? "").toLowerCase().includes(q)));
  }, [data, search]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = `/api/resource/${config.table}`;
      const method = editing ? "PUT" : "POST";
      const body = editing ? { id: editing.id, ...form } : form;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success(`${config.singular} ${editing ? "updated" : "created"}`);
      setOpen(false);
      setEditing(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/resource/${config.table}?id=${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success(`${config.singular} deleted`);
      setDeleteTarget(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete");
    }
  }

  function openCreate() {
    const defaults: Row = {};
    for (const f of config.fields) {
      if (f.type === "switch") defaults[f.name] = true;
    }
    setForm(defaults);
    setEditing(null);
    setOpen(true);
  }

  function openEdit(row: Row) {
    setForm({ ...row });
    setEditing(row);
    setOpen(true);
  }

  const tableFields = config.fields.filter(f => f.inTable !== false);
  const formFields = config.fields.filter(f => f.inForm !== false);

  return (
    <AppShell title={config.title} description={config.description}
      actions={writable ? <Button onClick={openCreate}><Plus className="size-4" /> New {config.singular}</Button> : undefined}
    >
      <div className="surface-card overflow-hidden ">
        <div className="flex items-center gap-3 border-b p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${config.title.toLowerCase()}…`} className="pl-9" />
          </div>
          <span className="text-sm text-gray-500">{rows.length} records</span>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-16 text-center">
            <Inbox className="size-8 text-gray-400" />
            <p className="font-medium">No {config.title.toLowerCase()} yet</p>
            {writable && <Button variant="outline" onClick={openCreate}><Plus className="size-4" /> Add the first one</Button>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableFields.map(f => <TableHead key={f.name}>{f.label}</TableHead>)}
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={String(row.id)}>
                    {tableFields.map(f => <TableCell key={f.name}>{renderCell(f, row, refs)}</TableCell>)}
                    <TableCell className="text-right">
                      {writable ? (
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(row)}><Pencil className="size-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => setDeleteTarget(row)}><Trash2 className="size-4" /></Button>
                        </div>
                      ) : <span className="text-xs text-gray-400">Read only</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${config.singular}` : `New ${config.singular}`}</DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSave}>
            {formFields.map(field => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={`field-${field.name}`}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea id={`field-${field.name}`} value={String(form[field.name] ?? "")} onChange={e => setForm(f => ({ ...f, [field.name]: e.target.value }))} />
                ) : field.type === "switch" ? (
                  <Switch id={`field-${field.name}`} checked={Boolean(form[field.name])} onCheckedChange={v => setForm(f => ({ ...f, [field.name]: v }))} />
                ) : field.type === "select" ? (
                  <Select value={String(form[field.name] ?? "")} onValueChange={v => setForm(f => ({ ...f, [field.name]: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {field.options?.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input id={`field-${field.name}`} type={field.type === "number" || field.type === "currency" ? "number" : field.type === "date" ? "date" : "text"} step={field.step} value={String(form[field.name] ?? "")} onChange={e => setForm(f => ({ ...f, [field.name]: e.target.value }))} />
                )}
              </div>
            ))}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{editing ? "Save" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {config.singular}?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes the record.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}