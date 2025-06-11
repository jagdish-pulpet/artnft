
# ArtNFT Marketplace

**A Modern Platform for Discovering, Creating, and Trading Digital Art & NFTs**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <a href="https://github.com/jagdish-pulpet/artnft/stargazers"><img src="https://img.shields.io/github/stars/jagdish-pulpet/artnft?style=flat-square" alt="GitHub Stars"/></a>
  <a href="https://github.com/jagdish-pulpet/artnft/network/members"><img src="https://img.shields.io/github/forks/jagdish-pulpet/artnft?style=flat-square" alt="GitHub Forks"/></a>
  <a href="https://github.com/jagdish-pulpet/artnft/issues"><img src="https://img.shields.io/github/issues/jagdish-pulpet/artnft?style=flat-square" alt="GitHub Issues"/></a>
  <a href="https://github.com/jagdish-pulpet/artnft/commits/main"><img src="https://img.shields.io/github/last-commit/jagdish-pulpet/artnft?style=flat-square" alt="GitHub Last Commit"/></a>
  <br/>
  <a href="package.json"><img src="https://img.shields.io/badge/frontend-v0.1.0-blue?style=flat-square" alt="Frontend Version"/></a>
  <a href="artnft-backend-node/package.json"><img src="https://img.shields.io/badge/backend-v1.0.0-green?style=flat-square" alt="Backend Version"/></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Frontend-Next.js-black?style=flat-square&logo=next.js&logoColor=white" alt="Built with Next.js"/></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Backend-Node.js-blueviolet?style=flat-square&logo=nodedotjs&logoColor=white" alt="Backend: Node.js"/></a>
  <br/>
  <a href="https://www.mysql.com"><img src="https://img.shields.io/badge/Database-MySQL-orange?style=flat-square&logo=mysql&logoColor=white" alt="Database: MySQL"/></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Styling-TailwindCSS-cyan?style=flat-square&logo=tailwindcss&logoColor=white" alt="Styling: Tailwind CSS"/></a>
  <a href="https://firebase.google.com/docs/genkit"><img src="https://img.shields.io/badge/AI-Genkit-brightgreen?style=flat-square&logo=google&logoColor=white" alt="AI: Genkit"/></a>
  <br/>
  <a href="https://github.com/jagdish-pulpet/artnft"><img src="https://img.shields.io/github/languages/top/jagdish-pulpet/artnft?style=flat-square" alt="GitHub top language"/></a>
  <a href="https://github.com/jagdish-pulpet/artnft"><img src="https://img.shields.io/github/repo-size/jagdish-pulpet/artnft?style=flat-square" alt="GitHub repo size"/></a>
  <a href="https://github.com/jagdish-pulpet/artnft/graphs/contributors"><img src="https://img.shields.io/github/contributors/jagdish-pulpet/artnft?style=flat-square" alt="GitHub contributors"/></a>
  <br/>
  <a href="https://github.com/jagdish-pulpet/artnft/pulls"><img src="https://img.shields.io/github/issues-pr/jagdish-pulpet/artnft?style=flat-square" alt="GitHub open pull requests"/></a>
  <a href="https://github.com/jagdish-pulpet/artnft/pulls?q=is%3Apr+is%3Aclosed"><img src="https://img.shields.io/github/issues-pr-closed/jagdish-pulpet/artnft?style=flat-square" alt="GitHub closed pull requests"/></a>
</p>

ArtNFT Marketplace is a cutting-edge, full-stack web application designed for artists, collectors, and enthusiasts in the burgeoning world of Non-Fungible Tokens (NFTs). It offers a seamless and engaging experience for discovering unique digital artworks, creating and listing NFTs, and interacting with a vibrant community. The frontend is built with Next.js, and it communicates with a dedicated Node.js (Express) backend and a MySQL database. AI capabilities are integrated using Genkit.

## Table of Contents

