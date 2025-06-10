
# ArtNFT Marketplace - Node.js Backend

This is the Node.js (Express.js) backend for the ArtNFT Marketplace application. It uses MySQL as its database and provides a RESTful API for the Next.js frontend to consume.

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
*   **Data Validation:** (Planned) Robust validation for incoming API requests.
*   **Structured Error Handling:** Centralized error handling middleware.
*   **Relational Database Management:** Uses Sequelize ORM for interactions with MySQL database.

## 🛠️ Tech Stack

*   **Runtime:** [Node.js](https://nodejs.org/) (v18 or later recommended)
*   **Framework:** [Express.js](https://expressjs.com/)
*   **Language:** JavaScript (potential to evolve to TypeScript)
*   **Database:** [MySQL](https://www.mysql.com/)
*   **ORM (Object-Relational Mapper):** [Sequelize](https://sequelize.org/)
*   **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/), [bcryptjs](https://www.npmjs.com/package/bcryptjs) for password hashing.
*   **Environment Management:** [dotenv](https://www.npmjs.com/package/dotenv)
*   **Development Utilities:** [nodemon](https://nodemon.io/) for auto-restarting the server during development.
*   **Middleware:** [cors](https://www.npmjs.com/package/cors) for Cross-Origin Resource Sharing.

## 🏗️ Backend Architecture

The backend follows a layered architecture to promote separation of concerns, maintainability, and scalability:

1.  **Routes (`src/api/routes/`):** Define the API endpoints (URLs and HTTP methods). They receive requests and pass them to the appropriate controllers.
2.  **Controllers (`src/api/controllers/`):** Handle the incoming request and outgoing response. They parse request data (params, query, body), call service methods to perform business logic, and then format and send the HTTP response.
3.  **Services (`src/services/`):** Contain the core business logic of the application. They interact with models to perform data operations and can orchestrate calls to multiple models or other services.
4.  **Models (`src/models/`):** Define the structure of the data (database schema) and provide an interface for interacting with the database (using Sequelize).
5.  **Middleware (`src/middleware/`):** Functions that execute during the request-response cycle. Used for tasks like authentication, authorization, error handling, and request validation.
6.  **Config (`src/config/`):** Manages application configuration, including database connections and environment variables.

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (comes with Node.js)
*   MySQL server installed and running (e.g., via XAMPP, Docker, or a standalone installation).

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
    *   Fill in your MySQL database credentials (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`), `PORT`, and a strong, unique `JWT_SECRET`. See the [Environment Variables](#️-environment-variables) section for details.
5.  **Database Setup:**
    *   Ensure your MySQL server is running.
    *   Create the database specified in your `.env` file (e.g., `artnft_db`).
    *   Apply the database schema using the `schema.sql` file. From within this backend directory, you can use a command like (adjust for your MySQL client and credentials):
        ```bash
        mysql -u your_mysql_user -p your_database_name < schema.sql
        ```
        (You will be prompted for your MySQL password). Alternatively, use a GUI tool like phpMyAdmin or MySQL Workbench to import and run `schema.sql`.

### Running the Development Server

```bash
npm run dev
```
This will start the server using `nodemon`, which automatically restarts on file changes. The server typically runs on `http://localhost:5000` (or the `PORT` specified in your `.env`). Look for console messages indicating the server is running and connected to the database.

To run in production mode (though `nodemon` is generally for development):
```bash
npm start
```

## 📁 Project Structure

A brief overview of the `src/` directory:

```
artnft-backend-node/
├── src/
│   ├── api/                     # API layer: routes, controllers, and validators
│   │   ├── controllers/         # Request handlers, interact with services
│   │   ├── routes/              # Define API endpoints and link to controllers
│   │   └── validators/          # (Placeholder) Request data validation logic
│   ├── config/                  # Configuration files (database, environment, passport)
│   ├── middleware/              # Express middleware (authentication, error handling)
│   ├── models/                  # Sequelize database models (User, NFT, Category, etc.)
│   ├── services/                # Business logic layer, interacts with models
│   ├── utils/                   # Utility functions (helpers, error classes, etc.)
│   ├── app.js                   # Express application setup, middleware registration, route mounting
│   └── server.js                # Main server entry point (starts HTTP server, connects to DB)
├── .env                         # Local environment variables (ignored by Git)
├── .env.example                 # Example environment variables
├── package.json                 # Project dependencies and scripts
├── schema.sql                   # MySQL database schema definition and mock data
└── README.md                    # This file
```

## 💾 Database Schema

The database schema is defined in `schema.sql`. It creates the necessary tables for users, NFTs, categories, collections, bids, favorites, and other supporting entities. It also includes mock data for initial testing, particularly for user accounts.

Key tables include:
*   `users`: Stores user information, including hashed passwords and roles.
*   `categories`: Defines NFT categories.
*   `collections`: Allows users to group their NFTs.
*   `nfts`: Stores detailed information about each NFT, including its creator, owner, price, and status.
*   `bids`: Tracks bids made on auctionable NFTs.
*   `favorites`: Manages users' favorited NFTs.
*   See `schema.sql` for the full structure, relationships, and indexes.

## 📈 API Endpoints Overview

This section outlines the primary backend API endpoints and the frontend screens/features they are intended to support.

<details>
<summary><strong>Authentication (User & Admin)</strong></summary>

*   **Screens:** Login Page (`/login`), Signup Page (`/signup`), Admin Login (`/admin/login`)
*   **Endpoints:**
    *   `POST /api/auth/signup` - User registration.
        *   Controller: `auth.controller.js -> signup`
        *   Service: `auth.service.js -> signupUser`
    *   `POST /api/auth/login` - User login.
        *   Controller: `auth.controller.js -> login`
        *   Service: `auth.service.js -> loginUser`
    *   `POST /api/admin/auth/login` - Admin login.
        *   Controller: `admin.auth.controller.js -> login`
        *   Service: `auth.service.js -> loginAdmin`
    *   *(Future: `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`)*
</details>

<details>
<summary><strong>Home Dashboard (`/home`)</strong></summary>

*   **Features:** Latest Activity, New From Artists You Follow, Artist Spotlights, Explore Categories, Popular Collections.
*   **Endpoints:**
    *   `GET /api/nfts?sortBy=createdAt&sortOrder=desc&limit=X` - For "Latest Activity".
    *   `GET /api/nfts?collectionId=Y&limit=X` - For "Popular Collections".
    *   `GET /api/users/:userId/following/nfts?limit=X` - (Requires `user_follows` table) For "New From Artists You Follow".
    *   `GET /api/promotions?type=artist_spotlight&limit=X` - For "Artist Spotlights".
    *   `GET /api/categories` - For "Explore Categories".
    *   `POST /api/users/:userIdToFollow/follow` - (Requires `user_follows` table) For follow/unfollow button on artist spotlights.
        *   Controller: `user.controller.js` (needs implementation)
        *   Service: `user.service.js` (needs implementation)
</details>

<details>
<summary><strong>NFT Creation Page (`/create-nft`)</strong></summary>

*   **Features:** Image upload, title, description, price, category, tags, collection selection, traits, royalties, unlockable content.
*   **Endpoints:**
    *   `POST /api/nfts` - Create a new NFT.
        *   Controller: `nft.controller.js -> createNft`
        *   Service: `nft.service.js -> createNft`
    *   `GET /api/categories` - To populate category dropdown.
    *   `GET /api/users/me/collections` - (Requires auth) To populate user's collections dropdown.
    *   *(Future: `POST /api/upload/image` - If handling image uploads via backend first)*
</details>

<details>
<summary><strong>NFT Detail Page (`/nft/[id]`)</strong></summary>

*   **Features:** Display NFT details, artist info, auction system (bids, countdown), buy now, place bid, add to favorites, related NFTs.
*   **Endpoints:**
    *   `GET /api/nfts/:id` - Get specific NFT details (should include creator, owner, category, bids, etc.).
        *   Controller: `nft.controller.js -> getNftById`
        *   Service: `nft.service.js -> getNftById`
    *   `POST /api/nfts/:id/bid` - Place a bid (requires auth).
        *   Controller: `nft.controller.js -> placeBid`
        *   Service: `nft.service.js -> placeBid` (and `bid.service.js`)
    *   `POST /api/nfts/:id/buy` - Buy NFT (requires auth, more complex logic).
        *   Controller: (Needs implementation)
        *   Service: (Needs implementation, involves ownership transfer)
    *   `POST /api/users/me/favorites` - Add/remove NFT from favorites (requires auth).
        *   Controller: (Needs implementation, e.g., `user.controller.js -> toggleFavorite`)
        *   Service: (Needs implementation, e.g., `user.service.js -> toggleFavoriteNft`)
    *   `GET /api/nfts?relatedTo=:id&limit=X` - For "Related NFTs".
</details>

<details>
<summary><strong>User Profile/Dashboard (`/profile`)</strong></summary>

*   **Features:** Profile summary, key stats, owned NFTs, favorites, transaction history, recent activity.
*   **Endpoints:**
    *   `GET /api/users/profile` - Get current authenticated user's profile (requires auth).
        *   Controller: `user.controller.js -> getUserProfile`
        *   Service: `user.service.js -> getUserById`
    *   `PUT /api/users/profile` - Update current authenticated user's profile (requires auth).
        *   Controller: `user.controller.js -> updateUserProfile`
        *   Service: `user.service.js -> updateUser`
    *   `GET /api/users/:userId/nfts?type=owned&limit=X&page=Y` - For "Owned NFTs" tab.
        *   Controller: `user.controller.js -> getUserNfts`
        *   Service: `nft.service.js -> getNftsByOwner`
    *   `GET /api/users/me/favorites?limit=X&page=Y` - For "Favorites" tab (requires auth).
    *   `GET /api/users/me/transactions?limit=X&page=Y` - For "Transaction History" (requires `transactions` table & service).
    *   `GET /api/users/me/activity?limit=X&page=Y` - For "Recent Activity" (requires activity logging service).
    *   `GET /api/announcements?limit=X` - For platform announcements.
</details>

<details>
<summary><strong>Search Page (`/search`)</strong></summary>

*   **Features:** Search by keyword, filter by category, price, status; sort results.
*   **Endpoints:**
    *   `GET /api/nfts?searchTerm=Z&category=A&priceMin=B&priceMax=C&status=D&sortBy=E&sortOrder=F&limit=X&page=Y` - Comprehensive search endpoint.
        *   Controller: `nft.controller.js -> getAllNfts`
        *   Service: `nft.service.js -> getAllNfts` (with robust filtering/sorting logic)
    *   `GET /api/categories` - To populate category filter options.
</details>

<details>
<summary><strong>Category Pages (`/category/[slug]`)</strong></summary>

*   **Features:** List NFTs belonging to a specific category.
*   **Endpoints:**
    *   `GET /api/categories/:slugOrId` - Get category details.
    *   `GET /api/nfts?categorySlug=:slug&limit=X&page=Y` - Get NFTs for that category.
</details>

<details>
<summary><strong>Notifications Page (`/notifications`)</strong></summary>

*   **Features:** Display user notifications.
*   **Endpoints:**
    *   `GET /api/users/me/notifications?limit=X&page=Y` - Fetch notifications for the logged-in user (requires `notifications` table).
    *   `PUT /api/users/me/notifications/:notificationId/read` - Mark notification as read.
    *   `PUT /api/users/me/notifications/read-all` - Mark all as read.
</details>

<details>
<summary><strong>Settings Page (`/settings`)</strong></summary>

*   **Features:** Account management (email/password change), notification preferences.
*   **Endpoints:**
    *   `PUT /api/users/profile/change-email` (Requires auth, secure implementation).
    *   `PUT /api/users/profile/change-password` (Requires auth, secure implementation).
    *   `GET /api/users/me/notification-preferences` (Requires `user_notification_preferences` table).
    *   `PUT /api/users/me/notification-preferences`
</details>

<details>
<summary><strong>Admin Panel - User Management (`/admin/users`)</strong></summary>

*   **Features:** View, search, filter, update user status/role, delete users.
*   **Endpoints (all require admin auth):**
    *   `GET /api/admin/users?limit=X&page=Y&searchTerm=Z&status=A&role=B`
        *   Controller: `admin.user.controller.js -> getAllUsers`
        *   Service: `admin.user.service.js -> getAllUsers`
    *   `GET /api/admin/users/:id`
        *   Controller: `admin.user.controller.js -> getUserById`
        *   Service: `admin.user.service.js -> getUserById`
    *   `PUT /api/admin/users/:id` - Update user (e.g., role, status).
        *   Controller: `admin.user.controller.js -> updateUser`
        *   Service: `admin.user.service.js -> updateUser`
    *   `DELETE /api/admin/users/:id`
        *   Controller: `admin.user.controller.js -> deleteUser`
        *   Service: `admin.user.service.js -> deleteUser`
</details>

<details>
<summary><strong>Admin Panel - NFT Management (`/admin/nfts`)</strong></summary>

*   **Features:** View, search, filter NFTs; change NFT status (feature, hide, etc.).
*   **Endpoints (all require admin auth):**
    *   `GET /api/nfts?adminView=true&...` (or a dedicated `/api/admin/nfts` route) - Admin view of all NFTs.
    *   `PUT /api/admin/nfts/:id/status` - Update NFT status (e.g., 'listed', 'hidden', 'featured').
        *   Controller: `admin.nft.controller.js -> updateNftStatus`
        *   Service: `nft.service.js -> updateNftStatus` (or a dedicated admin NFT service method)
    *   `POST /api/admin/nfts` - Manually add an NFT.
    *   `PUT /api/admin/nfts/:id` - Manually edit an NFT.
    *   `DELETE /api/admin/nfts/:id` - Manually delete an NFT.
</details>

<details>
<summary><strong>Admin Panel - Category Management (`/admin/categories`)</strong></summary>

*   **Features:** Create, view, edit, delete categories.
*   **Endpoints (all require admin auth, already defined in `category.routes.js`):**
    *   `GET /api/categories`
    *   `GET /api/categories/:id`
    *   `POST /api/categories`
    *   `PUT /api/categories/:id`
    *   `DELETE /api/categories/:id`
</details>

<details>
<summary><strong>Admin Panel - Other Sections</strong></summary>
Endpoints for Promotions, Analytics, Audit Log, Moderation, Tasks, and Site Settings would follow a similar pattern, typically under an `/api/admin/...` path, requiring admin authentication, and interacting with their respective tables (`promotions`, `admin_audit_log`, `reports`, `admin_tasks`, `platform_settings`).
</details>


## 🔒 Security Considerations

*   **Password Hashing:** Passwords are hashed using `bcryptjs` before being stored in the database.
*   **JWT Authentication:** Stateless authentication is implemented using JSON Web Tokens. Ensure `JWT_SECRET` is strong and kept private.
*   **HTTPS:** In production, always use HTTPS to protect data in transit.
*   **Input Validation:** (Crucial To-Do) All incoming data from requests must be validated to prevent injection attacks and ensure data integrity. Libraries like `express-validator` or `zod` can be used.
*   **Rate Limiting:** Consider implementing rate limiting to prevent abuse of API endpoints.
*   **Data Sanitization:** Sanitize any user-provided data before storing it or displaying it to prevent XSS attacks (though this is often more critical on the frontend rendering side).
*   **Principle of Least Privilege:** Ensure users and admins only have access to the data and actions they are authorized for.

## 🧪 Testing (Guidance)

While formal tests are not yet implemented, a robust testing strategy is essential for a production application. Consider:

*   **Unit Tests:** Test individual functions and modules in isolation (e.g., service methods, utility functions). Tools: [Jest](https://jestjs.io/), [Mocha](https://mochajs.org/).
*   **Integration Tests:** Test the interaction between different parts of your application (e.g., controller calling a service, service interacting with the database). Tools: Jest, Supertest (for API endpoint testing).
*   **End-to-End (E2E) Tests:** (More relevant for the full application) Test user flows through the entire application. Tools: Cypress, Playwright.

For backend API testing, [Supertest](https://www.npmjs.com/package/supertest) is excellent for making HTTP requests to your Express app and asserting responses.

## ⚙️ Environment Variables

Key environment variables are managed in a `.env` file (copied from `.env.example`) in the root of this backend project.
Essential variables include:

*   `NODE_ENV`: Set to `development` or `production`.
*   `PORT`: The port the backend server will listen on (e.g., `5000`).
*   `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`: MySQL database connection details.
*   `JWT_SECRET`: A strong, random secret key for signing JSON Web Tokens. **This must be kept secure and should be different for development and production.**
*   `JWT_EXPIRES_IN`: How long JWTs are valid (e.g., `1d`, `7d`, `1h`).

## Error Handling

A global error handling middleware (`src/middleware/errorHandler.middleware.js`) is in place to catch unhandled errors and send structured JSON responses. It can be extended to handle specific error types (e.g., Sequelize validation errors) more gracefully.

## ☁️ Deployment Considerations

*   **Environment Variables:** Ensure all necessary environment variables (especially `NODE_ENV=production`, database credentials, `JWT_SECRET`) are set in the production environment.
*   **Database:** Use a managed database service (e.g., AWS RDS, Google Cloud SQL, DigitalOcean Managed Databases) for production.
*   **Process Manager:** Use a process manager like [PM2](https://pm2.keymetrics.io/) to keep your Node.js application running and manage logs.
*   **HTTPS:** Configure a reverse proxy (like Nginx or Caddy) to handle HTTPS and serve your Node.js application.
*   **Build Step:** If using TypeScript or a build process, ensure you have a build script in `package.json`.
*   **Logging:** Implement more robust logging for production (e.g., Winston, Pino) and send logs to a centralized logging service.
*   **Scalability:** Consider containerization (Docker) and orchestration (Kubernetes) for larger deployments.

## 🤝 Contributing

Please refer to the main project's contributing guidelines. For backend-specific contributions:
1.  Ensure your code adheres to the existing style and structure.
2.  Write or update tests for any new features or bug fixes.
3.  Update API documentation if endpoints are added or changed.

## 🗺️ Roadmap (Backend Focus)

*   Implement full CRUD operations and business logic for all defined models and services.
*   Robust input validation for all API endpoints.
*   Implement comprehensive unit and integration tests.
*   Real-time features (e.g., auction updates) using WebSockets (e.g., Socket.IO).
*   Advanced search capabilities (e.g., using Elasticsearch).
*   Background job processing for tasks like image optimization or sending email notifications.
*   Transaction management for complex operations (e.g., NFT sales).
*   Refine API documentation (e.g., using Swagger/OpenAPI).

## 📄 License

(Specify your license, e.g., MIT)
```

This is a significant update to your backend's README, making it much more informative for anyone working on or looking to understand the backend system.
This enhanced README.md should give a very good overview of your backend. Remember to replace placeholder information like "(Specify your license)" with actual details.