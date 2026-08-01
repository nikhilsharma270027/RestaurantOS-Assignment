// app/lib/roles.ts

export type AppRole = "OWNER" | "MANAGER" | "CHEF" | "WAITER" | "CASHIER" | "STORE_MANAGER";

export const ALL_ROLES: AppRole[] = [
  "OWNER",
  "MANAGER",
  "CHEF",
  "WAITER",
  "CASHIER",
  "STORE_MANAGER",
];

export const ROLE_LABELS: Record<AppRole, string> = {
  OWNER: "Owner",
  MANAGER: "Manager",
  CHEF: "Chef",
  WAITER: "Waiter",
  CASHIER: "Cashier",
  STORE_MANAGER: "Store Manager",
};

// Role groups for permissions
const MANAGEMENT: AppRole[] = ["OWNER", "MANAGER"];
const KITCHEN: AppRole[] = ["OWNER", "MANAGER", "CHEF"];
const FLOOR_STAFF: AppRole[] = ["OWNER", "MANAGER", "WAITER", "CASHIER"];
const SERVICE: AppRole[] = ["OWNER", "MANAGER", "WAITER", "CASHIER", "CHEF"];
const STOCK: AppRole[] = ["OWNER", "MANAGER", "STORE_MANAGER"];

/**
 * Roles allowed to WRITE (create/update/delete) each resource.
 * 
 * Waiters & Cashiers can:
 * - Create and manage orders
 * - Update table status (occupy/free)
 * - Add order items
 * 
 * Chefs can:
 * - View and update order status (pending → preparing → ready)
 * - Manage recipes and ingredients
 * - Update menu item availability
 */
export const WRITE_ROLES: Record<string, AppRole[]> = {
  // ✅ Use SINGULAR table names to match Prisma models
  order: FLOOR_STAFF,              // Changed from "orders"
  orderItem: FLOOR_STAFF,          // Changed from "order_items"
  restaurantTable: FLOOR_STAFF,    // Changed from "restaurant_tables"
  menuCategory: MANAGEMENT,        // Changed from "menu_categories"
  menuItem: MANAGEMENT,            // Changed from "menu_items"
  recipe: KITCHEN,                 // Changed from "recipes"
  recipeItem: KITCHEN,             // Changed from "recipe_items"
  ingredient: KITCHEN,             // Changed from "ingredients"
  supplier: MANAGEMENT,            // Changed from "suppliers"
  staff: MANAGEMENT,
  product: STOCK,                  // Changed from "products"
  productCategory: STOCK,          // Changed from "product_categories"
  warehouse: STOCK,                // Changed from "warehouses"
  stockMovement: STOCK,            // Changed from "stock_movements"
  purchaseOrder: STOCK,            // Changed from "purchase_orders"
  purchaseOrderItem: STOCK,        // Changed from "purchase_order_items"
  expenseCategory: MANAGEMENT,     // Changed from "expense_categories"
  expense: MANAGEMENT,             // Changed from "expenses"
  supplierInvoice: MANAGEMENT,     // Changed from "supplier_invoices"
  supplierInvoiceItem: MANAGEMENT, // Changed from "supplier_invoice_items"
};

export interface NavItem {
  to: string;
  label: string;
  icon: string;
  roles?: AppRole[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// Updated NAV_GROUPS with correct paths
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { to: "/ai-insights", label: "AI Insights", icon: "Sparkles" },
    ],
  },
  {
    label: "Restaurant",
    items: [
      { to: "/orders", label: "Orders", icon: "ReceiptText" },  // Everyone can see
      { to: "/tables", label: "Tables", icon: "Armchair" },
      { to: "/menu", label: "Menu", icon: "BookOpen" },
      { to: "/menu-categories", label: "Categories", icon: "Tags", roles: MANAGEMENT },
      { to: "/recipes", label: "Recipes", icon: "ChefHat", roles: KITCHEN },
      { to: "/ingredients", label: "Ingredients", icon: "Carrot", roles: KITCHEN },
    ],
  },
  {
    label: "Inventory",
    items: [
      { to: "/products", label: "Products", icon: "Package", roles: STOCK },
      { to: "/product-categories", label: "Categories", icon: "FolderTree", roles: STOCK },
      { to: "/warehouses", label: "Warehouses", icon: "Warehouse", roles: STOCK },
      { to: "/stock", label: "Stock In / Out", icon: "ArrowLeftRight", roles: STOCK },
      { to: "/purchase-orders", label: "Purchase Orders", icon: "ClipboardList", roles: STOCK },
    ],
  },
  {
    label: "Finance",
    items: [
      { to: "/expenses", label: "Expenses", icon: "Wallet", roles: MANAGEMENT },
      { to: "/expense-categories", label: "Categories", icon: "Tag", roles: MANAGEMENT },
      { to: "/invoices", label: "AI Invoices", icon: "FileScan", roles: MANAGEMENT },
      { to: "/suppliers", label: "Suppliers", icon: "Truck", roles: MANAGEMENT },
    ],
  },
  {
    label: "People",
    items: [
      { to: "/staff", label: "Staff", icon: "Users", roles: MANAGEMENT },
      { to: "/access", label: "Roles & Access", icon: "ShieldCheck", roles: ["OWNER", "MANAGER"] },
      { to: "/activity", label: "Activity Log", icon: "History", roles: MANAGEMENT },
    ],
  },
];

/**
 * Check if user has write permission for a table/resource.
 */
export function canWrite(roles: AppRole[], table: string): boolean {
  const allowed = WRITE_ROLES[table];
  
  // Debug logging
  console.log("canWrite check:", {
    table,
    roles,
    allowedRoles: allowed,
    result: allowed ? roles.some((r) => allowed.includes(r)) : roles.includes("OWNER"),
  });
  
  if (!allowed) {
    console.warn(`No write roles defined for table: ${table}, defaulting to OWNER only`);
    return roles.includes("OWNER");
  }
  
  return roles.some((r) => allowed.includes(r));
}

/**
 * Check if user can view a resource (everyone can view, this is for UI hiding).
 */
export function canView(roles: AppRole[], table: string): boolean {
  // All authenticated users can view unless explicitly restricted
  return true;
}

/**
 * Get a list of tables the user can write to.
 */
export function getWritableTables(roles: AppRole[]): string[] {
  return Object.entries(WRITE_ROLES)
    .filter(([_, allowedRoles]) => roles.some(r => allowedRoles.includes(r)))
    .map(([table]) => table);
}