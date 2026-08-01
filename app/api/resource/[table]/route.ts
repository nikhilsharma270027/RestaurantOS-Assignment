// app/api/resource/[table]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

// GET - List records
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Await params before accessing
    const { table } = await params;
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const orderBy = searchParams.get("orderBy") || "createdAt";
    const order = searchParams.get("order") || "desc";

    // Map table name to Prisma model
    const prismaModel = getPrismaModel(table);

    if (!prismaModel) {
      return NextResponse.json(
        { error: `Table '${table}' not found` },
        { status: 404 }
      );
    }

    let where: any = {};
    
    // Handle search if provided
    if (search) {
      where = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { orderNumber: { contains: search, mode: "insensitive" } },
          { title: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { status: { contains: search, mode: "insensitive" } },
        ].filter(Boolean),
      };
    }

    const data = await prismaModel.findMany({
      where,
      orderBy: { [orderBy]: order },
      take: 500,
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Resource GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// POST - Create record
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Await params
    const { table } = await params;
    const body = await request.json();
    const prismaModel = getPrismaModel(table);

    if (!prismaModel) {
      return NextResponse.json(
        { error: `Table '${table}' not found` },
        { status: 404 }
      );
    }

    const data = await prismaModel.create({
      data: body,
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Resource POST error:", error);
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 500 }
    );
  }
}

// PUT - Update record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Await params
    const { table } = await params;
    const body = await request.json();
    const { id, ...data } = body;
    const prismaModel = getPrismaModel(table);

    if (!prismaModel) {
      return NextResponse.json(
        { error: `Table '${table}' not found` },
        { status: 404 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "ID is required for update" },
        { status: 400 }
      );
    }

    const updated = await prismaModel.update({
      where: { id },
      data,
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Resource PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update record" },
      { status: 500 }
    );
  }
}

// DELETE - Remove record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Await params
    const { table } = await params;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required for delete" },
        { status: 400 }
      );
    }

    const prismaModel = getPrismaModel(table);

    if (!prismaModel) {
      return NextResponse.json(
        { error: `Table '${table}' not found` },
        { status: 404 }
      );
    }

    await prismaModel.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resource DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete record" },
      { status: 500 }
    );
  }
}

// Helper: Map table name string to Prisma model
function getPrismaModel(table: string): any {
  const modelMap: Record<string, any> = {
    order: prisma.order,
    orderItem: prisma.orderItem,
    restaurantTable: prisma.restaurantTable,
    menuCategory: prisma.menuCategory,
    menuItem: prisma.menuItem,
    recipe: prisma.recipe,
    recipeItem: prisma.recipeItem,
    ingredient: prisma.ingredient,
    supplier: prisma.supplier,
    staff: prisma.staff,
    product: prisma.product,
    productCategory: prisma.productCategory,
    warehouse: prisma.warehouse,
    stockMovement: prisma.stockMovement,
    purchaseOrder: prisma.purchaseOrder,
    purchaseOrderItem: prisma.purchaseOrderItem,
    expenseCategory: prisma.expenseCategory,
    expense: prisma.expense,
    supplierInvoice: prisma.supplierInvoice,
    supplierInvoiceItem: prisma.supplierInvoiceItem,
    activityLog: prisma.activityLog,
    user: prisma.user,
    session: prisma.session,
    account: prisma.account,
    verification: prisma.verification,
  };

  return modelMap[table] || null;
}