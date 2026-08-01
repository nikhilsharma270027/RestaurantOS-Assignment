// app/api/access/update-role/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Please sign in to continue." },
        { status: 401 }
      );
    }

    const currentUserRole = (session.user as any).role;

    // Check if user has permission
    if (!currentUserRole || !["OWNER", "MANAGER"].includes(currentUserRole)) {
      return NextResponse.json(
        { 
          error: "Only owners and managers can change roles.",
          currentRole: currentUserRole 
        },
        { status: 403 }
      );
    }

    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "Please provide both user and role." },
        { status: 400 }
      );
    }

    // Prevent changing your own role
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot change your own role." },
        { status: 400 }
      );
    }

    // Prevent removing the last owner
    if (currentUserRole === "OWNER") {
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (targetUser?.role === "OWNER" && role !== "OWNER") {
        const ownerCount = await prisma.user.count({
          where: { role: "OWNER" },
        });
        
        if (ownerCount <= 1) {
          return NextResponse.json(
            { error: "Cannot remove the last owner. Promote someone else first." },
            { status: 400 }
          );
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ 
      user: updatedUser,
      message: `Successfully updated ${updatedUser.name}'s role to ${role}.`
    });
  } catch (error) {
    console.error("Update role error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}