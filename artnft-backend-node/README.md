
# ArtNFT Marketplace - Node.js Backend

This is the Node.js (Express.js, TypeScript) backend for the ArtNFT Marketplace application. It uses PostgreSQL as its database and provides a RESTful API for the Next.js frontend to consume.

## Table of Contents

1.  [✨ Key Backend Features](#-key-backend-features)
2.  [🛠️ Tech Stack](#️-tech-stack)
3.  [🏗️ Backend Architecture](#️-backend-architecture)
4.  [🚀 Getting Started](#-getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation & Setup](#installation--setup)
    *   [Running the Development Server](#running-the-development-server)
5.  [📁 Project Structure](#-project-structure)
6.  [💾 Database Schema](#-database-schema)
7.  [📈 API Endpoints Overview](#-api-endpoints-overview)
8.  [🔒 Security Considerations](#-security-considerations)
9.  [🧪 Testing (Guidance)](#-testing-guidance)
10. [⚙️ Environment Variables](#️-environment-variables)
11. [E️rror Handling](#error-handling)
12. [☁️ Deployment Considerations](#️-deployment-considerations)
13. [🤝 Contributing](#-contributing)
14. [🗺️ Roadmap (Backend Focus)](#️-roadmap-backend-focus)
15. [📄 License](#-license)

## ✨ Key Backend Features

*   **Secure User Authentication:** JWT-based authentication for users and administrators. Secure password hashing using `bcryptjs`.
*   **Role-Based Access Control:** Distinction between regular users and administrators for accessing specific APIs.
*   **RESTful API for Core Resources:**
    *   NFT Management (CRUD operations, fetching lists with filtering/sorting).
    *   User Profile Management.
    *   Category Management.
    *   Collection Management.
    *   Bidding System (Placing bids).
    *   Favorites System.
*   **Admin Panel Support:** Dedicated API endpoints for admin functionalities (user management, NFT status changes, category CUD).
*   **Data Validation:** (Planned) Robust validation for incoming API requests using libraries like Zod or express-validator.
*   **Structured Error Handling:** Centralized error handling middleware.
*   **Relational Database Management:** Uses Sequelize ORM for interactions with PostgreSQL database.
*   **TypeScript:** Written in TypeScript for improved code quality, type safety, and maintainability.

## 🛠️ Tech Stack

*   **Runtime:** [Node.js](https://nodejs.org/) (v18 or later recommended)
*   **Framework:** [Express.js](https://expressjs.com/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/)
*   **ORM (Object-Relational Mapper):** [Sequelize](https://sequelize.org/)
*   **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/), [bcryptjs](https://www.npmjs.com/package/bcryptjs) for password hashing.
*   **Environment Management:** [dotenv](https://www.npmjs.com/package/dotenv)
*   **Development Utilities:** [nodemon](https://nodemon.io/) and [ts-node](https://www.npmjs.com/package/ts-node) for auto-restarting and running TypeScript in development.
*   **Middleware:** [cors](https://www.npmjs.com/package/cors) for Cross-Origin Resource Sharing.

## 🏗️ Backend Architecture

The backend follows a layered architecture to promote separation of concerns, maintainability, and scalability:

1.  **Routes (`src/api/routes/`):** Define the API endpoints (URLs and HTTP methods). They receive requests and pass them to the appropriate controllers.
2.  **Controllers (`src/api/controllers/`):** Handle the incoming request and outgoing response. They parse request data (params, query, body), call service methods to perform business logic, and then format and send the HTTP response.
3.  **Services (`src/services/`):** Contain the core business logic of the application. They interact with models to perform data operations and can orchestrate calls to multiple models or other services.
4.  **Models (`src/models/`):** Define the structure of the data (database schema) and provide an interface for interacting with the database (using Sequelize).
5.  **Middleware (`src/middleware/`):** Functions that execute during the request-response cycle. Used for tasks like authentication, authorization, error handling, and request validation.
6.  **Config (`src/config/`):** Manages application configuration, including database connections and environment variables.
7.  **Types (`src/types/`):** Contains custom TypeScript type definitions, e.g., for augmenting Express Request objects.

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (comes with Node.js)
*   PostgreSQL server installed and running OR access to a cloud-hosted PostgreSQL instance (e.g., Supabase, Neon).
*   A PostgreSQL client (e.g., `psql`, pgAdmin, DBeaver).

### Installation & Setup

1.  **Clone the main repository** (if this backend is part of a larger monorepo) or this backend project directly.
2.  **Navigate to this backend directory:**
    ```bash
    cd path/to/artnft-marketplace/artnft-backend-node 
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Set up Environment Variables:**
    *   Create a `.env` file in the root of this backend project by copying `.env.example`.
    *   Fill in your PostgreSQL database credentials (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`), `PORT`, and a strong, unique `JWT_SECRET`.
        *   **For Supabase:** Use the connection details from your Supabase project dashboard (Project Settings > Database). The `DB_HOST` will be like `db.xxxxxxxx.supabase.co`, `DB_USER` is `postgres`, and `DB_NAME` is `postgres`.
    *   See the [Environment Variables](#️-environment-variables) section for details.
5.  **Database Setup:**
    *   Ensure your PostgreSQL server is running (locally or via cloud provider).
    *   Create the database specified in your `.env` file (e.g., `artnft_db`) if it doesn't exist (for Supabase, you typically use the default `postgres` database).
        ```sql
        -- Example for local PostgreSQL if creating a new database:
        -- CREATE DATABASE artnft_db;
        ```
    *   Connect to your PostgreSQL database using your chosen client.
    *   Apply the database schema by executing the `schema.sql` file.
        *   **Using `psql`:**
            ```bash
            psql -U your_postgres_user -d your_database_name -f schema.sql
            ```
        *   **Using Supabase SQL Editor:** Copy the content of `schema.sql` and run it.
        *   **Using pgAdmin/DBeaver:** Open and execute the `schema.sql` script.
    *   **PostgreSQL Extension (if needed):** The schema uses `gen_random_uuid()` for UUIDs. Modern PostgreSQL (13+) includes this. If using an older version or encounter issues, ensure the `uuid-ossp` extension is enabled: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` (then you might need to use `uuid_generate_v4()` in schema instead). Supabase projects typically don't require this manual step.

### Running the Development Server

```bash
npm run dev
```
This will start the server using `nodemon` with `ts-node`, which automatically recompiles and restarts on file changes. The server typically runs on `http://localhost:5000` (or the `PORT` specified in your `.env`). Look for console messages indicating the server is running and connected to the database.

To build for production:
```bash
npm run build
```
To run the compiled production build (from `dist/` folder):
```bash
npm start
```

## 📁 Project Structure

A brief overview of the `src/` directory:

```
artnft-backend-node/
├── dist/                      # Compiled JavaScript output
├── src/
│   ├── api/                   # API layer: routes, controllers, and validators
│   │   ├── controllers/       # Request handlers, interact with services (.ts)
│   │   ├── routes/            # Define API endpoints and link to controllers (.ts)
│   │   └── validators/        # (Placeholder) Request data validation logic
│   ├── config/                # Configuration files (database, environment - .ts)
│   ├── middleware/            # Express middleware (authentication, error handling - .ts)
│   ├── models/                # Sequelize database models (User, NFT, Category, etc. - .ts)
│   ├── services/              # Business logic layer, interacts with models (.ts)
│   ├── types/                 # Custom TypeScript type definitions
│   ├── utils/                 # Utility functions (helpers, error classes, etc. - .ts)
│   ├── app.ts                 # Express application setup, middleware registration, route mounting
│   └── server.ts              # Main server entry point (starts HTTP server, connects to DB)
├── .env                       # Local environment variables (ignored by Git)
├── .env.example               # Example environment variables
├── package.json               # Project dependencies and scripts
├── schema.sql                 # PostgreSQL database schema definition and mock data
├── tsconfig.json              # TypeScript compiler configuration
└── README.md                  # This file
```

## 💾 Database Schema

The database schema is defined in `schema.sql` for PostgreSQL. It creates the necessary tables for users, NFTs, categories, collections, bids, favorites, transactions, notifications, platform settings, and other supporting entities. It also includes mock data for initial testing.

Key tables include:
*   `users`: Stores user information (UUID primary key), including hashed passwords and roles.
*   `categories`: Defines NFT categories (SERIAL primary key).
*   `nfts`: Stores detailed information about each NFT (UUID primary key), including its creator, owner, price, and status.
*   See `schema.sql` for the full structure, relationships, constraints, and indexes.

## 📈 API Endpoints Overview

This section outlines the primary backend API endpoints and the frontend screens/features they are intended to support.
*(The detailed list of endpoints from the previous README version is still relevant here and can be referred to. All endpoints are now served by TypeScript controllers and services.)*

<details>
<summary><strong>Authentication (User & Admin)</strong></summary>

*   `POST /api/auth/signup` - User registration.
*   `POST /api/auth/login` - User login.
*   `POST /api/admin/auth/login` - Admin login.
</details>
*(...and so on for other endpoint categories as previously detailed. The core change is that the backend logic is now in TypeScript and interacts with PostgreSQL.)*


## 🔒 Security Considerations

*   **Password Hashing:** Passwords are hashed using `bcryptjs` before being stored.
*   **JWT Authentication:** Stateless authentication using JSON Web Tokens. Ensure `JWT_SECRET` is strong and kept private.
*   **HTTPS:** In production, always use HTTPS.
*   **Input Validation:** (Crucial To-Do) Implement robust validation for all incoming API requests using libraries like Zod or express-validator.
*   **Rate Limiting:** Consider implementing rate limiting.
*   **Data Sanitization:** Sanitize user-provided data before storing or displaying.
*   **Principle of Least Privilege:** Ensure users/admins only have authorized access.
*   **Parameterized Queries:** Sequelize helps prevent SQL injection by using parameterized queries.

## 🧪 Testing (Guidance)

*   **Unit Tests:** Test individual TypeScript functions and modules. Tools: [Jest](https://jestjs.io/), [Mocha](https://mochajs.org/).
*   **Integration Tests:** Test interactions (e.g., controller-service-database). Tools: Jest, Supertest.
*   **API Testing:** Use tools like Postman or Insomnia to test API endpoints directly.

## ⚙️ Environment Variables

Key environment variables are managed in a `.env` file (copied from `.env.example`).
Essential variables for PostgreSQL setup:

*   `NODE_ENV`: `development` or `production`.
*   `PORT`: e.g., `5000`.
*   `DB_DIALECT`: Set to `postgres`.
*   `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`: PostgreSQL connection details.
*   `JWT_SECRET`: Strong, random secret key for JWTs.
*   `JWT_EXPIRES_IN`: JWT validity period (e.g., `1d`).

## Error Handling

A global error handling middleware (`src/middleware/errorHandler.middleware.ts`) catches unhandled errors and sends structured JSON responses, using a custom `AppError` class for operational errors. It also handles Sequelize validation errors.

## ☁️ Deployment Considerations

*   **Environment Variables:** Ensure all production environment variables are set.
*   **Database:** Use a managed PostgreSQL service (e.g., Supabase, Neon, AWS RDS) for production.
*   **Build Step:** Your TypeScript code needs to be compiled to JavaScript using `npm run build`. Deploy the contents of the `dist` folder along with `node_modules` and `package.json`.
*   **Process Manager:** Use PM2 or similar for Node.js application management.
*   **HTTPS:** Configure a reverse proxy (Nginx, Caddy) for HTTPS.
*   **Logging:** Implement robust logging (Winston, Pino).

## 🤝 Contributing

Please refer to the main project's contributing guidelines. For backend-specific contributions:
1.  Ensure your code adheres to TypeScript best practices and existing style.
2.  Write or update tests.
3.  Update API documentation if endpoints change.

## 🗺️ Roadmap (Backend Focus)

*   Implement full CRUD operations and business logic for all defined models and services in TypeScript.
*   Robust input validation for all API endpoints (e.g., using Zod).
*   Implement comprehensive unit and integration tests.
*   Real-time features (e.g., auction updates) using WebSockets (e.g., Socket.IO).
*   Advanced search capabilities (e.g., using PostgreSQL full-text search or Elasticsearch).
*   Background job processing.
*   Transaction management for complex operations.
*   Refine API documentation (e.g., using Swagger/OpenAPI).

## 📄 License

(Specify your license, e.g., MIT)
