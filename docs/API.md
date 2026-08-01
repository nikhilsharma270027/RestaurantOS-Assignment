# API Documentation

This document describes the main API routes available in the RestaurantOS application.

## Base Notes

- Most endpoints require an authenticated session.
- Authentication is handled by Better Auth and uses cookie-based session checks.
- Protected routes return `401 Unauthorized` when the user is not signed in.
- Some endpoints may return `403 Forbidden` when the user is signed in but does not have enough privileges.

## Authentication

### `GET /api/auth/[...all]`
### `POST /api/auth/[...all]`

These routes are handled by Better Auth and support the authentication flow for the application.

Common use cases include:

- Sign in
- Sign up
- Session handling
- Auth callbacks and related auth operations

## Dashboard API

### `GET /api/dashboard`

Returns dashboard data for the authenticated user.

#### Response

```json
{
  "orders": [],
  "expenses": [],
  "products": [],
  "ingredients": [],
  "tables": []
}
```

#### Errors

- `401 Unauthorized` if the session is missing
- `500 Internal Server Error` if data retrieval fails

## Access Control API

### `GET /api/access`

Returns a list of users and their access details for the authenticated user.

#### Response

```json
{
  "users": []
}
```

### `PUT /api/access/update-role`

Updates a user's role.

#### Request Body

```json
{
  "userId": "user-id",
  "role": "MANAGER"
}
```

#### Rules

- Only `OWNER` and `MANAGER` roles can update roles.
- A user cannot change their own role.
- The last owner cannot be removed.

#### Response

```json
{
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "MANAGER"
  },
  "message": "Successfully updated User Name's role to MANAGER."
}
```

#### Errors

- `400 Bad Request` for invalid input or policy violations
- `401 Unauthorized` when the user is not signed in
- `403 Forbidden` when the user lacks permission

## Invoices API

### `GET /api/invoices`

Returns the latest supplier invoices for the authenticated user.

#### Response

```json
{
  "invoices": []
}
```

### `POST /api/invoices/extract`

Extracts invoice data from an uploaded image or scan and stores the result.

#### Request Body

```json
{
  "dataUrl": "data:image/png;base64,...",
  "fileName": "invoice.png"
}
```

#### Response

```json
{
  "invoice": {
    "supplier_name": "Supplier Name",
    "invoice_number": "INV-001",
    "total": 1200
  }
}
```

#### Notes

- The endpoint uses Groq AI for extraction.
- `GROQ_API_KEY` must be configured for this route.

## AI Insights API

### `POST /api/ai/insights`

Generates restaurant operations insights from dashboard and business data.

#### Response

```json
{
  "headline": "Example insight",
  "demand_forecast": [],
  "stock_alerts": [],
  "cost_savings": [],
  "menu_moves": []
}
```

#### Notes

- Requires an authenticated session.
- `GROQ_API_KEY` must be configured.

## Resource API

### `GET /api/resource/[table]`

Returns records from a supported resource table.

#### Query Parameters

- `search` - Search text used across common fields
- `orderBy` - Field to sort by, defaults to `createdAt`
- `order` - Sort direction, `asc` or `desc`

#### Response

```json
{
  "data": []
}
```

### `POST /api/resource/[table]`

Creates a record in the selected table.

#### Request Body

Send the fields required by the selected table.

#### Response

```json
{
  "data": {}
}
```

### `PUT /api/resource/[table]`

Updates a record in the selected table.

#### Request Body

```json
{
  "id": "record-id",
  "fieldName": "new value"
}
```

### `DELETE /api/resource/[table]`

Deletes a record from the selected table.

#### Query Parameters

- `id` - Record identifier to delete

#### Response

```json
{
  "success": true
}
```

## Supported Resource Tables

- `order`
- `orderItem`
- `restaurantTable`
- `menuCategory`
- `menuItem`
- `recipe`
- `recipeItem`
- `ingredient`
- `supplier`
- `staff`
- `product`
- `productCategory`
- `warehouse`
- `stockMovement`
- `purchaseOrder`
- `purchaseOrderItem`
- `expenseCategory`
- `expense`
- `supplierInvoice`
- `supplierInvoiceItem`
- `activityLog`
- `user`
- `session`
- `account`
- `verification`

## Common Status Codes

- `200 OK` - Request succeeded
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource or table not found
- `500 Internal Server Error` - Unexpected failure

## Environment Variables

The following variables are commonly required by the API:

- `DATABASE_URL`
- `BETTER_AUTH_URL`
- `AUTH_SECRET`
- `GROQ_API_KEY`