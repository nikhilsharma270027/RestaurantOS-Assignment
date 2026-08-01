// app/lib/resources.ts
import type { ResourceConfig } from "../components/resource/resource-view";

// ==========================================
// RESTAURANT RESOURCES
// ==========================================

export const ordersResource: ResourceConfig = {
  table: "order",
  title: "Orders",
  singular: "Order",
  description: "Track dine-in, takeaway and delivery orders in real time.",
  fields: [
    {
      name: "orderNumber",
      label: "Order #",
      type: "text",
      inTable: true,
      inForm: false,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "PENDING", label: "Pending" },
        { value: "PREPARING", label: "Preparing" },
        { value: "READY", label: "Ready" },
        { value: "SERVED", label: "Served" },
        { value: "CANCELLED", label: "Cancelled" },
      ],
      inTable: true,
      inForm: true,
      badge: true,
    },
    {
      name: "orderType",
      label: "Type",
      type: "select",
      options: [
        { value: "DINE_IN", label: "Dine In" },
        { value: "TAKEAWAY", label: "Takeaway" },
        { value: "DELIVERY", label: "Delivery" },
      ],
      inTable: true,
      inForm: true,
      badge: true,
    },
    {
      name: "tableId",
      label: "Table",
      type: "reference",
      refTable: "restaurantTable",
      refLabel: "name",
      inTable: true,
      inForm: true,
    },
    {
      name: "total",
      label: "Total",
      type: "currency",
      inTable: true,
      inForm: true,
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      inTable: false,
      inForm: true,
    },
    {
      name: "createdAt",
      label: "Created",
      type: "date",
      inTable: true,
      inForm: false,
    },
  ],
  searchKeys: ["orderNumber", "status", "orderType"],
  orderBy: { column: "createdAt", ascending: false },
};

export const tablesResource: ResourceConfig = {
  table: "restaurantTable",
  title: "Tables",
  singular: "Table",
  description: "Manage floor plan, seating and table status.",
  fields: [
    { name: "name", label: "Table Name", type: "text", required: true, inTable: true, inForm: true },
    { name: "capacity", label: "Capacity", type: "number", inTable: true, inForm: true },
    { name: "location", label: "Location", type: "text", inTable: true, inForm: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "available", label: "Available" },
        { value: "occupied", label: "Occupied" },
        { value: "reserved", label: "Reserved" },
        { value: "cleaning", label: "Cleaning" },
      ],
      inTable: true,
      inForm: true,
      badge: true,
    },
  ],
  searchKeys: ["name", "location", "status"],
  orderBy: { column: "name", ascending: true },
};

// app/lib/resources.ts

export const menuResource: ResourceConfig = {
  table: "menuItem",
  title: "Menu",
  singular: "Menu Item",
  description: "Dishes, pricing and food cost. Only managers can edit menu items.",
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      inTable: true,
      inForm: true,
      placeholder: "e.g., Margherita Pizza",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      inTable: false,
      inForm: true,
      placeholder: "Brief description of the dish",
    },
    {
      name: "price",
      label: "Price (₹)",
      type: "currency",
      inTable: true,
      inForm: true,
      required: true,
    },
    {
      name: "cost",
      label: "Food Cost (₹)",
      type: "currency",
      inTable: true,
      inForm: true,
      placeholder: "Cost of ingredients per dish",
    },
    {
      name: "categoryId",
      label: "Category",
      type: "reference",
      refTable: "menuCategory",
      refLabel: "name",
      inTable: true,
      inForm: true,
    },
    {
      name: "prepTimeMinutes",
      label: "Prep Time (min)",
      type: "number",
      inTable: true,
      inForm: true,
      placeholder: "Preparation time in minutes",
    },
    {
      name: "isAvailable",
      label: "Available",
      type: "switch",
      inTable: true,
      inForm: true,
    },
    {
      name: "imageUrl",
      label: "Image URL",
      type: "text",
      inTable: false,
      inForm: true,
      placeholder: "https://...",
    },
  ],
  searchKeys: ["name", "description"],
  orderBy: { column: "name", ascending: true },
};


// app/lib/resources.ts

