
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
- [🗂️ APIs So Far (Conceptual & Initial Backend Implementation)](#️-apis-so-far-conceptual--initial-backend-implementation)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Frontend Setup (Next.js)](#frontend-setup-nextjs)
  - [Backend Setup (Node.js/Express/PostgreSQL)](#backend-setup-nodejsesspostgresql)
    - [PostgreSQL Setup](#postgresql-setup)
    - [Firebase Setup](#firebase-setup)
    - [Environment Variables](#environment-variables)
    - [Database Migrations](#database-migrations)
  - [React Native App Setup](#react-native-app-setup)
  - [Running Development Servers](#running-development-servers)
- [📁 Project Structure](#-project-structure)
- [🎨 Styling & Theming](#-styling--theming)
- [🤖 AI Integration (Genkit)](#-ai-integration-genkit)
- [🧪 Comprehensive Testing](#-comprehensive-testing)
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
    *   **WalletConnect Integration (Frontend - Conceptual):** UI in `WalletConnectModal` for WalletConnect, attempting to use `@walletconnect/web3-provider`. Full functionality depends on RPC setup (e.g., Infura ID) and specific wallet interactions.
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

### Planned Features (High-Level Roadmap):
- **Frontend - Full Coinbase Wallet & Other Provider Support (Web & Mobile).**
- **Smart Contract Interactions:** Minting, buying, selling, offering NFTs on-chain.
- **Real-time Features:** Notifications, live activity feeds.
- **AI-Powered Enhancements (Genkit).**
- **React Native Mobile App - Core Feature Implementation.**

---

## 📱 Mobile Application

A React Native mobile application is planned and initiated in the `react-native-app/` directory. It includes foundational setup for navigation, authentication context, and WalletConnect integration using `@walletconnect/react-native-dapp`. Core feature screens (Home, NFT Detail, Collection List/Detail, Profile, Create NFT/Collection) have basic data fetching, form structures, and UI placeholders. For detailed setup and development instructions for the mobile app, please refer to the `react-native-app/README.md` file within that directory.

---

## 📄 Application Screens Overview
(Largely unchanged from previous, reflects current state. WalletConnectModal now has distinct options)
1.  **Onboarding/Authentication:** Welcome, Wallet Connect (MetaMask functional; WalletConnect conceptual/placeholder; Coinbase Wallet placeholder), Email Sign Up/In, Verification, Forgot Password.
... (rest of the screens remain the same)

---

## 🛠️ Tech Stack

-   **Frontend Framework (Web):** Next.js (v15.x) with React (v18.x).
-   **Mobile Framework:** React Native (with Expo).
-   **Language (Frontend & Mobile):** TypeScript.
-   **Styling (Web):** Tailwind CSS (v3.x), ShadCN UI.
-   **Styling (Mobile):** StyleSheet API, potentially a UI library (e.g., React Native Paper, NativeBase).
-   **State Management (Web):** React Context API (`AuthContext`), React Hooks.
-   **State Management (Mobile):** React Context API (`authContext.tsx`), React Hooks.
-   **Form Handling (Web):** React Hook Form with Zod.
-   **Charting (Web):** Recharts.
-   **Wallet Integration (Web):** Direct `window.ethereum` for MetaMask, `@walletconnect/web3-provider` (with `ethers@5`) for WalletConnect.
-   **Wallet Integration (Mobile):** `@walletconnect/react-native-dapp` for WalletConnect, `ethers@5` (for utilities like hex encoding).
-   **Image Picking (Mobile):** `expo-image-picker`.
-   **Dropdowns/Pickers (Mobile):** `@react-native-picker/picker`.
-   **AI Integration:** Genkit.
-   **Icons (Web):** Lucide React.
-   **Icons (Mobile):** Lucide React Native (or SVGs).
-   **Backend (Node.js/Express/PostgreSQL - in `artnft-backend/` directory):**
    -   Runtime: Node.js with Express.js.
    -   Language (Backend): TypeScript.
    -   Database: **PostgreSQL (version 12+ recommended)**.
    -   ORM: **TypeORM**.
    -   Authentication: JWT, bcryptjs, UUID, **`ethers` (v6, for backend signature verification - actively implemented)**.
    -   API: RESTful.
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
    *   Main entry point `App.tsx` with `WalletConnectProvider` and `AuthProvider`.
    *   Component-based architecture (`src/components`, `src/screens`).
    *   Navigation using React Navigation (`src/navigation`).
    *   API service (`src/api/apiService.ts`) for backend communication.
    *   State management (`src/store/authContext.tsx`).
-   **Styling Architecture:** Global styles, Tailwind CSS config (web); StyleSheet API, theme file (mobile).

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
- **For React Native Development:** See `react-native-app/README.md` for detailed prerequisites (includes Expo CLI, Android Studio/Xcode setup).
- **For Web WalletConnect**: An Infura ID (or similar RPC provider URL) for `NEXT_PUBLIC_INFURA_ID` in `.env.local` if you plan to connect to mainnet or specific testnets via WalletConnect on the web.

### Installation & Setup
1. Clone the repository (or download the project files).
2. Navigate into the project's root directory.

### Frontend Setup (Next.js)
1. Navigate to the frontend directory (usually the project root, where the `package.json` with Next.js dependencies is).
2. Install dependencies: `npm install`
3. Create a `.env.local` file in the project root directory (e.g., copy `.env.local.example` if provided, or create from scratch). Add:
   ```env
   # File: .env.local (in the root of your artnft-marketplace project)
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001/api 
   # Replace with your actual backend URL if different
   
   # Optional: For Web WalletConnect if connecting to specific RPCs
   # Replace YOUR_INFURA_PROJECT_ID with your actual ID
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
3. Run TypeORM migrations to create database tables:
   ```bash
   npm run migration:run
   ```

### React Native App Setup
1.  Navigate to the `react-native-app/` directory.
2.  Follow the detailed setup instructions in `react-native-app/README.md`. This includes installing dependencies (like `@walletconnect/react-native-dapp`, `expo-image-picker`) and setting up environment variables for the mobile app (including `API_URL` and deep linking configuration for WalletConnect).

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

## 📁 Project Structure
(Briefly outline the main directories and their purpose for frontend, backend, and mobile app)
- `artnft-backend/`: Node.js, Express, TypeORM, PostgreSQL backend.
- `react-native-app/`: React Native (Expo) mobile application.
- `src/`: Next.js, React, ShadCN UI frontend application.

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

A robust testing strategy is crucial for ensuring the reliability, security, and functionality of the ArtNFT Marketplace across all platforms (web, backend, mobile).

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
    -   Mock `useWalletConnect` and `expo-image-picker` for component tests.
-   **Component Integration Tests:**
    -   Test screen composition, navigation, and API call effects on UI.
-   **End-to-End (E2E) Tests (e.g., using Detox, Appium, or Maestro):**
    -   Simulate full user flows on emulators/devices: signup, login (email, WalletConnect), profile editing, NFT/collection creation & browsing.

### End-to-End (E2E) Tests (Overall Application - Web & Mobile)
-   Simulate user journeys in real browser/device environments.
-   **Authentication & Recovery:** All signup/signin methods, password reset.
-   **Core Marketplace Flows:** Browsing, creating NFTs/Collections, making/managing offers.
-   **Admin Panel Flows (Web).**

### General Testing Principles:
-   **CI/CD Integration:** Automate tests on every commit/pull request.
-   **Test Coverage:** Aim for good coverage, especially for critical business logic.
-   **Mocking:** Use appropriate mocking for external services and APIs.
-   **Data Seeding:** Consistent test data for integration and E2E tests.

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
- [x] **Web Frontend Wallet Integration (MetaMask & WalletConnect - Conceptual):** Functional MetaMask sign-in. WalletConnect structure using `@walletconnect/web3-provider` is in place, requires RPC setup by user.

**Phase 2.5: Mobile App Foundation & Core Features (In Progress)**
- [x] **React Native Project Setup:** Basic structure, navigation, API service, theme, core dependencies.
- [x] **Mobile Authentication (Email/Password & WalletConnect - Conceptual):** Auth context and screens are set up. Email/password flow connects to backend. WalletConnect flow using `@walletconnect/react-native-dapp` is structured, requires deep link setup by user.
- [x] **Mobile Core Screens (Placeholders & Basic Data Fetching):** Home (data fetching), NFT/Collection browsing (data fetching), Profile (data fetching for tabs).
- [x] **Mobile - View NFTs/Collections (Data Fetching Implemented).**
- [ ] **Mobile - Create NFT/Collection (Forms structured, submission logic pending).**
- [ ] **Mobile - Offer Management (UI in Profile tabs, API interaction pending).**
- [ ] **Mobile - Edit Profile (Screen structured, form logic & image upload pending).**

**Phase 3: Advanced Features & Polish (Web & Backend)**
-   [ ] **Frontend - Full Coinbase Wallet & Other Provider Support (Web & Mobile):** Fully implement and test.
-   [ ] **Testing:** Implement comprehensive unit, integration, and E2E tests as outlined in the "Comprehensive Testing" section for web, backend, and mobile.
-   [ ] **Real-time Notifications & Activity Feeds (Web).**
-   [ ] **AI-Powered Features (Genkit - Web).**
-   [ ] Performance Optimization & Security Hardening.

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

    
