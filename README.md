# RestaurantOS

**RestaurantOS** is a modern restaurant management system built for an SDE assignment submission. It is designed to help restaurant teams manage authentication, roles, menus, orders, inventory, invoices, and AI-powered insights from a single web application.

The project is built with Next.js, TypeScript, Prisma, and PostgreSQL. It includes role-based access control, protected routes, and AI-assisted workflows for operational decision-making.

## Project Description

RestaurantOS provides a structured backend and frontend experience for restaurant operations. The application supports staff access control, dashboard analytics, menu and inventory workflows, and invoice handling. It is a practical full-stack project that demonstrates product thinking, clean architecture, and integration of modern tools.

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | Next.js 16 |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Better Auth |
| Styling | Tailwind CSS |
| UI | shadcn/ui |
| Validation | Zod |
| Charts | Recharts |
| AI Integration | Groq API |

## Project Features

- Authentication with secure session handling
- Role-based access control for different staff members
- Dashboard for quick business and operational visibility
- Order tracking for day-to-day restaurant workflows
- Menu and category management for items and pricing
- Product and inventory management for stock control
- Table management for dine-in operations
- Invoice processing and expense handling
- AI insights for smarter decision-making
- Responsive UI built for practical admin use

## Installation Procedure

### Prerequisites

- Node.js 20 or later
- npm
- PostgreSQL database

### Steps

1. Clone the repository.

	```bash
	git clone <repository-url>
	cd restro
	```

2. Install dependencies.

	```bash
	npm install
	```

3. Create a `.env.local` file in the project root and add the required environment variables.

	```env
	DATABASE_URL="your_postgresql_connection_string"
	BETTER_AUTH_URL="http://localhost:3000"
	AUTH_SECRET="your_secure_secret"
	GROQ_API_KEY="your_groq_api_key"
	```

4. Prepare the database.

	```bash
	npm run db:generate
	npm run db:migrate
	```

	If you only want to sync the schema during development, you can use:

	```bash
	npm run db:push
	```

5. Start the development server.

	```bash
	npm run dev
	```

6. Open the application in your browser.

	```text
	http://localhost:3000
	```

## API Documentation

The full API reference is available in [docs/API.md](docs/API.md).

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to the database
- `npm run db:migrate` - Run Prisma migrations

## Screenshots

Add your project images here before submission.

### Image 1
<!-- Add screenshot here -->

### Image 2
<!-- Add screenshot here -->

### Image 3
<!-- Add screenshot here -->

### Image 4
<!-- Add screenshot here -->

### Image 5
<!-- Add screenshot here -->

## Notes for Submission

- This project is prepared as an SDE role assignment.
- Keep the screenshots updated with the latest UI before submitting.
- Add any deployment link or demo credentials here if required by the evaluator.

## License

This project is submitted for academic or assessment purposes.