export const menuCategoriesResource: ResourceConfig = {
  table: "menuCategory",
  title: "Menu Categories",
  singular: "Category",
  description: "Organize menu items into categories like Starters, Main Course, Desserts.",
  fields: [
    {
      name: "name",
      label: "Category Name",
      type: "text",
      required: true,
      inTable: true,
      inForm: true,
      placeholder: "e.g., Starters, Main Course, Desserts",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      inTable: false,
      inForm: true,
    },
    {
      name: "sortOrder",
      label: "Display Order",
      type: "number",
      inTable: true,
      inForm: true,
      placeholder: "Lower numbers appear first",
    },
  ],
  searchKeys: ["name"],
  orderBy: { column: "sortOrder", ascending: true },
};


// app/lib/resources.ts

export const productsResource: ResourceConfig = {
  table: "product",
  title: "Products",
  singular: "Product",
  description: "Manage inventory products, stock levels, and reorder points. Only store managers and management can edit.",
  fields: [
    {
      name: "name",
      label: "Product Name",
      type: "text",
      required: true,
      inTable: true,
      inForm: true,
      placeholder: "e.g., Rice, Cooking Oil",
    },
    {
      name: "sku",
      label: "SKU",
      type: "text",
      inTable: true,
      inForm: true,
      placeholder: "Auto-generated if empty",
    },
    {
      name: "unit",
      label: "Unit",
      type: "text",
      inTable: true,
      inForm: true,
      placeholder: "e.g., kg, liter, piece",
    },
    {
      name: "unitCost",
      label: "Unit Cost (₹)",
      type: "currency",
      inTable: true,
      inForm: true,
    },
    {
      name: "quantityOnHand",
      label: "Quantity on Hand",
      type: "number",
      inTable: true,
      inForm: true,
      step: "0.001",
    },
    {
      name: "reorderLevel",
      label: "Reorder Level",
      type: "number",
      inTable: true,
      inForm: true,
      step: "0.001",
      placeholder: "Alert when stock falls below this",
    },
    {
      name: "categoryId",
      label: "Category",
      type: "reference",
      refTable: "productCategory",
      refLabel: "name",
      inTable: true,
      inForm: true,
    },
    {
      name: "supplierId",
      label: "Supplier",
      type: "reference",
      refTable: "supplier",
      refLabel: "name",
      inTable: true,
      inForm: true,
    },
  ],
  searchKeys: ["name", "sku"],
  orderBy: { column: "name", ascending: true },
};

// app/lib/resources.ts

export const recipesResource: ResourceConfig = {
  table: "recipe",
  title: "Recipes",
  singular: "Recipe",
  description: "Standardised recipes with ingredients and instructions for every dish.",
  fields: [
    {
      name: "name",
      label: "Recipe Name",
      type: "text",
      required: true,
      inTable: true,
      inForm: true,
      placeholder: "e.g., Classic Margherita Pizza",
    },
    {
      name: "menuItemId",
      label: "Menu Item",
      type: "reference",
      refTable: "menuItem",
      refLabel: "name",
      inTable: true,
      inForm: true,
    },
    {
      name: "instructions",
      label: "Instructions",
      type: "textarea",
      inTable: false,
      inForm: true,
      placeholder: "Step-by-step cooking instructions...",
    },
    {
      name: "yieldQty",
      label: "Yield Quantity",
      type: "number",
      inTable: true,
      inForm: true,
      placeholder: "e.g., 1 (for 1 serving)",
    },
    {
      name: "prepTimeMinutes",
      label: "Prep Time (min)",
      type: "number",
      inTable: true,
      inForm: true,
    },
  ],
  searchKeys: ["name"],
  orderBy: { column: "name", ascending: true },
};


// app/lib/resources.ts

