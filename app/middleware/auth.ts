// app/middleware/auth.ts
import { auth } from "@/app/lib/auth";
import { canWrite, type AppRole } from "@/app/lib/rbac";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function withAuth(
  request: NextRequest,
  requiredResource?: string
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userRole = session.user.role as AppRole;

  // Check write permissions if resource specified
  if (requiredResource && !canWrite([userRole], requiredResource)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  return { session, userRole };
}