1.  [✨ Key Features](#-key-features)
2.  [📄 Application Screens Overview](#-application-screens-overview)
3.  [🖼️ Screenshots](#️-screenshots)
4.  [🛠️ Tech Stack](#️-tech-stack)
5.  [🏗️ Project Architecture](#️-project-architecture)
6.  [🚀 Getting Started](#-getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation & Setup](#installation--setup)
        *   [Frontend Setup (Next.js)](#frontend-setup-nextjs)
        *   [Backend Setup (Node.js/Express/MySQL)](#backend-setup-nodejsexpressmysql)
    *   [Running Development Servers](#running-development-servers)
7.  [📁 Project Structure](#-project-structure)
8.  [🎨 Styling & Theming](#-styling--theming)
9.  [🤖 AI Integration (Genkit)](#-ai-integration-genkit)
10. [🌍 Building for Production](#-building-for-production)
11. [☁️ Deployment](#️-deployment)
12. [🤝 Contributing](#-contributing)
13. [🗺️ Roadmap](#️-roadmap)
14. [📄 License](#-license)
15. [📞 Contact](#-contact)

## ✨ Key Features

<details>
<summary><strong>Comprehensive User Authentication (with Node.js Backend):</strong></summary>

*   Secure sign-up (Email, Password, Confirm Password) and login (Email, Password) for web users, handled by the Node.js backend (`artnft-backend-node`).
*   Admin login (Email, Password) via the Node.js backend.
*   Simulated wallet connection UI for providers like MetaMask, WalletConnect, and Coinbase Wallet (`/connect-wallet`).
*   Splash screen for initial app loading.
*   Clear T&C and Privacy Policy links during signup.
</details>

<details>
<summary><strong>Dynamic Home Dashboard (`/home`):</strong></summary>

*   **Responsive Layout:** Mobile-first design with an auto-hiding bottom navigation for mobile and a persistent global header (with search) for desktop. Both header (desktop) and bottom navigation (mobile) auto-hide/show on scroll for an improved viewing experience.
*   **Engaging Hero Section:** Features a prominent banner with brand messaging and direct calls-to-action ("Explore Marketplace", "Create NFT").
*   **Personalized Content Feeds:**
    *   **"Latest Activity":** Displays recently listed or trending NFTs using interactive `NFTCard` components.
    *   **"New From Artists You Follow":** Shows new creations from followed artists. *Data to be fetched from the Node.js backend.* If no artists are followed, a call-to-action prompts users to discover and follow creators.
*   **Discovery & Engagement Features:**
    *   **"Artist Spotlights":** Highlights featured artists with profile images, names, bios, and follow/unfollow functionality (interactions to call backend APIs). Includes user avatar in header.
    *   **"Explore Categories":** A visually rich grid of clickable category cards (e.g., Digital Art, Photography, Music), each leading to a dedicated category page.
    *   **"Popular Collections":** Showcases trending or curated NFT collections (data from backend).
*   **Community & Platform Updates:**
    *   **"Community Highlights":** Features platform news, specific artist achievements, or upcoming events in an engaging card format.
</details>

<details>
<summary><strong>Advanced NFT Creation & Listing (`/create-nft`):</strong></summary> User-friendly interface for artists to mint their own NFTs, including:
*   Image upload with preview (supports PNG, JPG, GIF; 10MB limit).
*   Input fields for Title, Description, Price (ETH), Category, and Tags.
*   **AI-Powered Content Assistance (Genkit):**
    *   Generate NFT Description (based on image, title, optional keywords).
    *   Suggest NFT Titles (based on image, optional concept/description).
    *   Suggest NFT Tags (based on image, title, description).
*   Collection management: Select from existing collections or create new ones via a dialog.
*   Custom properties/traits: Add and manage key-value traits for NFTs.
*   Royalty percentage setting.
*   Unlockable content: Option to add content visible only to the NFT owner.
*   **Live Preview Card (Desktop):** Dynamically updates to show how the NFT will appear with current details.
*   Minting summary and submission to the Node.js backend for processing.
</details>

<details>
<summary><strong>Detailed NFT Page (`/nft/[id]`):</strong></summary> Comprehensive view of individual NFTs, including:
*   Large image display with hover zoom effect.
*   Detailed description, attributes, and artist information (profile picture, name, link to profile). *Data fetched from Node.js backend.*
*   Auction system: Displays starting bid, current highest bid, and a real-time countdown timer for auction end (backend driven).
*   "Buy Now" functionality and pricing. *Interaction calls Node.js backend.*
*   Interactive "Place Bid" form. *Interaction calls Node.js backend.*
*   Bid history display.
*   "Add to Favorites" button (interaction with backend, toast feedback).
*   Social sharing options (Twitter, Instagram, Copy Link).
*   "Related NFTs" section for further discovery (data from backend).
</details>

<details>
<summary><strong>User-Centric Dashboard (`/profile` -> "Dashboard"):</strong></summary> A personalized hub for users, featuring:
*   **Profile Summary:** Displays user avatar, username, bio, and provides "Edit Profile" & "Settings" buttons.
*   **Key Stats:** Overview of NFTs Owned, Favorites, Items for Sale, and Total Earnings (data from backend).
*   **Tabbed Navigation:**
    *   **Owned NFTs:** Grid view of NFTs owned by the user.
    *   **Favorites:** Grid view of NFTs favorited by the user.
    *   **Transaction History:** Detailed list of past activities (Purchases, Sales, Mints, Bids) with icons, item names, color-coded amounts, dates, and statuses.
    *   **Recent Activity:** A feed of the user's actions (minting, listing, bids, favorites, follows) with icons, messages, timestamps, and direct links.
*   **Platform Updates & Announcements:** Section displaying mock announcements that would originate from the Admin Panel.
*   Informative empty states for all sections.
</details>

<details>
<summary><strong>Robust NFT Discovery & Search (`/search`, Global Header):</strong></summary>
*   **Global Header Search:** A persistent search bar in the desktop header (hidden on mobile), allowing users to search from anywhere. Search terms update the URL and navigate to/refresh the search page.
*   **Dedicated Search Page (`/search`):**
    *   Displays results based on the query from the global search or direct navigation.
    *   Recent searches are shown as clickable badges that update the URL.
    *   **Advanced Filtering:** By Category, Price Range, and Status (Buy Now / On Auction).
    *   **Sorting Options:** Recently Added, Oldest First, Price (Low to High, High to Low), Title (A-Z, Z-A).
    *   **View Modes:** Switch between Grid and List views for search results.
    *   "Load More" functionality for paginating results.
    *   Clear empty states for no results or when no search is active.
    *   *Search results fetched from Node.js backend.*
</details>

<details>
<summary><strong>Category-Specific Pages (`/category/[slug]`):</strong></summary>
*   Dynamically generated pages for each NFT category (e.g., Digital Art, Photography).
*   Lists NFTs belonging to the selected category (data from backend).
*   Includes category title, description, and a link back to all categories.
*   Graceful handling for non-existent categories.
</details>

<details>
<summary><strong>Notifications System (`/notifications`):</strong></summary> Real-time alerts (driven by backend) for:
*   New listings from followed artists.
*   Price drops on favorited items.
*   Auction updates and outcomes.
*   Successful transactions.
*   Features include read/unread status, icons per notification type, and filter options.
</details>

<details>
<summary><strong>Comprehensive Settings Page (`/settings`):</strong></summary>
*   Sections for Account Management (Change Email/Password - interacts with backend, Connect Wallet - simulated).
*   Notification Preferences (toggles for various alert types).
*   Appearance (Dark Mode toggle that persists in `localStorage`).
*   Privacy settings and links to Privacy Policy.
*   Help & Support links (FAQs, Contact, Terms of Service).
*   Logout functionality (invalidates session/token on backend).
</details>

<details>
<summary><strong>Crypto Market Stats Page (`/stats`):</strong></summary>
*   Displays cryptocurrency market data fetched from the CoinMarketCap API via a Next.js API route (`/api/crypto-stats`).
*   Features search, sort, "Load More" functionality, and highlights top gainers/losers.
*   Handles loading, error (including API key missing), and empty states.
</details>

<details>
<summary><strong>Robust Admin Panel (Interacts with Node.js Backend, accessible via `/admin`):</strong></summary>
*   **Secure Login (`/admin/login`):** Dedicated login for administrators (credentials verified by backend).
*   **Main Dashboard (`/admin/dashboard`):** Overview of key platform statistics (total users, NFTs, sales volume), recent platform activity, and links to other admin sections.
*   **User Management (`/admin/users`):** View list of registered users, search/filter, view user details, and perform actions like suspend/activate user.
*   **NFT Management (`/admin/nfts`):** View all NFTs, search/filter, view NFT details, and perform actions like feature/hide NFT. Includes ability to manually add or edit NFT listings.
*   **Categories Management (`/admin/categories`):** Create, view, edit, and delete NFT categories.
*   **Promotions Management (`/admin/promotions`):** Manage featured NFTs and spotlighted artists.
*   **Platform Analytics (`/admin/analytics`):** View charts and graphs for sales trends, user sign-ups, and NFT distribution (data from backend).
*   **Audit Log (`/admin/audit-log`):** Track significant administrative actions and system events (data from backend).
*   **Content Moderation (`/admin/moderation`):** Queue for reviewing reported content (NFTs, user profiles) and taking moderation actions.
*   **Tasks & Alerts (`/admin/tasks`):** A dashboard for admins to view pending tasks and important system alerts.
*   **Site Settings (`/admin/settings`):** Manage global platform configurations like site name, tagline, theme colors (simulated), maintenance mode, and API keys (display only).
*   **Feature Toggles (`/admin/feature-toggles`):** (Development Tool) Manage visibility of certain convenience features on welcome/login screens via local storage.
*   **Responsive Admin Layout:** Sidebar navigation for desktop, sheet-based navigation for mobile.
</details>

<details>
<summary><strong>Responsive Design & UI:</strong></summary>
*   Mobile-first approach ensuring a seamless experience across devices.
*   Auto-hiding navigation elements (bottom nav on mobile, global header on desktop) on scroll, with refined scroll delta logic.
*   Modern, professional look and feel using ShadCN UI components and Tailwind CSS.
</details>

<details>
<summary><strong>Theming:</strong></summary>
*   Supports light and dark modes with a CSS HSL variable-based theme in `src/app/globals.css`.
*   Theme colors (primary: Electric Blue, accent: Soft Pink) are applied.
</details>

<details>
<summary><strong>Static Content Pages:</strong></summary>
*   Terms of Service (`/terms`).
*   Privacy Policy (`/privacy`).
</details>

## 📄 Application Screens Overview

This section provides a high-level overview of the main screens available in the ArtNFT Marketplace application and its Admin Panel.

<details>
<summary><strong>User-Facing Application Screens</strong></summary>

*   **Splash Screen (`/`):** Initial loading screen of the application.
*   **Welcome Page (`/welcome`):** Landing page for new users with options to log in or sign up. Includes development shortcuts (Admin Panel, GitHub, Guest login) managed by Feature Toggles.
*   **Login Page (`/login`):** For existing users to access their accounts via Email/Password, communicating with the Node.js backend.
*   **Signup Page (`/signup`):** For new users to create accounts via Email/Password/Confirm Password, communicating with the Node.js backend.
*   **Forgot Password Page (`/forgot-password`):** For users to reset their passwords (backend logic required).
*   **Connect Wallet Page (`/connect-wallet`):** (Simulated) UI for connecting crypto wallets.
*   **Home Dashboard (`/home`):** Main dashboard after login, featuring hero section, activity feeds, artist spotlights, categories, and community highlights.
*   **Create NFT Page (`/create-nft`):** Interface for artists to mint NFTs, with AI assistance and live preview, submitting data to the Node.js backend.
*   **NFT Detail Page (`/nft/[id]`):** Comprehensive view of individual NFTs, including details, auction system, and purchase options, all data-driven by the backend.
*   **User Dashboard/Profile (`/profile`):** Personalized hub for users to view their owned NFTs, favorites, transaction history, and recent activity. Also displays admin announcements. Data from backend.
*   **Search Page (`/search`):** Dedicated page for searching NFTs with advanced filtering and sorting, driven by URL query parameters and backend queries.
*   **Category Page (`/category/[slug]`):** Dynamically generated pages listing NFTs for specific categories, data from backend.
*   **Notifications Page (`/notifications`):** Real-time alerts for platform activities, driven by the backend.
*   **Settings Page (`/settings`):** Page for users to manage account settings, notification preferences, appearance (dark mode), and privacy. Interacts with backend for account changes.
*   **Crypto Market Stats Page (`/stats`):** Displays cryptocurrency market data fetched from CoinMarketCap API via a Next.js API Route.
*   **Terms of Service Page (`/terms`):** Static page for terms and conditions.
*   **Privacy Policy Page (`/privacy`):** Static page for the privacy policy.
</details>

<details>
<summary><strong>Admin Panel Screens</strong></summary>

*   **Admin Login Page (`/admin/login`):** Secure login for administrators, authenticating against the Node.js backend.
*   **Admin Dashboard (`/admin/dashboard`):** Overview of key platform statistics and recent activity, data from backend.
*   **User Management (`/admin/users`):** View, search, filter, and manage registered users.
*   **NFT Management (`/admin/nfts`):** View, search, filter, and manage all NFTs.
    *   **Add NFT (`/admin/nfts/add`):** Manually add new NFT listings.
    *   **Edit NFT (`/admin/nfts/[id]/edit`):** Modify details of existing NFT listings.
*   **Categories Management (`/admin/categories`):** Create, view, edit, and delete NFT categories.
*   **Promotions Management (`/admin/promotions`):** Manage featured NFTs and spotlighted artists.
*   **Platform Analytics (`/admin/analytics`):** View charts for sales trends, user sign-ups, etc (data from backend).
*   **Audit Log (`/admin/audit-log`):** Track significant administrative actions and system events (data from backend).
*   **Content Moderation (`/admin/moderation`):** Queue for reviewing reported content and taking moderation actions.
*   **Tasks & Alerts (`/admin/tasks`):** Dashboard for admins to view pending tasks and system alerts.
*   **Site Settings (`/admin/settings`):** Manage global platform configurations (site name, theme colors, API keys - simulated for some, backend driven for others).
*   **Feature Toggles (`/admin/feature-toggles`):** (Development Tool) Control visibility of certain helper UI elements on welcome/login pages.
</details>

## 🖼️ Screenshots

*(Placeholder for screenshots of key application screens: Home Dashboard, NFT Details, Create NFT, Dashboard Page, Search Page, Admin Panel views, etc.)*

## 🛠️ Tech Stack

The ArtNFT Marketplace is a full-stack application composed of a Next.js frontend and a Node.js backend.

**Frontend (User Interface & Client-Side Logic):**
*   **Framework:** [Next.js](https://nextjs.org/) (v15+ with App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/) (built on Radix UI)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (utility-first, with HSL-based theming)
*   **AI Integration (Specific Features):** [Genkit (by Google)](https://firebase.google.com/docs/genkit) utilizing Google AI models (e.g., Gemini) for features like NFT content generation assistance. Genkit flows run within the Next.js server environment.
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **State Management (Client-Side):**
    *   React Hooks (`useState`, `useEffect`, `useContext`, `useReducer` via `useToast`).
    *   `useRouter`, `usePathname`, `useSearchParams` for route-based state.
*   **Form Handling:** Standard React form handling, `react-hook-form` for more complex scenarios.
*   **Routing:** Next.js App Router.
*   **Font:** 'Inter' (via Google Fonts).
*   **API Communication (Frontend):**
    *   `fetch` API for Next.js API Routes (e.g., `/api/crypto-stats`).
    *   `fetch` API to communicate with the dedicated Node.js backend (`artnft-backend-node/`) for core application data and authentication.

**Backend (Server-Side Logic & Database - In Progress, located in `artnft-backend-node/`):**
*   **Framework:** [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
*   **Language:** JavaScript (initial implementation, can be evolved to TypeScript)
*   **Database:** [MySQL](https://www.mysql.com/)
*   **ORM (Object-Relational Mapper):** [Sequelize](https://sequelize.org/) for MySQL database interactions.
*   **Authentication:** JWT (JSON Web Tokens) for secure sessions, `bcryptjs` for password hashing.
*   **API Layer:** RESTful APIs to be consumed by the Next.js frontend.
*   **Environment Management:** `dotenv` for managing environment variables (database credentials, JWT secrets).
*   **Other Key Libraries:** `cors` for Cross-Origin Resource Sharing.

## 🏗️ Project Architecture

ArtNFT Marketplace leverages a modern, decoupled architecture:

*   **Next.js Frontend:**
    *   **App Router:** Enables a robust file-system based routing, supporting layouts, nested routes, and optimized rendering strategies (Server Components, Client Components).
    *   **Component-Based UI:** React is used to build a modular and reusable component library, with core UI elements provided by ShadCN UI.
    *   **State Management:** Primarily React Hooks for local/component state and route-based state.
    *   **Styling:** Tailwind CSS for utility classes, global theme in `src/app/globals.css` (HSL variables).
    *   **Genkit for AI (Specific Features):** AI functionalities like NFT content generation are encapsulated in Genkit "flows." These flows are server-side modules (`'use server';`) within the Next.js application.
    *   **API Calls:** The frontend uses `fetch` to communicate with the RESTful APIs provided by the separate Node.js backend.

*   **Node.js Backend (`artnft-backend-node/`):**
    *   **Express.js Framework:** Provides the foundation for building RESTful APIs.
    *   **API Endpoints:** Exposes endpoints for user authentication (signup, login), NFT management (CRUD), category management, etc.
    *   **Business Logic:** Services layer handles core application logic.
    *   **Database Interaction:** Models (using Sequelize ORM) define the structure of data and interact with the MySQL database.
    *   **Authentication & Authorization:** Manages user sessions using JWTs and password security with bcrypt.

*   **Communication:**
    *   The Next.js frontend communicates with the Node.js backend via HTTP requests to its RESTful API endpoints.
    *   The frontend sends data (e.g., login credentials, new NFT details) to the backend and receives data (e.g., user information, NFT listings) in JSON format.
    *   The Next.js API Route for `/api/crypto-stats` directly fetches from an external API.

## 🚀 Getting Started

Follow these instructions to get both the frontend and backend running locally.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended for both frontend and backend)
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)
*   [MySQL Server](https://dev.mysql.com/downloads/mysql/) installed and running.
*   A MySQL client (e.g., phpMyAdmin, MySQL Workbench, DBeaver, or command-line client) to manage the database.

### Installation & Setup

#### Frontend Setup (Next.js - Root Project)

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone https://github.com/jagdish-pulpet/artnft.git
    cd artnft 
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Frontend Environment Variables (`.env.local` in the root project directory):**
    *   Create a `.env.local` file in the root of the project by copying `.env.local.example` (if it exists) or creating it new.
    *   Add your Google AI Studio API key (or other Genkit provider keys):
        ```env
        GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY_HERE
        ```
    *   Add your CoinMarketCap API Key (for the Stats page):
        ```env
        COINMARKETCAP_API_KEY=YOUR_COINMARKETCAP_API_KEY_HERE
        ```
    *   Add the URL for your local backend server (this will be the Node.js backend):
        ```env
        NEXT_PUBLIC_BACKEND_URL=http://localhost:5000 
        ```
        (Ensure the port `5000` matches what your Node.js backend will run on, as defined in its `.env` file).

#### Backend Setup (Node.js/Express/MySQL - `artnft-backend-node/` directory)

1.  **Navigate to the backend directory:**
    ```bash
    cd artnft-backend-node
    ```

2.  **Install backend dependencies:**
    ```bash
    npm install
    ```

3.  **Backend Environment Variables (`.env` in `artnft-backend-node/` directory):**
    *   In the `artnft-backend-node/` directory, copy the `artnft-backend-node/.env.example` file to a new file named `.env`.
    *   Open `artnft-backend-node/.env` and fill in your MySQL database credentials:
        ```env
        NODE_ENV=development
        PORT=5000 # Port the backend server will run on
        
        # MySQL Database Connection
        DB_HOST=localhost
        DB_USER=your_mysql_user
        DB_PASSWORD=your_mysql_password
        DB_NAME=artnft_db # Or your chosen database name
        DB_PORT=3306

        # JWT Configuration
        JWT_SECRET=YOUR_VERY_STRONG_AND_RANDOM_JWT_SECRET_KEY_HERE 
        JWT_EXPIRES_IN=1d # Example: token expires in 1 day
        ```
    *   **Important:** Replace `your_mysql_user`, `your_mysql_password` with your actual MySQL credentials. Choose a strong, random string for `JWT_SECRET`.

4.  **MySQL Database and Schema Setup:**
    *   Ensure your MySQL server is running.
    *   Using your MySQL client, create the database specified in `artnft-backend-node/.env` (e.g., `artnft_db`).
        ```sql
        CREATE DATABASE artnft_db; 
        ```
    *   Apply the database schema using the `artnft-backend-node/schema.sql` file. From within the `artnft-backend-node` directory, you can use a command like (adjust for your MySQL client and credentials):
        ```bash
        mysql -u your_mysql_user -p artnft_db < schema.sql
        ```
        (You will be prompted for your MySQL password).

### Running Development Servers

The Next.js frontend, Genkit (for AI flows), and the Node.js backend need to be run concurrently in separate terminal windows.

1.  **Run the Next.js frontend development server (from the root `artnft` directory):**
    ```bash
    npm run dev
    ```
    This will start the frontend application, typically on `http://localhost:9002`.

2.  **Run the Genkit development server (from the root `artnft` directory, in a separate terminal):**
    ```bash
    npm run genkit:watch
    ```
    This starts Genkit in watch mode. Genkit usually starts its developer UI on `http://localhost:4000`.

3.  **Run the Node.js backend server (from the `artnft-backend-node/` directory, in a separate terminal):**
    ```bash
    cd artnft-backend-node
    npm run dev
    ```
    This will start the backend server, typically on `http://localhost:5000` (or the `PORT` specified in `artnft-backend-node/.env`). Look for console messages indicating the server is running and connected to the database.

You should now have:
*   Frontend running on `http://localhost:9002`
*   Backend running on `http://localhost:5000`
*   Genkit Dev UI on `http://localhost:4000`

## 📁 Project Structure

The project is organized into a Next.js frontend and a separate Node.js backend.

```
.
├── artnft-backend-node/      # Node.js (Express) Backend Application
│   ├── src/
│   │   ├── api/              # API routes, controllers, validators
│   │   ├── config/           # Database, environment, passport config
│   │   ├── middleware/       # Express middleware (auth, error handling)
│   │   ├── models/           # Sequelize database models (User, NFT, etc.)
│   │   ├── services/         # Business logic layer
│   │   ├── utils/            # Utility functions
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Main server entry point
│   ├── .env.example          # Example environment variables for backend
│   ├── package.json          # Backend dependencies and scripts
│   ├── schema.sql            # MySQL database schema definition
│   └── README.md             # Backend specific README
│
├── public/                   # Frontend: Static assets (images, fonts, etc.)
├── src/                      # Frontend: Next.js application source
│   ├── ai/                   # Frontend: Genkit AI flows and configuration
│   │   ├── flows/            # Specific AI flow implementations
│   │   └── genkit.ts         # Genkit global initialization
│   │   └── dev.ts            # Genkit development server entry point
│   ├── app/                  # Frontend: Next.js App Router (pages, layouts)
│   │   ├── (admin)/          # Route group for Admin Panel
│   │   │   └── admin/ ...
│   │   ├── api/              # Next.js API routes (e.g., /api/crypto-stats)
│   │   ├── category/[slug]/page.tsx
│   │   └── ... (other frontend pages and layouts) ...
│   │   ├── globals.css       # Global styles, Tailwind CSS base, and theme
│   │   ├── layout.tsx        # Root layout for the entire application
│   │   └── page.tsx          # Root page (splash screen)
│   ├── components/           # Frontend: Reusable React components
│   │   ├── ui/               # ShadCN UI components
│   │   ├── admin/            # Admin panel specific components
│   │   └── ... (other frontend components) ...
│   ├── hooks/                # Frontend: Custom React Hooks
│   ├── lib/                  # Frontend: Utility functions (e.g., cn for classnames)
│
├── .env.local.example        # Example environment variables for frontend
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Files and directories to ignore in Git
├── apphosting.yaml           # Firebase App Hosting configuration
├── components.json           # ShadCN UI configuration file
├── next.config.ts            # Next.js configuration file
├── package.json              # Frontend: Project dependencies and scripts
├── postcss.config.js         # PostCSS configuration (for Tailwind CSS)
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file (Main Project README)
```

## 🎨 Styling & Theming

*   **Tailwind CSS:** Utility classes are used for most styling in the frontend.
*   **ShadCN UI:** Components come pre-styled but are customizable.
*   **Global Theme:** `src/app/globals.css` defines CSS HSL variables for primary, secondary, accent, background, foreground, and other colors. This allows for easy theme changes and supports light/dark mode.
*   **Dark Mode:** Implemented using Tailwind's `dark:` variant, controlled by a class on the `html` tag (managed via the Settings page and `localStorage`).

## 🤖 AI Integration (Genkit)

*   **Genkit by Google:** The project uses Genkit for specific Generative AI functionalities within the Next.js application.
*   **Flows:** AI logic is organized into "flows" located in `src/ai/flows/`. These are server-side modules within the Next.js app environment.
    *   `generateNftDescriptionFlow`: Creates compelling descriptions for NFTs.
    *   `suggestNftTitlesFlow`: Suggests catchy and relevant titles for NFTs.
    *   `suggestNftTagsFlow`: Recommends relevant tags/keywords for NFT discoverability.
*   **Models:** Configured to use Google AI models (e.g., Gemini) via the `@genkit-ai/googleai` plugin. API keys are managed through `.env.local` for the frontend.
*   **Use Cases:** Implemented in the "Create NFT" page to assist users with content generation.

## 🌍 Building for Production

**Frontend (Next.js):**
```bash
npm run build
```
To start the Next.js production server (after building):
```bash
npm run start
```

**Backend (Node.js):**
Navigate to `artnft-backend-node/`:
```bash
# No explicit build step for basic JS backend, unless using TypeScript or bundler
npm start   # Typically starts the production server (e.g., node src/server.js)
```

## ☁️ Deployment

*   **Next.js Frontend:** This project is configured for deployment on [Firebase App Hosting](https://firebase.google.com/docs/app-hosting) using `apphosting.yaml`. Alternatives include Vercel, Netlify, AWS Amplify.
*   **Node.js Backend:** Requires a Node.js hosting environment (e.g., Heroku, AWS Elastic Beanstalk, Google Cloud App Engine/Cloud Run, DigitalOcean App Platform, Render).
*   **MySQL Database:** Can be hosted on services like AWS RDS, Google Cloud SQL, DigitalOcean Managed Databases, or a self-managed MySQL server.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

Please ensure your code adheres to the project's linting and formatting standards. Include tests for new features where applicable.

## 🗺️ Roadmap

*   **Phase 1: Core Frontend & Initial Backend Setup (Partially Complete)**
    *   [x] Next.js Frontend: User Authentication pages (Login, Signup), Admin Login page - prepared to make API calls.
    *   [x] Node.js Backend (`artnft-backend-node`): Initial setup with Express, MySQL (Sequelize), and basic user/admin authentication (signup, login) boilerplate implemented.
    *   [x] Basic NFT Creation & Listing UI (Simulated with AI assistance for content; *frontend prepares data for backend*)
    *   [x] NFT Discovery UI (Featured/Latest, Categories, Global Search with Filters & Sort; *frontend preparing for backend data*)
    *   [x] NFT Detail Page UI (Simulated Auction, Buy Now, Related NFTs; *frontend interactions to use backend data*)
    *   [x] User Dashboard UI (Owned, Favorites, Transaction History, Recent Activity, Admin Announcements - Enhanced UI/UX)
    *   [x] Basic Responsive Design (Mobile-first, auto-hiding navigation, global header)
    *   [x] Light/Dark Theming (User-configurable)
    *   [x] Notifications Page UI (Simulated alerts)
    *   [x] Settings Page UI (Account, Preferences, Appearance)
    *   [x] Crypto Market Stats Page (External API integration via Next.js API Route)
    *   [x] Comprehensive Admin Panel UI (Simulated actions initially, to be wired to backend): Dashboard, User Management, NFT Management (CRUD), Categories, Promotions, Analytics, Audit Log, Moderation, Tasks & Alerts, Site Settings, Feature Toggles.

<details>
<summary><strong>Phase 2: Full Backend Implementation & Frontend Integration (In Progress)</strong></summary>

*   [ ] **Node.js Backend Development (`artnft-backend-node`):**
    *   [ ] Implement full CRUD operations for NFTs, Categories, User Profiles, etc. (interacting with MySQL via Sequelize).
    *   [ ] Develop robust auction system logic (MySQL based).
    *   [ ] Implement persistent user interactions (Follow Artist, Favorite NFT - MySQL storage).
    *   [ ] Build out remaining Admin Panel API endpoints.
    *   [ ] Add comprehensive error handling and validation.
*   [ ] **Next.js Frontend Integration:**
    *   [ ] Connect all frontend pages and components to the Node.js backend APIs.
    *   [ ] Replace all mock data with data fetched from the backend.
    *   [ ] Implement real-time updates for features like auctions (e.g., using WebSockets if supported by backend).
*   [ ] **Screen-by-Screen API Implementation & Integration Tasks:**
    *   **Authentication Screens (Login, Signup, Forgot Password):**
        *   [ ] Frontend: Send user credentials to backend `/api/auth/signup`, `/api/auth/login`.
        *   [ ] Frontend: Handle JWT token storage and usage for authenticated requests.
        *   [ ] Frontend: Implement "Forgot Password" flow calling backend.
        *   [ ] Backend: Implement password reset logic (token generation, email sending - simulated if no email service).
    *   **Home Dashboard (`/home`):**
        *   [ ] Frontend: Fetch "Latest Activity" NFTs from backend `/api/nfts?sortBy=dateListed&sortOrder=desc`.
        *   [ ] Frontend: Fetch "New From Artists You Follow" from backend (requires user follow data).
        *   [ ] Frontend: Fetch "Artist Spotlights" from backend (requires admin promotion data).
        *   [ ] Frontend: Fetch "Popular Collections" from backend.
        *   [ ] Frontend: Implement "Follow/Unfollow" artist functionality calling backend.
    *   **Create NFT Page (`/create-nft`):**
        *   [ ] Frontend: Submit new NFT data (including image upload handling to backend or cloud storage) to backend `/api/nfts`.
        *   [ ] Backend: Handle NFT creation, associate with user, store image reference.
    *   **NFT Detail Page (`/nft/[id]`):**
        *   [ ] Frontend: Fetch specific NFT details from backend `/api/nfts/:id`.
        *   [ ] Frontend: Fetch bid history from backend.
        *   [ ] Frontend: Implement "Place Bid" functionality calling backend `/api/nfts/:id/bid`.
        *   [ ] Frontend: Implement "Buy Now" functionality calling backend.
        *   [ ] Frontend: Implement "Add to Favorites" functionality calling backend.
    *   **User Dashboard/Profile (`/profile`):**
        *   [ ] Frontend: Fetch user profile data from backend `/api/users/profile`.
        *   [ ] Frontend: Fetch "Owned NFTs" from backend `/api/users/:userId/nfts`.
        *   [ ] Frontend: Fetch "Favorited NFTs" from backend.
        *   [ ] Frontend: Fetch "Transaction History" from backend.
        *   [ ] Frontend: Fetch "Recent Activity" from backend.
        *   [ ] Frontend: Implement "Edit Profile" functionality calling backend `/api/users/profile`.
    *   **Search Page (`/search`):**
        *   [ ] Frontend: Send search query and filter parameters to backend `/api/nfts` with query params.
        *   [ ] Backend: Implement robust search and filtering logic for NFTs.
    *   **Category Page (`/category/[slug]`):**
        *   [ ] Frontend: Fetch NFTs for a specific category from backend `/api/nfts?category=<category_slug>`.
    *   **Notifications Page (`/notifications`):**
        *   [ ] Frontend: Fetch notifications from backend.
        *   [ ] Backend: Implement notification generation logic (e.g., new listings, sales, bids).
    *   **Settings Page (`/settings`):**
        *   [ ] Frontend: Implement "Change Email/Password" functionality calling backend.
        *   [ ] Frontend: Implement "Notification Preferences" updates calling backend.
    *   **Admin Panel Screens (all `/admin/...` routes):**
        *   [ ] Frontend (Admin): Connect User Management UI to `/api/admin/users` (GET, PUT, DELETE).
        *   [ ] Frontend (Admin): Connect NFT Management UI to `/api/admin/nfts` (GET, PUT for status, etc.) and `/api/nfts` (POST for manual add, PUT for edit).
        *   [ ] Frontend (Admin): Connect Categories Management UI to `/api/categories` (GET, POST, PUT, DELETE - admin protected).
        *   [ ] Frontend (Admin): Connect Promotions Management UI to relevant backend endpoints.
        *   [ ] Frontend (Admin): Fetch data for Analytics, Audit Log, Moderation Queue, Tasks from backend.
        *   [ ] Frontend (Admin): Implement Site Settings updates calling backend.
*   [ ] **True Wallet Integration (Exploratory for this stack):** Investigate how to best handle wallet interactions if required beyond basic auth, possibly interacting with backend for verification.
</details>

*   **Phase 3: AI Advancement & Community Building**
    *   [ ] **Advanced GenAI for NFT Creation:** Explore and integrate further AI capabilities (e.g., AI-assisted image generation/modification, art style analysis) using Genkit.
    *   [ ] **Personalized AI-Powered Recommendations:** Develop GenAI-driven feeds for personalized NFT and artist recommendations (data from backend, AI logic via Genkit).
    *   [ ] **Interactive Community Features:** Implement commenting, user-to-user messaging (backend driven).
    *   [ ] **AI-Driven Content Moderation (Exploratory):** Investigate using AI tools for content moderation.

*   **Phase 4: Scalability, Polish & Production Readiness**
    *   [ ] **Comprehensive Testing Suite:** Unit, integration, and E2E tests for both frontend and backend.
    *   [ ] **Performance Optimization:** In-depth analysis and optimization for both applications.
    *   [ ] **Accessibility (WCAG) Compliance:** Ensure WCAG 2.1 AA standards.
    *   [ ] **Security Hardening & Audit:** CSP, HSTS, input validation, rate limiting for backend.
    *   [ ] **Full API Documentation:** Document backend RESTful APIs.
    *   [ ] **Internationalization (i18n) & Localization (l10n).**
    *   [ ] **Robust DevOps & CI/CD Pipeline for both frontend and backend.**
    *   [ ] **Analytics Integration.**

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information (if one exists, otherwise assume MIT).

## 📞 Contact

Project Lead / Maintainer: [CloudFi] - [artnft.io]

Project Link: [https://github.com/jagdish-pulpet/artnft](https://github.com/jagdish-pulpet/artnft)

---

Thank you for checking out ArtNFT Marketplace! We're excited to see how it evolves.