export const ingredientsResource: ResourceConfig = {
  table: "ingredient",
  title: "Ingredients",
  singular: "Ingredient",
  description: "Track kitchen ingredients, stock levels, costs, and suppliers.",
  fields: [
    {
      name: "name",
      label: "Ingredient Name",
      type: "text",
      required: true,
      inTable: true,
      inForm: true,
      placeholder: "e.g., All-Purpose Flour",
    },
    {
      name: "unit",
      label: "Unit",
      type: "select",
      options: [
        { value: "kg", label: "Kilogram (kg)" },
        { value: "g", label: "Gram (g)" },
        { value: "l", label: "Liter (L)" },
        { value: "ml", label: "Milliliter (ml)" },
        { value: "piece", label: "Piece" },
        { value: "dozen", label: "Dozen" },
        { value: "packet", label: "Packet" },
      ],
      inTable: true,
      inForm: true,
    },
    {
      name: "costPerUnit",
      label: "Cost Per Unit (₹)",
      type: "currency",
      inTable: true,
      inForm: true,
    },
    {
      name: "currentStock",
      label: "Current Stock",
      type: "number",
      inTable: true,
      inForm: true,
      step: "0.001",
    },
    {
      name: "reorderLevel",
      label: "Reorder Level",
      type: "number",
      inTable: true,
      inForm: true,
      step: "0.001",
      placeholder: "Alert when stock falls below this",
    },
    {
      name: "supplierId",
      label: "Preferred Supplier",
      type: "reference",
      refTable: "supplier",
      refLabel: "name",
      inTable: true,
      inForm: true,
    },
    {
      name: "wasteQty",
      label: "Waste Quantity",
      type: "number",
      inTable: true,
      inForm: true,
      step: "0.001",
    },
  ],
  searchKeys: ["name"],
  orderBy: { column: "name", ascending: true },
};
















// export const menuItemsResource: ResourceConfig = {
//   table: "menuItem",
//   title: "Menu Items",
//   singular: "Menu Item",
//   description: "Manage your restaurant menu items and pricing.",
//   fields: [
//     { name: "name", label: "Name", type: "text", required: true, inTable: true, inForm: true },
//     { name: "description", label: "Description", type: "textarea", inTable: false, inForm: true },
//     { name: "price", label: "Price", type: "currency", inTable: true, inForm: true },
//     { name: "cost", label: "Cost", type: "currency", inTable: true, inForm: true },
//     {
//       name: "categoryId",
//       label: "Category",
//       type: "reference",
//       refTable: "menuCategory",
//       refLabel: "name",
//       inTable: true,
//       inForm: true,
//     },
//     { name: "isAvailable", label: "Available", type: "switch", inTable: true, inForm: true },
//     { name: "prepTimeMinutes", label: "Prep Time (min)", type: "number", inTable: true, inForm: true },
//   ],
//   searchKeys: ["name", "description"],
// };

// export const menuCategoriesResource: ResourceConfig = {
//   table: "menuCategory",
//   title: "Menu Categories",
//   singular: "Category",
//   description: "Organize menu items into categories.",
//   fields: [
//     { name: "name", label: "Name", type: "text", required: true, inTable: true, inForm: true },
//     { name: "description", label: "Description", type: "textarea", inTable: false, inForm: true },
//     { name: "sortOrder", label: "Sort Order", type: "number", inTable: true, inForm: true },
//   ],
//   searchKeys: ["name"],
//   orderBy: { column: "sortOrder", ascending: true },
// };

// // ==========================================
// // KITCHEN RESOURCES
// // ==========================================

// export const recipesResource: ResourceConfig = {
//   table: "recipe",
//   title: "Recipes",
//   singular: "Recipe",
//   description: "Manage food preparation recipes and instructions.",
//   fields: [
//     { name: "name", label: "Name", type: "text", required: true, inTable: true, inForm: true },
//     { name: "instructions", label: "Instructions", type: "textarea", inTable: false, inForm: true },
//     { name: "yieldQty", label: "Yield Quantity", type: "number", inTable: true, inForm: true },
//     { name: "prepTimeMinutes", label: "Prep Time (min)", type: "number", inTable: true, inForm: true },
//     {
//       name: "menuItemId",
//       label: "Menu Item",
//       type: "reference",
//       refTable: "menuItem",
//       refLabel: "name",
//       inTable: true,
//       inForm: true,
//     },
//   ],
//   searchKeys: ["name"],
// };

