// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [orders, expenses, products, ingredients, tables] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          orderType: true,
          total: true,
          createdAt: true,
          table: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.expense.findMany({
        select: {
          id: true,
          amount: true,
          expenseDate: true,
        },
        take: 200,
      }),
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          quantityOnHand: true,
          reorderLevel: true,
        },
      }),
      prisma.ingredient.findMany({
        select: {
          id: true,
          name: true,
          currentStock: true,
          reorderLevel: true,
        },
      }),
      prisma.restaurantTable.findMany({
        select: {
          id: true,
          name: true,
          capacity: true,
          status: true,  // ✅ Use 'status' instead of 'isOccupied'
        },
      }),
    ]);

    return NextResponse.json({
      orders,
      expenses,
      products,
      ingredients,
      tables,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch dashboard data",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}