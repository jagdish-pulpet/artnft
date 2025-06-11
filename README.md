
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
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Backend-Supabase-green?style=flat-square&logo=supabase&logoColor=white" alt="Backend: Supabase"/></a>
  <br/>
  <a href="https://postgresql.org"><img src="https://img.shields.io/badge/Database-PostgreSQL-blue?style=flat-square&logo=postgresql&logoColor=white" alt="Database: PostgreSQL (via Supabase)"/></a>
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

ArtNFT Marketplace is a cutting-edge, full-stack web application designed for artists, collectors, and enthusiasts in the burgeoning world of Non-Fungible Tokens (NFTs). It offers a seamless and engaging experience for discovering unique digital artworks, creating and listing NFTs, and interacting with a vibrant community. The frontend is built with Next.js and leverages Supabase for its backend and database. AI capabilities are integrated using Genkit.

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
        *   [Backend Setup (Supabase)](#backend-setup-supabase)
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
<summary><strong>Comprehensive User Authentication (with Supabase):</strong></summary>

*   Secure sign-up and login (Email/Password) for web users, handled by Supabase Auth.
*   Admin login (Email/Password) potentially via Supabase Auth with role management.
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
    *   **"New From Artists You Follow":** Shows new creations from followed artists. *Data to be fetched from Supabase.* If no artists are followed, a call-to-action prompts users to discover and follow creators.
*   **Discovery & Engagement Features:**
    *   **"Artist Spotlights":** Highlights featured artists with profile images, names, bios, and follow/unfollow functionality (interactions to call Supabase functions or update tables). Includes user avatar in header.
    *   **"Explore Categories":** A visually rich grid of clickable category cards (e.g., Digital Art, Photography, Music), each leading to a dedicated category page.
    *   **"Popular Collections":** Showcases trending or curated NFT collections (data from Supabase).
*   **Community & Platform Updates:**
    *   **"Community Highlights":** Features platform news, specific artist achievements, or upcoming events in an engaging card format.
</details>

<details>
<summary><strong>Advanced NFT Creation & Listing (`/create-nft`):</strong></summary> User-friendly interface for artists to mint their own NFTs, including:
*   Image upload with preview (supports PNG, JPG, GIF; 10MB limit) to Supabase Storage.
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
*   Minting summary and submission to Supabase for processing (inserting into `nfts` table).
</details>

<details>
<summary><strong>Detailed NFT Page (`/nft/[id]`):</strong></summary> Comprehensive view of individual NFTs, including:
*   Large image display with hover zoom effect.
*   Detailed description, attributes, and artist information (profile picture, name, link to profile). *Data fetched from Supabase.*
*   Auction system: Displays starting bid, current highest bid, and a real-time countdown timer for auction end (Supabase backend or Realtime).
*   "Buy Now" functionality and pricing. *Interaction updates Supabase.*
*   Interactive "Place Bid" form. *Interaction updates Supabase.*
*   Bid history display.
*   "Add to Favorites" button (interaction with Supabase, toast feedback).
*   Social sharing options (Twitter, Instagram, Copy Link).
*   "Related NFTs" section for further discovery (data from Supabase).
</details>

<details>
<summary><strong>User-Centric Dashboard (`/profile` -> "Dashboard"):</strong></summary> A personalized hub for users, featuring:
*   **Profile Summary:** Displays user avatar, username, bio, and provides "Edit Profile" & "Settings" buttons.
*   **Key Stats:** Overview of NFTs Owned, Favorites, Items for Sale, and Total Earnings (data from Supabase).
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
    *   *Search results fetched from Supabase (using PostgreSQL full-text search or Supabase Edge Functions).*
</details>

<details>
<summary><strong>Category-Specific Pages (`/category/[slug]`):</strong></summary>
*   Dynamically generated pages for each NFT category (e.g., Digital Art, Photography).
*   Lists NFTs belonging to the selected category (data from Supabase).
*   Includes category title, description, and a link back to all categories.
*   Graceful handling for non-existent categories.
</details>

<details>
<summary><strong>Notifications System (`/notifications`):</strong></summary> Real-time alerts (driven by Supabase Realtime or database triggers) for:
*   New listings from followed artists.
*   Price drops on favorited items.
*   Auction updates and outcomes.
*   Successful transactions.
*   Features include read/unread status, icons per notification type, and filter options.
</details>

<details>
<summary><strong>Comprehensive Settings Page (`/settings`):</strong></summary>
*   Sections for Account Management (Change Email/Password - interacts with Supabase Auth, Connect Wallet - simulated).
*   Notification Preferences (toggles for various alert types, storing preferences in Supabase).
*   Appearance (Dark Mode toggle that persists in `localStorage`).
*   Privacy settings and links to Privacy Policy.
*   Help & Support links (FAQs, Contact, Terms of Service).
*   Logout functionality (calls `supabase.auth.signOut()`).
</details>

<details>
<summary><strong>Crypto Market Stats Page (`/stats`):</strong></summary>
*   Displays cryptocurrency market data fetched from the CoinMarketCap API via a Next.js API route (`/api/crypto-stats`).
*   Features search, sort, "Load More" functionality, and highlights top gainers/losers.
*   Handles loading, error (including API key missing), and empty states.
</details>

<details>
<summary><strong>Robust Admin Panel (Interacts with Supabase, accessible via `/admin`):</strong></summary>
*   **Secure Login (`/admin/login`):** Dedicated login for administrators (credentials verified by Supabase Auth, possibly using custom claims or a separate admin users table).
*   **Main Dashboard (`/admin/dashboard`):** Overview of key platform statistics (total users, NFTs, sales volume), recent platform activity, and links to other admin sections.
*   **User Management (`/admin/users`):** View list of registered users, search/filter, view user details, and perform actions like suspend/activate user (interacting with Supabase Auth and user profiles table).
*   **NFT Management (`/admin/nfts`):** View all NFTs, search/filter, view NFT details, and perform actions like feature/hide NFT (interacting with Supabase `nfts` table). Includes ability to manually add or edit NFT listings.
*   **Categories Management (`/admin/categories`):** Create, view, edit, and delete NFT categories (interacting with Supabase `categories` table).
*   **Promotions Management (`/admin/promotions`):** Manage featured NFTs and spotlighted artists.
*   **Platform Analytics (`/admin/analytics`):** View charts and graphs for sales trends, user sign-ups, and NFT distribution (data from Supabase).
*   **Audit Log (`/admin/audit-log`):** Track significant administrative actions and system events (data from Supabase, possibly using database triggers or Supabase Edge Functions).
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
*   **Login Page (`/login`):** For existing users to access their accounts via Email/Password, communicating with Supabase Auth.
*   **Signup Page (`/signup`):** For new users to create accounts via Email/Password/Confirm Password, communicating with Supabase Auth.
*   **Forgot Password Page (`/forgot-password`):** For users to reset their passwords (Supabase Auth handles this).
*   **Connect Wallet Page (`/connect-wallet`):** (Simulated) UI for connecting crypto wallets.
*   **Home Dashboard (`/home`):** Main dashboard after login, featuring hero section, activity feeds, artist spotlights, categories, and community highlights.
*   **Create NFT Page (`/create-nft`):** Interface for artists to mint NFTs, with AI assistance and live preview, submitting data to Supabase.
*   **NFT Detail Page (`/nft/[id]`):** Comprehensive view of individual NFTs, including details, auction system, and purchase options, all data-driven by Supabase.
*   **User Dashboard/Profile (`/profile`):** Personalized hub for users to view their owned NFTs, favorites, transaction history, and recent activity. Also displays admin announcements. Data from Supabase.
*   **Search Page (`/search`):** Dedicated page for searching NFTs with advanced filtering and sorting, driven by URL query parameters and Supabase queries.
*   **Category Page (`/category/[slug]`):** Dynamically generated pages listing NFTs for specific categories, data from Supabase.
*   **Notifications Page (`/notifications`):** Real-time alerts for platform activities, driven by Supabase.
*   **Settings Page (`/settings`):** Page for users to manage account settings, notification preferences, appearance (dark mode), and privacy. Interacts with Supabase for account changes.
*   **Crypto Market Stats Page (`/stats`):** Displays cryptocurrency market data fetched from CoinMarketCap API via a Next.js API Route.
*   **Terms of Service Page (`/terms`):** Static page for terms and conditions.
*   **Privacy Policy Page (`/privacy`):** Static page for the privacy policy.
</details>

<details>
<summary><strong>Admin Panel Screens</strong></summary>

*   **Admin Login Page (`/admin/login`):** Secure login for administrators, authenticating against Supabase Auth.
*   **Admin Dashboard (`/admin/dashboard`):** Overview of key platform statistics and recent activity, data from Supabase.
*   **User Management (`/admin/users`):** View, search, filter, and manage registered users.
*   **NFT Management (`/admin/nfts`):** View, search, filter, and manage all NFTs.
    *   **Add NFT (`/admin/nfts/add`):** Manually add new NFT listings.
    *   **Edit NFT (`/admin/nfts/[id]/edit`):** Modify details of existing NFT listings.
*   **Categories Management (`/admin/categories`):** Create, view, edit, and delete NFT categories.
*   **Promotions Management (`/admin/promotions`):** Manage featured NFTs and spotlighted artists.
*   **Platform Analytics (`/admin/analytics`):** View charts for sales trends, user sign-ups, etc (data from Supabase).
*   **Audit Log (`/admin/audit-log`):** Track significant administrative actions and system events (data from Supabase).
*   **Content Moderation (`/admin/moderation`):** Queue for reviewing reported content and taking moderation actions.
*   **Tasks & Alerts (`/admin/tasks`):** Dashboard for admins to view pending tasks and system alerts.
*   **Site Settings (`/admin/settings`):** Manage global platform configurations (site name, theme colors, API keys - simulated for some, Supabase driven for others).
*   **Feature Toggles (`/admin/feature-toggles`):** (Development Tool) Control visibility of certain helper UI elements on welcome/login pages.
</details>

## 🖼️ Screenshots

*(Placeholder for screenshots of key application screens: Home Dashboard, NFT Details, Create NFT, Dashboard Page, Search Page, Admin Panel views, etc.)*

## 🛠️ Tech Stack

The ArtNFT Marketplace is a full-stack application composed of a Next.js frontend and Supabase as its backend.

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
    *   Supabase client library (`@supabase/supabase-js`) for all backend interactions (database, auth, storage).

**Backend (Server-Side Logic & Database - via Supabase):**
*   **Platform:** [Supabase](https://supabase.com/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/) (managed by Supabase)
*   **Authentication:** Supabase Auth (JWT-based)
*   **Storage:** Supabase Storage (for NFT images, etc.)
*   **Serverless Functions:** Supabase Edge Functions (for custom server-side logic if needed beyond direct DB access)
*   **Realtime:** Supabase Realtime (for features like live auction updates, notifications)
*   **API Layer:** Auto-generated RESTful and GraphQL APIs by Supabase, direct database access via client library.

## 🏗️ Project Architecture

ArtNFT Marketplace leverages a modern architecture with a Next.js frontend and Supabase backend:

*   **Next.js Frontend:**
    *   **App Router:** Enables a robust file-system based routing, supporting layouts, nested routes, and optimized rendering strategies (Server Components, Client Components).
    *   **Component-Based UI:** React is used to build a modular and reusable component library, with core UI elements provided by ShadCN UI.
    *   **State Management:** Primarily React Hooks for local/component state and route-based state.
    *   **Styling:** Tailwind CSS for utility classes, global theme in `src/app/globals.css` (HSL variables).
    *   **Genkit for AI (Specific Features):** AI functionalities like NFT content generation are encapsulated in Genkit "flows." These flows are server-side modules (`'use server';`) within the Next.js application.
    *   **Supabase Client:** The frontend uses the Supabase client library (`@supabase/supabase-js`) for all interactions with the backend (authentication, database CRUD, file storage).

*   **Supabase Backend:**
    *   **PostgreSQL Database:** Stores all application data (users, NFTs, categories, etc.).
    *   **Supabase Auth:** Handles user sign-up, login, session management, and password recovery.
    *   **Supabase Storage:** Stores NFT images and other media assets.
    *   **Row Level Security (RLS):** Enforces data access policies directly in the database.
    *   **Supabase Edge Functions (Optional):** For custom, complex backend logic that can't be achieved through direct client-to-database operations or RLS.
    *   **Auto-Generated APIs:** Supabase provides RESTful and GraphQL APIs for interacting with the database, though direct client library usage is often preferred in Next.js.

*   **Communication:**
    *   The Next.js frontend communicates directly with Supabase services using the Supabase client library.
    *   The Next.js API Route for `/api/crypto-stats` directly fetches from an external API.

## 🚀 Getting Started

Follow these instructions to get the Next.js frontend running with Supabase.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)
*   A [Supabase](https://supabase.com/) account and project.

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
    *   Create a `.env.local` file in the root of the project by copying `.env.local.example` or creating it new.
    *   **Supabase Credentials:**
        ```env
        NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL_HERE
        NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
        ```
        (Find these in your Supabase project settings: Project Settings -> API)
    *   **Direct Database Connection (for Next.js API Routes connecting to Supabase DB):**
        ```env
        DB_DIALECT=postgres
        DB_HOST=db.YOUR_SUPABASE_PROJECT_REF.supabase.co
        DB_USER=postgres 
        DB_PASSWORD=YOUR_SUPABASE_DATABASE_PASSWORD 
        DB_NAME=postgres
        DB_PORT=5432
        ```
        (Find `DB_HOST` and `DB_PASSWORD` in your Supabase project settings: Project Settings -> Database -> Connection string / Connection info)
    *   **Genkit API Key:**
        ```env
        GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY_HERE
        ```
    *   **CoinMarketCap API Key (for the Stats page):**
        ```env
        COINMARKETCAP_API_KEY=YOUR_COINMARKETCAP_API_KEY_HERE
        ```

#### Backend Setup (Supabase)

1.  **Create a Supabase Project:**
    *   Go to [app.supabase.com](https://app.supabase.com) and sign up or log in.
    *   Create a new project. Choose a region close to your users.
    *   Note your Project URL, `anon` key, and database connection details.

2.  **Database Schema Setup (via Supabase Studio or SQL):**
    *   Navigate to the "Table Editor" in your Supabase project dashboard.
    *   Define your tables (e.g., `profiles`, `nfts`, `categories`, `collections`, `favorites`, `bids`, `transactions`).
    *   Define relationships between tables (foreign keys).
    *   Enable Row Level Security (RLS) on your tables and define initial policies. Example:
        ```sql
        -- Example for a 'profiles' table linked to auth.users
        CREATE TABLE public.profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          username TEXT UNIQUE,
          avatar_url TEXT,
          bio TEXT,
          updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
        );
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
        CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
        CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

        -- Example for 'nfts' table
        CREATE TABLE public.nfts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            price NUMERIC,
            category TEXT,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
            -- Add other relevant columns
        );
        ALTER TABLE public.nfts ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "NFTs are viewable by everyone." ON nfts FOR SELECT USING (true);
        CREATE POLICY "Users can create their own NFTs." ON nfts FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can update their own NFTs." ON nfts FOR UPDATE USING (auth.uid() = user_id);
        CREATE POLICY "Users can delete their own NFTs." ON nfts FOR DELETE USING (auth.uid() = user_id);
        ```
    *   Refer to the Supabase documentation for detailed schema design and RLS best practices.

### Running Development Servers

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

Your Supabase backend is live and managed by Supabase, so no separate backend server needs to be run locally (unless you are developing Supabase Edge Functions locally with the Supabase CLI).

You should now have:
*   Frontend running on `http://localhost:9002`
*   Genkit Dev UI on `http://localhost:4000`
*   Your Supabase project accessible via its URL.

## 📁 Project Structure

The project is organized with a Next.js frontend and Supabase as the backend.

```
.
├── artnft-backend-node/      # (ARCHIVED/BEING REPLACED by Supabase)
│   ├── ...
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
│   │   ├── api/              # Next.js API routes (e.g., /api/crypto-stats, /api/db-test)
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
│   ├── lib/                  # Frontend: Utility functions
│   │   ├── supabase/         # Supabase client setup
│   │   │   └── client.ts     
│   │   └── db.ts             # Direct DB connection utility (for API routes)
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
    *   (Planned) `suggestNftTitlesFlow`: Suggests catchy and relevant titles for NFTs.
    *   (Planned) `suggestNftTagsFlow`: Recommends relevant tags/keywords for NFT discoverability.
*   **Models:** Configured to use Google AI models (e.g., Gemini) via the `@genkit-ai/googleai` plugin. API keys are managed through `.env.local`.
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

## ☁️ Deployment

*   **Next.js Frontend & Genkit:** This project is configured for deployment on [Firebase App Hosting](https://firebase.google.com/docs/app-hosting) using `apphosting.yaml`. Alternatives include Vercel, Netlify, AWS Amplify.
*   **Supabase Backend:** Supabase is a hosted service. You deploy your schema and functions directly to Supabase.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

Please ensure your code adheres to the project's linting and formatting standards. Include tests for new features where applicable.

## 🗺️ Roadmap

*   **Phase 1: Core Frontend & Initial Backend Setup (Supabase Migration Started)**
    *   [x] Next.js Frontend: User Authentication pages (Login, Signup), Admin Login page - UI ready.
    *   [x] Initial Supabase Setup: Client library installed, environment variables configured.
    *   [ ] Supabase Auth: Implement signup, login, logout, session management.
    *   [ ] Supabase Database: Define initial schema (users/profiles, nfts, categories). Implement basic RLS.
    *   [x] Basic NFT Creation & Listing UI (Simulated with AI assistance for content; *frontend prepares data for Supabase*)
    *   [x] NFT Discovery UI (Featured/Latest, Categories, Global Search with Filters & Sort; *frontend preparing for Supabase data*)
    *   [x] NFT Detail Page UI (Simulated Auction, Buy Now, Related NFTs; *frontend interactions to use Supabase data*)
    *   [x] User Dashboard UI (Owned, Favorites, Transaction History, Recent Activity, Admin Announcements - Enhanced UI/UX)
    *   [x] Basic Responsive Design (Mobile-first, auto-hiding navigation, global header)
    *   [x] Light/Dark Theming (User-configurable)
    *   [x] Notifications Page UI (Simulated alerts)
    *   [x] Settings Page UI (Account, Preferences, Appearance)
    *   [x] Crypto Market Stats Page (External API integration via Next.js API Route)
    *   [x] Comprehensive Admin Panel UI (Simulated actions initially, to be wired to Supabase): Dashboard, User Management, NFT Management (CRUD), Categories, Promotions, Analytics, Audit Log, Moderation, Tasks & Alerts, Site Settings, Feature Toggles.

<details>
<summary><strong>Phase 2: Full Supabase Integration & Feature Implementation (In Progress)</strong></summary>

*   [ ] **Supabase Backend Development:**
    *   [ ] Implement full CRUD operations for NFTs, Categories, User Profiles, etc. (interacting with Supabase tables).
    *   [ ] Develop auction system logic (using Supabase tables, possibly Realtime and Edge Functions).
    *   [ ] Implement persistent user interactions (Follow Artist, Favorite NFT - storing data in Supabase).
    *   [ ] Build out Admin Panel functionality using Supabase.
    *   [ ] Refine RLS policies for all tables.
*   [ ] **Next.js Frontend Integration:**
    *   [ ] Connect all frontend pages and components to Supabase (Auth, Database, Storage).
    *   [ ] Replace all mock data with data fetched from Supabase.
    *   [ ] Implement real-time updates for features like auctions and notifications (using Supabase Realtime).
*   [ ] **Screen-by-Screen Supabase Integration Tasks:**
    *   **Authentication Screens (Login, Signup, Forgot Password):**
        *   [ ] Frontend: Use Supabase client for all auth operations.
        *   [ ] Frontend: Handle Supabase session management.
    *   **Home Dashboard (`/home`):**
        *   [ ] Frontend: Fetch "Latest Activity" NFTs, "New From Artists You Follow", "Artist Spotlights", "Popular Collections" from Supabase.
        *   [ ] Frontend: Implement "Follow/Unfollow" artist functionality updating Supabase.
    *   **Create NFT Page (`/create-nft`):**
        *   [ ] Frontend: Upload image to Supabase Storage. Submit new NFT data to Supabase `nfts` table.
    *   **NFT Detail Page (`/nft/[id]`):**
        *   [ ] Frontend: Fetch specific NFT details from Supabase.
        *   [ ] Frontend: Fetch bid history from Supabase.
        *   [ ] Frontend: Implement "Place Bid", "Buy Now", "Add to Favorites" using Supabase.
    *   **User Dashboard/Profile (`/profile`):**
        *   [ ] Frontend: Fetch user profile data, "Owned NFTs", "Favorited NFTs", "Transaction History", "Recent Activity" from Supabase.
        *   [ ] Frontend: Implement "Edit Profile" updating Supabase.
    *   **Search Page (`/search`):**
        *   [ ] Frontend: Send search query and filter parameters to Supabase (PostgreSQL full-text search or Supabase Functions).
    *   **Category Page (`/category/[slug]`):**
        *   [ ] Frontend: Fetch NFTs for a specific category from Supabase.
    *   **Notifications Page (`/notifications`):**
        *   [ ] Frontend: Fetch notifications from Supabase.
        *   [ ] Supabase: Implement notification generation logic (e.g., database triggers or Edge Functions).
    *   **Settings Page (`/settings`):**
        *   [ ] Frontend: Implement "Change Email/Password" (Supabase Auth).
        *   [ ] Frontend: Implement "Notification Preferences" updates storing in Supabase.
    *   **Admin Panel Screens (all `/admin/...` routes):**
        *   [ ] Frontend (Admin): Connect User Management UI to Supabase Auth and profiles table.
        *   [ ] Frontend (Admin): Connect NFT Management UI to Supabase `nfts` table.
        *   [ ] Frontend (Admin): Connect Categories Management UI to Supabase `categories` table.
        *   [ ] Frontend (Admin): Connect Promotions Management UI to Supabase.
        *   [ ] Frontend (Admin): Fetch data for Analytics, Audit Log, Moderation Queue, Tasks from Supabase.
        *   [ ] Frontend (Admin): Implement Site Settings updates (if applicable to Supabase).
*   [ ] **True Wallet Integration (Exploratory):** Investigate robust wallet interactions, possibly using Supabase for signature verification.
</details>

*   **Phase 3: AI Advancement & Community Building**
    *   [ ] **Advanced GenAI for NFT Creation:** Explore and integrate further AI capabilities (e.g., AI-assisted image generation/modification, art style analysis) using Genkit.
    *   [ ] **Personalized AI-Powered Recommendations:** Develop GenAI-driven feeds for personalized NFT and artist recommendations (data from Supabase, AI logic via Genkit).
    *   [ ] **Interactive Community Features:** Implement commenting, user-to-user messaging (Supabase driven).
    *   [ ] **AI-Driven Content Moderation (Exploratory):** Investigate using AI tools for content moderation.

*   **Phase 4: Scalability, Polish & Production Readiness**
    *   [ ] **Comprehensive Testing Suite:** Unit, integration, and E2E tests for frontend and Supabase interactions.
    *   [ ] **Performance Optimization:** Database query optimization, frontend rendering improvements.
    *   [ ] **Accessibility (WCAG) Compliance:** Ensure WCAG 2.1 AA standards.
    *   [ ] **Security Hardening & Audit:** Review RLS policies, Supabase function security.
    *   [ ] **Full API Documentation (if custom Supabase Functions are used extensively).**
    *   [ ] **Internationalization (i18n) & Localization (l10n).**
    *   [ ] **Robust DevOps & CI/CD Pipeline for frontend and Supabase schema migrations/functions.**
    *   [ ] **Analytics Integration.**

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information (if one exists, otherwise assume MIT).

## 📞 Contact

Project Lead / Maintainer: [CloudFi] - [artnft.io]

Project Link: [https://github.com/jagdish-pulpet/artnft](https://github.com/jagdish-pulpet/artnft)

---

Thank you for checking out ArtNFT Marketplace! We're excited to see how it evolves.