// export const ingredientsResource: ResourceConfig = {
//   table: "ingredient",
//   title: "Ingredients",
//   singular: "Ingredient",
//   description: "Track kitchen ingredients and stock levels.",
//   fields: [
//     { name: "name", label: "Name", type: "text", required: true, inTable: true, inForm: true },
//     { name: "unit", label: "Unit", type: "text", inTable: true, inForm: true },
//     { name: "costPerUnit", label: "Cost/Unit", type: "currency", inTable: true, inForm: true },
//     { name: "currentStock", label: "Current Stock", type: "number", inTable: true, inForm: true },
//     { name: "reorderLevel", label: "Reorder Level", type: "number", inTable: true, inForm: true },
//     {
//       name: "supplierId",
//       label: "Supplier",
//       type: "reference",
//       refTable: "supplier",
//       refLabel: "name",
//       inTable: true,
//       inForm: true,
//     },
//   ],
//   searchKeys: ["name"],
// };

// // ==========================================
// // INVENTORY RESOURCES
// // ==========================================

// export const productsResource: ResourceConfig = {
//   table: "product",
//   title: "Products",
//   singular: "Product",
//   description: "Manage inventory products and stock levels.",
//   fields: [
//     { name: "name", label: "Name", type: "text", required: true, inTable: true, inForm: true },
//     { name: "sku", label: "SKU", type: "text", inTable: true, inForm: true },
//     { name: "unit", label: "Unit", type: "text", inTable: true, inForm: true },
//     { name: "unitCost", label: "Unit Cost", type: "currency", inTable: true, inForm: true },
//     { name: "quantityOnHand", label: "Qty on Hand", type: "number", inTable: true, inForm: true },
//     { name: "reorderLevel", label: "Reorder Level", type: "number", inTable: true, inForm: true },
//     {
//       name: "categoryId",
//       label: "Category",
//       type: "reference",
//       refTable: "productCategory",
//       refLabel: "name",
//       inTable: true,
//       inForm: true,
//     },
//     {
//       name: "supplierId",
//       label: "Supplier",
//       type: "reference",
//       refTable: "supplier",
//       refLabel: "name",
//       inTable: true,
//       inForm: true,
//     },
//   ],
//   searchKeys: ["name", "sku"],
// };

// // ==========================================
// // FINANCE RESOURCES
// // ==========================================

// export const expensesResource: ResourceConfig = {
//   table: "expense",
//   title: "Expenses",
//   singular: "Expense",
//   description: "Track all restaurant expenses and costs.",
//   fields: [
//     { name: "title", label: "Title", type: "text", required: true, inTable: true, inForm: true },
//     { name: "amount", label: "Amount", type: "currency", inTable: true, inForm: true },
//     { name: "expenseDate", label: "Date", type: "date", inTable: true, inForm: true },
//     {
//       name: "paymentMethod",
//       label: "Payment Method",
//       type: "select",
//       options: [
//         { value: "CASH", label: "Cash" },
//         { value: "CARD", label: "Card" },
//         { value: "UPI", label: "UPI" },
//         { value: "BANK_TRANSFER", label: "Bank Transfer" },
//       ],
//       inTable: true,
//       inForm: true,
//     },
//     {
//       name: "categoryId",
//       label: "Category",
//       type: "reference",
//       refTable: "expenseCategory",
//       refLabel: "name",
//       inTable: true,
//       inForm: true,
//     },
//     { name: "notes", label: "Notes", type: "textarea", inTable: false, inForm: true },
//   ],
//   searchKeys: ["title", "paymentMethod"],
//   orderBy: { column: "expenseDate", ascending: false },
// };

// export const suppliersResource: ResourceConfig = {
//   table: "supplier",
//   title: "Suppliers",
//   singular: "Supplier",
//   description: "Manage your suppliers and vendor information.",
//   fields: [
//     { name: "name", label: "Name", type: "text", required: true, inTable: true, inForm: true },
//     { name: "contactName", label: "Contact Person", type: "text", inTable: true, inForm: true },
//     { name: "email", label: "Email", type: "text", inTable: true, inForm: true },
//     { name: "phone", label: "Phone", type: "text", inTable: true, inForm: true },
//     { name: "address", label: "Address", type: "textarea", inTable: false, inForm: true },
//     { name: "paymentTerms", label: "Payment Terms", type: "text", inTable: false, inForm: true },
//     { name: "isActive", label: "Active", type: "switch", inTable: true, inForm: true },
//   ],
//   searchKeys: ["name", "email", "phone"],
// };