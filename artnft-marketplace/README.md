
# ArtNFT Marketplace: Digital Art Trading Platform

**ArtNFT Marketplace** is a cutting-edge platform designed for the discovery, collection, and trading of unique digital art as Non-Fungible Tokens (NFTs). This project aims to deliver a seamless, engaging, and modern user experience for artists, collectors, and enthusiasts in the rapidly evolving NFT ecosystem. Built with a mobile-first, responsive design philosophy, the application ensures optimal usability across a wide array of devices, including desktops, tablets, and smartphones.

The project includes:
1. A frontend built with Next.js (in `src/`).
2. A separate backend built with Node.js, Express, PostgreSQL, and TypeORM (in `artnft-backend/`).
3. A React Native mobile application (in `react-native-app/`). For setup instructions for the mobile app, please see `react-native-app/README.md`.


---

## 📜 Table of Contents

- [✨ Key Features](#-key-features)
- [📱 Mobile Application](#-mobile-application)
- [📄 Application Screens Overview](#-application-screens-overview)
- [🖼️ Screenshots](#️-screenshots)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Project Architecture](#-project-architecture)
- [📁 Project Structure](#-project-structure)
- [🏢 Project Structure and Organization Principles](#-project-structure-and-organization-principles)
- [🗂️ APIs So Far (Conceptual & Initial Backend Implementation)](#️-apis-so-far-conceptual--initial-backend-implementation)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Frontend Setup (Next.js)](#frontend-setup-nextjs)
  - [Backend Setup (Node.js/Express/PostgreSQL)](#backend-setup-nodejsesspostgresql)
    - [PostgreSQL Setup](#postgresql-setup)
    - [Firebase Setup](#firebase-setup)
    - [Environment Variables (`artnft-backend/.env`)](#environment-variables-artnft-backendenv)
    - [Database Migrations](#database-migrations)
  - [React Native App Setup](#react-native-app-setup)
  - [Running Development Servers](#running-development-servers)
- [🎨 Styling & Theming](#-styling--theming)
- [🤖 AI Integration (Genkit)](#-ai-integration-genkit)
- [🧪 Comprehensive Testing](#-comprehensive-testing)
- [🛡️ Security Hardening](#️-security-hardening)
- [🌍 Building for Production](#-building-for-production)
- [☁️ Deployment](#️-deployment)
- [🤝 Contributing](#-contributing)
- [🗺️ Roadmap](#️-roadmap)
- [📄 License](#-license)
- [📞 Contact](#-contact)

---

## ✨ Key Features

### Currently Implemented (Web UI & Backend Foundation):
- **User Onboarding & Authentication (Web UI & Backend):**
  - Welcome Screen with wallet/email signup options.
  - **Wallet Connection Modal & Sign-In (Web UI & Backend):**
    *   **MetaMask Integration (Frontend & Backend):** Functional flow to connect with MetaMask, prompt users to sign a message, and authenticate against the backend. Backend (`AuthService`) actively attempts cryptographic signature verification using `ethers.js`.
    *   **WalletConnect Integration (Frontend):** Functional integration using `@walletconnect/web3-provider` and `ethers@5`. Requires `NEXT_PUBLIC_INFURA_ID` (or similar RPC provider URL) in `.env.local` for connections to public networks.
    *   **Placeholders for Other Wallets (Frontend):** UI for Coinbase Wallet with placeholder action.
  - Email Sign Up & Sign In Forms (Web UI connected to backend via `AuthContext` and `apiService`).
  - Email Verification Screen (Web UI with OTP input, backend connection pending).
  - **Forgot Password Screen & Email Sending (Backend):**
    *   Web UI for requesting password reset.
    *   Backend `AuthService` actively attempts real email sending using `nodemailer` (requires SMTP environment configuration).
  - **Backend Auth Core:** Full setup for user signup (with password hashing), signin (with JWT generation), wallet sign-in (actively attempts signature verification, auto-registration), forgot password (actively attempts email sending), and reset password flows. Protected `/api/auth/me` route.
- **User Profile Management (Web UI & Backend):** Fully functional.
- **Core Marketplace Pages (Web UI & Backend API Integration):** Home, NFT Detail, Collections List/Detail, Create Collection/NFT, Stats page with dynamic data (overview, trading volume, top collections, top NFTs, leaderboards).
- **NFT, Collection, Offer, Report Management (Backend):** Full CRUD or relevant status updates, including offer acceptance with NFT ownership transfer and sale transaction logging.
- **Activity Feed (Backend & Frontend Display):** Comprehensive activity logging for most key user and admin actions, displayed on profile and NFT detail pages.
- **File Uploads (Backend - Firebase Storage):** Fully integrated for profile, NFT, and collection images.
- **Admin Dashboard & Pages (Web UI & Backend APIs):** Full suite of admin management pages (Users, NFTs, Collections, Reports, Settings, Storage Management with file listing/deletion from Firebase, prefix search, and informational notes on advanced statistics limitations).

### React Native App (In Progress):
- **Authentication:** Email/password signup & signin functional with backend. WalletConnect sign-in using `@walletconnect/react-native-dapp` implemented (requires deep linking setup by user).
- **Core Screens & Navigation:** Foundational navigation, placeholder screens for Home, NFT/Collection Browsing & Detail, Profile with tabs.
- **Data Fetching:** Implemented for Home, NFT/Collection details, Profile (main data & tabs like Created/Owned NFTs, Collections).
- **Forms & Image Uploads:** "Create NFT", "Create Collection", and "Edit Profile" forms implemented with image selection (`expo-image-picker`) and API calls for image upload and data submission.
- **Offer Management (Profile):** UI and API logic for accepting, rejecting, and canceling offers implemented in the Profile screen.
- **UI/UX:** Includes basic loading states, error messages, toast notifications (`react-native-toast-message`), and navigation after creation.

### Planned Features (High-Level Roadmap):
- **Frontend - Full Coinbase Wallet & Other Provider Support (Web & Mobile).**
- **Smart Contract Interactions:** Minting, buying, selling, offering NFTs on-chain.
- **Real-time Features:** Notifications, live activity feeds (Web & Mobile).
- **AI-Powered Enhancements (Genkit - Web).**
- **React Native - Advanced UI/UX Enhancements** (e.g., true image upload progress).

---

## 📱 Mobile Application

A React Native mobile application is being developed in the `react-native-app/` directory. It includes foundational setup for navigation, authentication context (email/password and WalletConnect), API service, image upload service, and core UI components. Screens for Home, NFT/Collection browsing & detail, Profile (with tabs for Created/Owned NFTs, Collections, Offers, Activity), and forms for Create NFT/Collection & Edit Profile are implemented with data fetching and submission logic. For detailed setup and development instructions for the mobile app, please refer to the `react-native-app/README.md` file within that directory.

---

## 📄 Application Screens Overview
(Largely unchanged from previous, reflects current state. WalletConnectModal now has distinct options and is functional with proper setup)
1.  **Onboarding/Authentication:** Welcome, Wallet Connect (MetaMask & WalletConnect functional on Web with setup; RN WalletConnect functional with setup), Email Sign Up/In, Verification, Forgot Password.
... (rest of the screens remain the same for Web; Mobile equivalents are being built)

---

## 🛠️ Tech Stack

-   **Frontend Framework (Web):** Next.js (v15.x) with React (v18.x).
-   **Mobile Framework:** React Native (with Expo).
-   **Language (Frontend & Mobile):** TypeScript.
-   **Styling (Web):** Tailwind CSS (v3.x), ShadCN UI.
-   **Styling (Mobile):** StyleSheet API, custom theme.
-   **State Management (Web):** React Context API (`AuthContext`), React Hooks.
-   **State Management (Mobile):** React Context API (`authContext.tsx`), React Hooks.
-   **Form Handling (Web):** React Hook Form with Zod.
-   **Charting (Web):** Recharts.
-   **Wallet Integration (Web):** Direct `window.ethereum` for MetaMask, `@walletconnect/web3-provider` (with `ethers@5`) for WalletConnect.
-   **Wallet Integration (Mobile):** `@walletconnect/react-native-dapp` for WalletConnect, `ethers@5` (for utilities like hex encoding).
-   **Image Picking (Mobile):** `expo-image-picker`.
-   **Dropdowns/Pickers (Mobile):** `@react-native-picker/picker`.
-   **Toast Notifications (Mobile):** `react-native-toast-message`.
-   **AI Integration:** Genkit.
-   **Icons (Web):** Lucide React.
-   **Icons (Mobile):** Lucide React Native.
-   **Backend (Node.js/Express/PostgreSQL - in `artnft-backend/` directory):**
    -   Runtime: Node.js with Express.js.
    -   Language (Backend): TypeScript.
    -   Database: **PostgreSQL (version 12+ recommended)**.
    *   ORM: **TypeORM**.
    *   Authentication: JWT, bcryptjs, UUID, **`ethers` (v6, for backend signature verification - actively implemented)**.
    *   API: RESTful.
    *   Validation: `class-validator`, `class-transformer`.
    *   File Uploads: `multer`, **Firebase Admin SDK** for Firebase Storage.
    *   Activity Logging: Custom `ActivityEntity` and `ActivityService`.
    *   Transaction Logging: Custom `TransactionEntity` and `StatsService`.
    *   Emailing: **`nodemailer` (for backend email sending - actively implemented, requires SMTP config)**.
    *   Environment Management: `dotenv`.
    *   Utility: `uuid`.

---

## 🏗️ Project Architecture

-   **Frontend (Next.js):** App Router, Component-Based Design, `AuthContext`, `apiService`, AI logic in `src/ai/`.
-   **Backend (Node.js/Express - in `artnft-backend/` directory):**
    -   Main server setup in `index.ts` (includes Firebase Admin init).
    -   TypeORM DataSource in `data-source.ts`.
    -   Firebase Admin SDK setup in `firebase-admin.ts`.
    -   Entities, DTOs, Services (UserService, NftService, CollectionService, OfferService, ReportService, ActivityService, UploadService, StatsService), Controllers, Routes, Middleware, Migrations.
-   **Mobile (React Native - in `react-native-app/` directory):**
    *   Expo managed workflow.
    *   Main entry point `App.tsx` with `WalletConnectProvider`, `AuthProvider`, and `Toast` setup.
    *   Component-based architecture (`src/components`, `src/screens`).
    *   Navigation using React Navigation (`src/navigation`).
    *   API service (`src/api/apiService.ts`) for backend communication.
    *   State management (`src/store/authContext.tsx`).
    *   Image Uploads using `expo-image-picker` and a custom `imageUploadService.ts`.
-   **Styling Architecture:** Global styles, Tailwind CSS config (web); StyleSheet API, theme file (mobile).

---

## 📁 Project Structure

The project is organized into three main parts:

1.  **`artnft-backend/`**: Contains the Node.js, Express, and PostgreSQL backend.
    *   `src/controllers/`: Handles incoming API requests and responses.
    *   `src/dtos/`: Data Transfer Objects for request validation and response shaping.
    *   `src/entities/`: TypeORM entities defining database table structures.
    *   `src/services/`: Business logic and interaction with the database.
    *   `src/middleware/`: Custom middleware (e.g., authentication, validation).
    *   `src/routes/`: API route definitions.
    *   `src/migrations/`: Database migration files.
    *   `src/index.ts`: Backend application entry point.
    *   `src/data-source.ts`: TypeORM configuration.
    *   `src/firebase-admin.ts`: Firebase Admin SDK setup.

2.  **`react-native-app/`**: Contains the React Native (Expo) mobile application.
    *   `src/api/`: API client for mobile.
    *   `src/assets/`: Static assets (images, fonts).
    *   `src/components/`: Reusable UI components, categorized by domain (common, auth, nft, collection).
    *   `src/hooks/`: Custom React Hooks.
    *   `src/navigation/`: React Navigation setup (stacks, tabs, types).
    *   `src/screens/`: Top-level screen components.
    *   `src/services/`: Mobile-specific services (e.g., image upload).
    *   `src/store/`: State management (e.g., AuthContext).
    *   `src/styles/`: Theme and global style definitions.
    *   `src/types/`: TypeScript definitions for mobile app.
    *   `src/utils/`: Helper functions and storage utilities.
    *   `App.tsx`: Root component of the mobile app.
    *   `app.json`: Expo configuration.
    *   `package.json`: Mobile app dependencies and scripts.

3.  **`src/`**: Contains the Next.js and React web frontend application.
    *   `app/`: Next.js App Router structure, including layouts and pages.
        *   `(admin)/`: Admin panel section.
        *   Public-facing routes like `/home`, `/collections`, `/nft/[id]`, `/profile`, `/auth` routes (`/signin`, `/signup`).
    *   `components/`: Reusable UI components, including ShadCN UI (`ui/`) and custom components categorized by domain.
    *   `providers/`: Context providers (e.g., `auth-provider.tsx`).
    *   `lib/`: Core utilities like `apiService.ts` and `utils.ts`.
    *   `hooks/`: Custom React Hooks like `useToast.ts`.
    *   `types/`: Shared TypeScript definitions for the web app.
    *   `ai/`: Genkit AI integration files.
    *   `globals.css` & `tailwind.config.ts`: Styling configuration.

Root directory files (`package.json`, `tsconfig.json`, `next.config.ts`, etc.) generally pertain to the Next.js web application or overall project settings.

---

## 🏢 Project Structure and Organization Principles

Maintaining a well-organized project is key for scalability, maintainability, and developer collaboration. Here are the principles guiding this project's structure and suggestions for further improvement:

**Current Strengths:**

*   **Clear Platform Separation:** The top-level division into `artnft-backend/`, `react-native-app/`, and `src/` (for the Next.js web app) provides excellent separation of concerns between the different parts of the application.
*   **Standard Conventions:** Each sub-project largely follows standard organizational patterns for its respective technology stack (e.g., MVC-like structure for the backend, component-based for frontends).
*   **Centralized Types (Conceptually):** The use of `types/entities.ts` (or similar) aims to define shared data models, which is crucial for consistency.

**Suggested Improvements & Principles:**

1.  **Feature-Driven Organization (Within Each App):**
    *   **Web & Mobile:** For more complex features (e.g., "Offer Management", "NFT Creation Flow"), consider creating dedicated `features/` directories within `src/` (for web) and `react-native-app/src/`.
    *   Each feature folder (`src/features/offer-management/`) would contain all components, hooks, services/API calls, screens/pages, and types specific to that feature.
    *   **Benefit:** Enhances modularity (high cohesion, low coupling), making features easier to develop, test, and maintain independently.

2.  **Shared Code (Monorepo Potential):**
    *   **Types:** Strive for a single source of truth for shared TypeScript types (like `User`, `Nft`, `Collection`) used across the backend, web, and mobile apps.
    *   **Utilities:** Common utility functions (e.g., data formatting, validation helpers) could also be shared.
    *   **Advanced:** For larger projects, a formal monorepo setup (using tools like Turborepo or Nx) can manage these shared packages (`packages/shared-types`, `packages/shared-utils`) more effectively. The current structure acts like a manual monorepo.

3.  **Component Granularity & Reusability:**
    *   **Web (`src/components/`) & Mobile (`react-native-app/src/components/`):**
        *   Continue categorizing components (e.g., `common/`, `ui/` for ShadCN, `auth/`, `nft/`).
        *   Break down complex components into smaller, reusable sub-components.
        *   Aim for presentational components to be separate from container components that handle logic and data fetching.

4.  **API Layer Abstraction:**
    *   **Web & Mobile:** The `apiService.ts` in both frontends is good. Ensure it consistently handles:
        *   Base URL configuration (from environment variables).
        *   Attaching authentication tokens to requests.
        *   Standardized error handling (e.g., custom `ApiError` class).
    *   **Consider Data Fetching Libraries:** For more advanced data management (caching, optimistic updates, etc.), explore libraries like React Query (TanStack Query) or SWR for both web and mobile.

5.  **State Management:**
    *   **Web & Mobile:** The use of React Context (`AuthContext`) for authentication is a good start. As the app grows, evaluate if more specialized state management solutions (Zustand, Redux Toolkit) are needed for other global or complex local states.

6.  **Configuration:**
    *   Consistently use `.env` files for environment-specific configurations.
    *   Provide `.env.example` files in each application (`artnft-backend`, `react-native-app`, root for web) to document required variables.

7.  **Documentation (READMEs):**
    *   **Main `README.md`**: High-level project overview, tech stack, and setup instructions for all parts. Link to app-specific READMEs.
    *   **App-Specific READMEs (`artnft-backend/README.md`, `react-native-app/README.md`):** Detailed setup, architecture, scripts, and considerations for that specific application.

By adhering to these principles, the project will remain organized and easier to manage as it evolves.

---
## 🗂️ APIs So Far (Conceptual & Initial Backend Implementation)

-   **Authentication (`/api/auth/`)**: Signup, Signin, Wallet Signin (**backend actively attempts sig verification**), Me, Forgot/Reset Password (**backend actively attempts email sending**).
-   **Users (`/api/users/`)**: Get public profile (`/:userId`), Update authenticated profile (`/me`), Get favorites (`/me/favorites`), Get activity (`/me/activity`).
-   **NFTs (`/api/nfts/`)**: Get all (filtered, includes `trending` mock, `sortBy` support), Get single (`/:id_or_slug`), Create, Get activity (`/:nftId/activity`), Toggle favorite (`/:nftId/favorite`).
-   **Collections (`/api/collections/`)**: Get all (filtered, `sortBy` support), Get single (`/:id_or_slug`), Create.
-   **Offers (`/api/`)**: `POST /nfts/:nftId/offers`, `GET /nfts/:nftId/offers`, `GET /users/me/offers/made`, `GET /users/me/offers/received`, `PUT /offers/:offerId/accept` (with sale transaction), `PUT /offers/:offerId/reject`, `DELETE /offers/:offerId/cancel`.
-   **Reports (`/api/reports/`)**: Create (`POST /`).
-   **Uploads (`/api/upload/`)**: Image upload (`POST /image` - uses Firebase Storage).
-   **Stats (`/api/stats/`)**: Get public overview stats (`/overview`). Get trading volume (`/trading-volume`). Get top collections (`/top-collections`). Get top NFTs (`/top-nfts`). Get leaderboards (`/leaderboard/:type`).
-   **Admin (`/api/admin/`)**: Full CRUD & status updates for Users, NFTs, Collections, Reports. Platform Stats (`/stats/overview`). Platform Settings (`/settings`). Storage Management (`/storage/files` GET/DELETE with prefix search, `/storage/stats`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or later recommended) and npm (or yarn/pnpm).
- **PostgreSQL Server:** A running instance of PostgreSQL (version 12 or later recommended).
- **Firebase Project:** A Firebase project with:
    - Firebase Storage enabled.
    - A Firebase service account key (JSON file).
- **For Email Functionality (Forgot Password):** SMTP server or email sending service credentials (e.g., SendGrid, Mailgun).
- **For React Native Development:** See `react-native-app/README.md` for detailed prerequisites (includes Expo CLI, Android Studio/Xcode setup, image picker permissions, WalletConnect deep linking).
- **For Web WalletConnect**: An Infura ID (or similar RPC provider URL) for `NEXT_PUBLIC_INFURA_ID` in `.env.local` is **required** for the Web WalletConnect integration to function with public networks.

### Installation & Setup
1. Clone the repository (or download the project files).
2. Navigate into the project's root directory.

### Frontend Setup (Next.js)
1. Navigate to the frontend directory (usually the project root, where the `package.json` with Next.js dependencies is).
2. Install dependencies: `npm install`
3. Create a `.env.local` file in the project root directory (copy `.env.local.example` or create from scratch as shown below). Add:
   ```env
   # File: .env.local (in the root of your artnft-marketplace project)
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001/api 
   # Replace with your actual backend URL if different
   
   # REQUIRED for Web WalletConnect to function with public networks (e.g., Ethereum Mainnet/Testnets)
   # Replace YOUR_INFURA_PROJECT_ID with your actual ID from infura.io
   # NEXT_PUBLIC_INFURA_ID=YOUR_INFURA_PROJECT_ID 
   ```
   (Ensure `NEXT_PUBLIC_BACKEND_URL` points to your running backend API, which is `/api` not just the base URL of the backend server itself)

### Backend Setup (Node.js/Express/PostgreSQL)
Located in the `artnft-backend/` directory.

#### PostgreSQL Setup
1.  **Install PostgreSQL:** If you don't have PostgreSQL installed, download and install it from [postgresql.org](https://www.postgresql.org/download/).
2.  **Create Database User (Optional but Recommended):**
    *   Using `psql` or a GUI tool like pgAdmin, create a dedicated user for your application. Replace `your_db_user` and `your_strong_password` with your desired credentials.
        ```sql
        CREATE USER your_db_user WITH PASSWORD 'your_strong_password';
        ```
3.  **Create Database:**
    *   Create the database that your application will use. Replace `artnft_db` with the name you will use in your `.env` file for `DB_DATABASE`.
        ```sql
        CREATE DATABASE artnft_db;
        ```
    *   Grant privileges to your user on the new database:
        ```sql
        GRANT ALL PRIVILEGES ON DATABASE artnft_db TO your_db_user;
        ALTER DATABASE artnft_db OWNER TO your_db_user;
        ```
        (If you didn't create a separate user, your default PostgreSQL superuser will own it).

#### Firebase Setup
1.  **Create a Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
2.  **Enable Firebase Storage:** In your Firebase project, navigate to "Storage" and click "Get started". Follow the prompts to enable Cloud Storage. Note your Storage bucket URL (it usually looks like `your-project-id.appspot.com`).
3.  **Generate a Service Account Key:**
    *   In the Firebase Console, go to "Project settings" (click the gear icon ⚙️).
    *   Select the "Service accounts" tab.
    *   Click "Generate new private key" and confirm. A JSON file will be downloaded. **Keep this file secure!**
4.  **Configure Firebase in Backend:** You have two options for providing the service account key to the backend:
    *   **Option A (File Path - Recommended for local development):**
        *   Place the downloaded JSON key file somewhere accessible to your backend project (e.g., in the `artnft-backend/` root, but **ensure it's added to your `.gitignore` file to prevent committing it to version control**).
        *   Set the `FIREBASE_SERVICE_ACCOUNT_KEY_PATH` environment variable in `artnft-backend/.env` to the path of this JSON file (e.g., `FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./your-service-account-key.json`).
    *   **Option B (Base64 Encoded JSON):**
        *   Convert the content of the downloaded JSON key file into a single-line Base64 encoded string.
        *   Set the `FIREBASE_SERVICE_ACCOUNT_BASE64` environment variable in `artnft-backend/.env` to this Base64 string.
        *   **Note:** If both `FIREBASE_SERVICE_ACCOUNT_KEY_PATH` and `FIREBASE_SERVICE_ACCOUNT_BASE64` are set, the file path usually takes precedence.

#### Environment Variables (`artnft-backend/.env`)
1. Navigate to the `artnft-backend/` directory.
2. Create a `.env` file (you can copy `artnft-backend/.env.example` if it exists and rename it, or create one from scratch).
3. Fill in the required environment variables:
   ```env
   # File: artnft-backend/.env

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_db_user        # Your PostgreSQL username
   DB_PASSWORD=your_strong_password # Your PostgreSQL password
   DB_DATABASE=artnft_db           # Your PostgreSQL database name

   # JWT Configuration
   JWT_SECRET=your_very_strong_and_long_jwt_secret_key_at_least_32_characters # IMPORTANT: Change this to a secure random string
   JWT_EXPIRES_IN=1h               # Or other duration like 7d, 3600 (for seconds)

   # Firebase Configuration
   # Option A: Path to service account key (ensure file is in .gitignore)
   FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./path-to-your-firebase-service-account-key.json
   # Option B: Base64 encoded service account key JSON (if not using file path)
   # FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_json_key
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com # Your Firebase Storage bucket URL

   # Email Transport Configuration (for password reset, etc.)
   # These are required for Nodemailer to send emails.
   EMAIL_HOST=smtp.example.com     # Your SMTP server hostname
   EMAIL_PORT=587                  # Your SMTP server port (e.g., 587 for TLS, 465 for SSL)
   EMAIL_USER=your_smtp_username   # Your SMTP username
   EMAIL_PASS=your_smtp_password   # Your SMTP password
   EMAIL_FROM="ArtNFT Support <no-reply@artnft.example.com>" # Sender email address

   # Server Configuration
   PORT=3001
   NODE_ENV=development            # 'production' or 'development'
   ```
   **Note:** An `.env.example` file is typically provided in `artnft-backend/` as a template.

#### Database Migrations
1. Install backend dependencies (if not already done):
   ```bash
   cd artnft-backend
   npm install
   ```
2. **CRITICAL:** Ensure your database server is running and the `artnft-backend/.env` file is correctly configured with your database connection details *before* running migrations.
3. Run TypeORM migrations to create database tables. This process is automated by the backend scripts:
   ```bash
   npm run migration:run
   ```

### React Native App Setup
1.  Navigate to the `react-native-app/` directory.
2.  Follow the detailed setup instructions in `react-native-app/README.md`. This includes installing dependencies (like `@walletconnect/react-native-dapp`, `expo-image-picker`, `react-native-toast-message`), setting up environment variables for the mobile app (including `API_URL`), and configuring deep linking for WalletConnect and permissions for the image picker.

### Running Development Servers
- **Frontend (Next.js):**
  ```bash
  # In the project root directory (where Next.js package.json is)
  npm run dev
  ```
  (Usually accessible at `http://localhost:3000` or `http://localhost:9002`)

- **Backend (Node.js/Express):**
  ```bash
  # In the artnft-backend/ directory
  npm run dev
  ```
  (Usually accessible at `http://localhost:3001`)

- **React Native App (Expo):**
  ```bash
  # In the react-native-app/ directory
  npm start
  # or
  # expo start
  ```
  (Follow instructions in the terminal to open on a device/emulator)

- **Genkit (AI Features - for Web App):**
  ```bash
  # In the project root directory (where Genkit config likely resides)
  npm run genkit:dev
  ```
  (Genkit developer UI usually accessible at `http://localhost:4000`)

---

## 🎨 Styling & Theming
- Web: Utilizes Tailwind CSS for utility-first styling, ShadCN UI for pre-built components. Theme configuration in `src/app/globals.css` and `tailwind.config.ts`.
- Mobile: Uses React Native's StyleSheet API. A `theme.ts` file in `react-native-app/src/styles/` defines the color palette and spacing, aiming for consistency with the web theme.

---

## 🤖 AI Integration (Genkit)
- AI-powered features are planned using Google's Genkit (for the web application).
- Genkit flows will reside in `src/ai/flows/`.
- Genkit initialization in `src/ai/genkit.ts`.

---

## 🧪 Comprehensive Testing

A robust testing strategy is crucial for ensuring the reliability, security, and functionality of the ArtNFT Marketplace across all platforms (web, backend, mobile, admin).

### Backend Testing (`artnft-backend/`)
-   **Unit Tests:**
    -   **Services (`AuthService`, `NftService`, `OfferService`, `StatsService`, etc.):**
        *   Test individual service methods in isolation.
        *   Mock database repository calls (`AppDataSource.getRepository(...).find...`, `.save`, etc.) to control inputs and verify outputs without actual database interaction.
        *   **`AuthService`**: Mock `ethers.verifyMessage` to simulate valid/invalid signatures for `signInWithWallet`. Mock `nodemailer.createTransport().sendMail` for `initiatePasswordReset`. Test password hashing.
        *   **`OfferService`**: Test offer creation, acceptance (NFT state changes, transaction logging, rejection of other offers), rejection, cancellation. Verify atomicity.
        *   **`StatsService`**: Test aggregation logic for trading volume, top collections/NFTs, leaderboards with mock data.
    -   **Controllers:** Test request handling, DTO validation, and service method calls. Mock service dependencies.
-   **Integration Tests:**
    -   Test interactions between components, typically at the API endpoint level. Use a test database.
    *   **Authentication Flow (`/api/auth/`):** Full signup, signin (email/password, wallet), forgot/reset password API flows.
    *   **Offer Flow (`/api/offers/`, `/api/nfts/.../offers`):** Create, view, accept, reject, cancel offers via API, verifying database state.
    *   **Stats Endpoints (`/api/stats/`):** Test with various query parameters.
    *   Verify middleware (auth, admin role, validation).

### Frontend Testing (`src/` - Web Application)
-   **Component Tests (e.g., using React Testing Library with Jest/Vitest):**
    -   Test components like `WalletConnectModal` (MetaMask & WalletConnect flows, error display), `SigninForm`, `NftCard`, `MakeOfferModal`.
    *   Verify UI rendering, user interactions, and state changes.
    *   Mock `apiService` calls and wallet provider SDKs (`window.ethereum`, `@walletconnect/web3-provider`).
-   **Integration Tests (Frontend Context):**
    *   Test flows like Wallet Login (`WalletConnectModal` + `AuthContext`), Forgot Password, Offer Creation.

### Mobile App Testing (`react-native-app/`)
-   **Unit Tests (e.g., using Jest with React Native Testing Library):**
    -   Test components (`WalletButtons`, forms, cards), utility functions, API service logic (mocking `axios`), state management (`authContext.tsx`).
    *   Mock `useWalletConnect`, `expo-image-picker`, and `imageUploadService` for component tests.
    *   Test form validation logic and submission handlers.
-   **Component Integration Tests:**
    -   Test screen composition, navigation, and API call effects on UI, especially for Create NFT/Collection forms, Edit Profile, and Profile tabs (including offer actions).
-   **End-to-End (E2E) Tests (e.g., using Detox, Appium, or Maestro):**
    -   Simulate full user flows on emulators/devices: signup, login (email, WalletConnect), profile editing (with image uploads), NFT/collection creation & browsing (with image uploads), making/managing offers.

### Admin Panel Testing (`src/app/(admin)/...` - Web Application)
-   **E2E Testing (e.g., using Cypress or Playwright):** This is the most critical form of testing for the admin panel.
    *   **Authentication:** Admin login, session management, logout.
    *   **User Management:**
        *   List users, search/filter users.
        *   View user details.
        *   Update user details (username, email, roles, suspension status, profile info). Verify changes.
    *   **NFT Management:**
        *   List NFTs, search/filter NFTs (by status, verification, listed status).
        *   View NFT details.
        *   Update NFT status (review status, verification, listed for sale, admin notes). Verify changes and activity logs.
        *   Delete NFT. Verify deletion and activity log.
    *   **Collection Management:**
        *   List collections, search/filter collections (by verification).
        *   View collection details.
        *   Update collection status (verification, admin notes). Verify changes and activity logs.
        *   Delete collection. Verify deletion and activity log.
    *   **Report Management:**
        *   List reports, search/filter reports (by status, item type).
        *   View report details.
        *   Update report status (pending, action taken, dismissed, resolved, admin notes). Verify changes and activity logs.
    *   **Platform Settings:**
        *   View current settings.
        *   Update various setting types (string, number, boolean) and verify they are saved and applied correctly (if possible to observe effects).
    *   **Storage Management:**
        *   List files (root and with prefixes).
        *   Search/filter files by prefix.
        *   Delete a file and verify its removal.
        *   View bucket metadata.
    *   **Navigation & UI:** Ensure all links work, modals open/close correctly, forms submit, and data tables are responsive and display information accurately.
-   **Backend API Testing for Admin Endpoints (`/api/admin/*`):**
    *   **Integration Tests (e.g., Jest with Supertest):**
        *   Verify all admin-specific API endpoints are protected by `authMiddleware` and `adminRoleMiddleware`.
        *   Test input validation (DTOs) for all update/create operations.
        *   Test service logic for each admin action (e.g., `userService.updateUserByAdmin`, `nftService.updateNftStatusByAdmin`).
        *   Verify correct database interactions and that activity logs are created for admin actions.

### General Testing Principles:
-   **CI/CD Integration:** Automate tests to run on every commit/pull request.
-   **Test Coverage:** Aim for good test coverage, especially for critical business logic.
-   **Mocking:** Use appropriate mocking for external services and APIs.
-   **Data Seeding:** Consistent test data for integration and E2E tests.

---
## 🛡️ Security Hardening

Ensuring the security of the ArtNFT Marketplace is paramount. This involves continuous effort across all parts of the application.

**Backend (`artnft-backend/`):**
1.  **Input Validation:**
    *   Consistently use `class-validator` and `class-transformer` for all incoming DTOs in controllers to prevent malformed data and potential injection attacks.
    *   Validate data types, lengths, formats, and ranges.
2.  **Authentication & Authorization:**
    *   **Strong JWT Secret:** Ensure `JWT_SECRET` is a long, complex, random string stored securely as an environment variable.
    *   **HTTPS Only for JWTs:** Transmit JWTs only over HTTPS in production.
    *   **Short Token Expiry:** Use reasonably short expiry times for JWTs (`JWT_EXPIRES_IN`) and implement a token refresh mechanism if needed for longer sessions.
    *   **Secure Password Handling:** Use `bcryptjs` for hashing passwords with a strong salt factor. Never store plain-text passwords.
    *   **Role-Based Access Control (RBAC):** Rigorously enforce role checks (e.g., `adminRoleMiddleware`) for sensitive endpoints. Ensure default user roles have minimal necessary privileges.
    *   **Secure Wallet Signature Verification:** Continue using `ethers.verifyMessage` for wallet signature verification. Ensure the message signed is unique and contains anti-replay elements (like a timestamp or nonce if not already handled by message origin checks).
3.  **Secure File Uploads (Firebase Storage & Multer):**
    *   **Server-Side Validation:** Even if the client validates, the backend *must* re-validate file types (MIME types using libraries, not just extension), size limits, and potentially scan for malware before saving to Firebase Storage. (Current backend Multer config has basic MIME type and size checks).
    *   **Sanitize Filenames:** Generate unique, sanitized filenames on the server to prevent path traversal or injection issues if original filenames were ever used in paths. (Current implementation uses UUIDs, which is good).
    *   **Firebase Storage Security Rules:** Configure Firebase Storage security rules to restrict access appropriately (e.g., only authenticated users can upload to specific paths, public read access for images as needed, disallow executable uploads).
4.  **Prevent Common Web Vulnerabilities:**
    *   **SQL Injection:** TypeORM helps significantly by parameterizing queries. Avoid raw SQL queries where possible. If raw queries are necessary, ensure inputs are meticulously sanitized or use query builders correctly.
    *   **Cross-Site Scripting (XSS):** While primarily a frontend concern, ensure any data from the backend that might be rendered as HTML is properly sanitized/escaped on the frontend. Set appropriate `Content-Security-Policy` headers.
    *   **Cross-Site Request Forgery (CSRF):** For state-changing requests (POST, PUT, DELETE) not primarily protected by JWT Bearer tokens (e.g., if cookie-based sessions were ever used for web views interacting with the API), CSRF token protection would be necessary. With Bearer tokens in headers for API calls, CSRF is less of a direct concern but understand the context.
    *   **Insecure Direct Object References (IDOR):** Ensure that users can only access/modify resources they own or are authorized for (e.g., an offer can only be accepted by the NFT owner, an offer can only be cancelled by the offerer). This is usually handled in service layers.
5.  **Error Handling:**
    *   Return generic error messages to clients in production. Avoid exposing detailed internal error messages or stack traces. Log detailed errors server-side.
6.  **Rate Limiting & Brute Force Protection:**
    *   Implement rate limiting on sensitive endpoints like login, signup, password reset requests, and potentially high-volume API endpoints to prevent abuse and brute-force attacks.
7.  **Dependency Management:**
    *   Regularly update dependencies (`npm update` or equivalent) for all parts of the project.
    *   Use tools like `npm audit`, `snyk`, or GitHub Dependabot to identify and fix known vulnerabilities in third-party packages.
8.  **HTTPS Enforcement:**
    *   Ensure the production deployment uses HTTPS for all communication. Configure HSTS headers.
9.  **Logging & Monitoring:**
    *   Implement comprehensive logging for security events (failed logins, auth changes, admin actions), errors, and important transactions. Monitor logs for suspicious activity.
10. **Security Headers:**
    *   Implement security-related HTTP headers like `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`.

**Frontend (Web - `src/` & Mobile - `react-native-app/`):**
1.  **Input Validation (Client-Side):**
    *   While server-side validation is key, client-side validation (e.g., using Zod with React Hook Form in web, similar logic in RN) improves UX and reduces invalid requests.
2.  **Secure Token Handling:**
    *   **Web:** Store JWTs in `localStorage` (as currently done) or `HttpOnly` cookies if a backend-for-frontend (BFF) pattern is used. Be aware of XSS risks with `localStorage` – ensure no un-sanitized user content can execute scripts.
    *   **Mobile:** Store JWTs securely using `@react-native-async-storage/async-storage` for basic needs. For higher security (if dealing with very sensitive data locally, though JWTs are usually short-lived), consider `react-native-keychain` or equivalent secure enclave/keystore storage solutions.
3.  **XSS Prevention:**
    *   React (and Next.js) automatically escapes most dynamic content. Be extremely cautious when using `dangerouslySetInnerHTML` (web) or injecting HTML into WebViews (mobile). Sanitize any user-generated content that might be rendered in such ways.
4.  **Secure API Calls:**
    *   Always use HTTPS for API calls.
5.  **Wallet Interaction Security:**
    *   Clearly explain to users what messages they are signing and what transactions they are approving.
    *   Do not request or handle private keys or seed phrases.
    *   Validate data received from wallet providers.
6.  **Deep Linking Security (Mobile):**
    *   Validate any data received through deep links carefully before processing it.
7.  **Dependency Management:**
    *   Regularly update frontend dependencies.

**Admin Panel (Web - `src/app/(admin)/...`):**
1.  **Strong Authentication & Authorization:**
    *   Ensure admin login is secure and distinct.
    *   Verify admin role checks (`adminRoleMiddleware` on backend) are robust for all admin functionalities.
2.  **Audit Trails:**
    *   The existing activity logging in the backend for admin actions is good. Ensure all critical admin actions are logged with sufficient detail (who did what, when, to what resource, originating IP if relevant).
3.  **Input Validation:**
    *   Validate all inputs submitted through admin forms on both frontend (for UX) and backend (for security).
4.  **Session Management:**
    *   Implement secure session management, including session timeouts for admin users.
5.  **Principle of Least Privilege:**
    *   If more granular admin roles are introduced, ensure users only have access to the functions necessary for their role.

---
## 🌍 Building for Production
- Web Frontend: `npm run build`
- Backend: `npm run build` (in `artnft-backend/`)
- Mobile App: Refer to Expo documentation for building standalone apps (`expo build:android`, `expo build:ios` or EAS Build).

---

## ☁️ Deployment
- (Details on deployment strategy to be added - e.g., Vercel for Next.js frontend, Docker/Cloud Run/App Engine for backend, managed PostgreSQL service, App Store/Play Store for mobile).

---

## 🤝 Contributing
- (Contribution guidelines to be added if applicable).

---

## 🗺️ Roadmap

**Phase 1: Foundation & Core UI (Largely Complete for Web & Backend)**
- [x] Project setup, UI shells, Core components, Mock APIs.

**Phase 2: Backend Implementation & Core Functionality (Largely Complete for Web & Backend)**
- [x] **Backend Project Setup & DB Schema.**
- [x] **User Authentication (Backend):** Implemented (Email/Pass, backend actively attempts wallet signature verification with `ethers` & email sending for Forgot Password with `nodemailer` - **requires env config for SMTP & frontend signing for full wallet auth**).
- [x] **User Profile Management (Backend & Web Frontend):** Implemented.
- [x] **NFT Management (Backend & Web Frontend Create/View):** Implemented.
- [x] **Collection Management (Backend & Web Frontend Create/View):** Implemented.
- [x] **Offer Management (Backend & Web Frontend UI):** Implemented (Create, View, Accept with NFT transfer & sale logging, Reject, Cancel offers).
- [x] **Report Management (Backend & Admin Web UI):** User-facing POST, Admin CRUD & status updates.
- [x] **Activity Feed (Backend & Web Frontend Display):** Implemented for key actions.
- [x] **Transaction Logging (Backend):** Implemented `TransactionEntity` for sales.
- [x] **Stats Page (Backend & Web Frontend):** Dynamic data for overview, trading volume, top collections, top NFTs, leaderboards.
- [x] **Admin Panel (Backend APIs & Web Frontend UI):** Implemented for Users, NFTs, Collections, Reports, Stats, Settings, Storage.
- [x] **Backend File Uploads (Firebase Storage):** Implemented and integrated.
- [x] **Web Frontend Wallet Integration (MetaMask & WalletConnect):** Functional MetaMask sign-in. WalletConnect structure using `@walletconnect/web3-provider` and `ethers@5` is in place, requires Infura ID/RPC config by user.

**Phase 2.5: Mobile App Foundation & Core Features (In Progress)**
- [x] **React Native Project Setup:** Basic structure, navigation, API service, theme, core dependencies (`WalletConnect`, `AsyncStorage`, `ImagePicker`, `Picker`, `ToastMessage`).
- [x] **Mobile Authentication (Email/Password & WalletConnect):** Auth context and screens are set up. Email/password flow connects to backend. WalletConnect flow using `@walletconnect/react-native-dapp` implemented (requires deep link setup & testing by user).
- [x] **Mobile Core Screens (Data Fetching & UI):** Home (data fetching), NFT/Collection browsing & detail (data fetching), Profile (data fetching for tabs, offer actions with confirmation).
- [x] **Mobile - Create NFT/Collection (Forms implemented with image picking & API submission logic).**
- [x] **Mobile - Edit Profile (Screen implemented with image picking & API submission logic).**
- [x] **Mobile - Toast Notifications:** Implemented using `react-native-toast-message`.
- [ ] **Mobile - Image Upload Progress:** Basic "uploading..." message implemented. True progress indicators are a future enhancement.
- [x] **Mobile - Navigation After Creation:** Implemented for NFT & Collection creation.

**Phase 3: Advanced Features & Polish (Web & Backend & Mobile)**
-   [ ] **Frontend - Full Coinbase Wallet & Other Provider Support (Web & Mobile):** Fully implement and test.
-   [ ] **Testing:** Implement comprehensive unit, integration, and E2E tests as outlined in the "Comprehensive Testing" section for web, backend, mobile, and admin panel.
-   [ ] **Real-time Notifications & Activity Feeds (Web & Mobile).**
-   [ ] **AI-Powered Features (Genkit - Web).**
-   [ ] Performance Optimization & Security Hardening (All platforms - ongoing, detailed in "Security Hardening" section).
-   [ ] **Mobile - Advanced UI/UX:** Implement true image upload progress indicators.

**Phase 4: Blockchain & NFT Operations (Future - Web & Backend, then Mobile)**
- [ ] Smart Contract Development/Integration.
- [ ] NFT Minting Flow: Full implementation (on-chain).
- [ ] NFT Buying & Selling (on-chain).
- [ ] NFT Offering System (on-chain if applicable).
- [ ] Wallet Integration: Deeper integration for on-chain transactions.

**Phase 5: Launch & Iteration (Future)**
- [ ] Production Deployment for Web & Backend.
- [ ] Mobile App Beta/Launch.
- [ ] Monitoring & Analytics.
- [ ] Community Building.
- [ ] Ongoing enhancements.

---
*This README is a living document and will be updated regularly to reflect the current state and progress of the ArtNFT Marketplace project.*

---
## 📄 License
- (Specify License - e.g., MIT, Apache 2.0).

---
## 📞 Contact
- (Project Maintainer/Lead Contact Information).

