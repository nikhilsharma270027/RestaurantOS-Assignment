// app/(authenticated)/access/access-content.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AppShell } from "../../components/layout/app-shell";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { ALL_ROLES, ROLE_LABELS, type AppRole } from "../../lib/rbac";

interface User {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  employeeId?: string | null;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AccessContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<AppRole | null>(null);

  useEffect(() => {
    fetchUsers();
    getCurrentUserRole();
  }, []);

  async function getCurrentUserRole() {
    try {
      const response = await fetch("/api/auth/get-session");
      const data = await response.json();
      setCurrentUserRole(data?.user?.role || "WAITER");
    } catch (error) {
      console.error("Failed to get current user role:", error);
    }
  }

  async function fetchUsers() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/access");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }

      setUsers(data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError(error instanceof Error ? error.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }

  async function updateRole(userId: string, role: AppRole) {
    try {
      const response = await fetch("/api/access/update-role", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 403) {
          toast.error("Only owners and managers can change roles", {
            description: "Contact your administrator for access.",
            duration: 5000,
          });
          return; // Don't throw, just return gracefully
        }
        
        if (response.status === 400) {
          toast.error(data.error || "Invalid request");
          return;
        }

        throw new Error(data.error || "Failed to update role");
      }

      toast.success(`Role updated to ${ROLE_LABELS[role]}`, {
        description: `${data.user.name} is now a ${ROLE_LABELS[role]}.`,
      });
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Something went wrong", {
        description: error instanceof Error ? error.message : "Failed to update role",
      });
    }
  }

  async function toggleUserStatus(userId: string, isActive: boolean) {
    try {
      const response = await fetch(`/api/access/${userId}/toggle-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        const data = await response.json();
        
        if (response.status === 403) {
          toast.error("Only owners and managers can change user status");
          return;
        }
        
        throw new Error(data.error || "Failed to update status");
      }

      toast.success(isActive ? "User deactivated" : "User activated");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  }

  const canManageRoles = currentUserRole === "OWNER" || currentUserRole === "MANAGER";

  if (isLoading) {
    return (
      <AppShell title="Roles & Access" description="Control who can view and change each module.">
        <div className="surface-card overflow-hidden">
          <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Roles & Access" description="Control who can view and change each module.">
        <div className="surface-card p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Error Loading Users</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchUsers}>Try Again</Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Roles & Access" description="Control who can view and change each module.">
      {/* Permission Notice */}
      {!canManageRoles && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <p className="text-amber-800 text-sm">
            ⚠️ You have <strong>{ROLE_LABELS[currentUserRole || "WAITER"]}</strong> role. 
            Only <strong>Owners</strong> and <strong>Managers</strong> can change roles.
          </p>
        </div>
      )}

      <div className="surface-card overflow-hidden">
        {users.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Person</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-56">Change Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <p className="font-medium">{user.name || "Unnamed"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {user.employeeId || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          user.role === "OWNER"
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            : user.role === "MANAGER"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : user.role === "CHEF"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {ROLE_LABELS[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isActive ? "default" : "destructive"}
                        className={`cursor-pointer ${
                          !canManageRoles ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => {
                          if (canManageRoles) {
                            toggleUserStatus(user.id, user.isActive);
                          } else {
                            toast.error("Only owners and managers can change user status");
                          }
                        }}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(role) => {
                          if (canManageRoles) {
                            updateRole(user.id, role as AppRole);
                          } else {
                            toast.error("Only owners and managers can change roles", {
                              description: `You are a ${ROLE_LABELS[currentUserRole || "WAITER"]}. Ask an Owner or Manager for help.`,
                            });
                          }
                        }}
                        disabled={!canManageRoles}
                      >
                        <SelectTrigger className={!canManageRoles ? "opacity-50" : ""}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ALL_ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {ROLE_LABELS[role]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      <p className="mt-4 text-sm text-muted-foreground">
        {canManageRoles
          ? "Select a new role from the dropdown to change it. Click the status badge to toggle active/inactive."
          : "You need Owner or Manager access to change roles and user status."}
      </p>
    </AppShell>
  );
}