
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
    - **MetaMask Integration (Frontend & Backend):** Functional flow to connect with MetaMask, prompt users to sign a message, and authenticate against the backend. Backend (`AuthService`) actively attempts cryptographic signature verification using `ethers.js`.
    - **Placeholders for Other Wallets (Frontend):** UI in `WalletConnectModal` includes buttons for WalletConnect and Coinbase Wallet, which currently show "Coming Soon" or placeholder messages, demonstrating a multi-wallet selection UI.
  - Email Sign Up & Sign In Forms (Web UI connected to backend via `AuthContext` and `apiService`).
  - Email Verification Screen (Web UI with OTP input, backend connection pending).
  - **Forgot Password Screen & Email Sending (Backend):**
    - Web UI for requesting password reset.
    - Backend `AuthService` actively attempts real email sending using `nodemailer` (requires SMTP environment configuration).
  - **Backend Auth Core:** Full setup for user signup (with password hashing), signin (with JWT generation), wallet sign-in (actively attempts signature verification, auto-registration), forgot password (actively attempts email sending), and reset password flows. Protected `/api/auth/me` route.
- **User Profile Management (Web UI & Backend):** Fully functional.
- **Core Marketplace Pages (Web UI & Backend API Integration):** Home, NFT Detail, Collections List/Detail, Create Collection/NFT, Stats page with dynamic data (overview, trading volume, top collections, top NFTs, leaderboards).
- **NFT, Collection, Offer, Report Management (Backend):** Full CRUD or relevant status updates, including offer acceptance with NFT ownership transfer and sale transaction logging.
- **Activity Feed (Backend & Frontend Display):** Comprehensive activity logging for most key user and admin actions, displayed on profile and NFT detail pages.
- **File Uploads (Backend - Firebase Storage):** Fully integrated for profile, NFT, and collection images.
- **Admin Dashboard & Pages (Web UI & Backend APIs):** Full suite of admin management pages (Users, NFTs, Collections, Reports, Settings, Storage Management with file listing/deletion from Firebase, prefix search, and informational notes on advanced statistics limitations).

### Planned Features (High-Level Roadmap):
- **Frontend - Full WalletConnect & Other Provider Support:** Integrate libraries like Web3Modal/RainbowKit for the web application.
- **Smart Contract Interactions:** Minting, buying, selling, offering NFTs on-chain.
- **Real-time Features:** Notifications, live activity feeds.
- **AI-Powered Enhancements (Genkit).**
- **React Native Mobile App Development.**

---

## 📱 Mobile Application

A React Native mobile application is planned and initiated in the `react-native-app/` directory. For detailed setup and development instructions for the mobile app, please refer to the `react-native-app/README.md` file within that directory.

---

## 📄 Application Screens Overview
(Largely unchanged from previous, reflects current state. Key change: WalletConnectModal now shows multiple options)
1.  **Onboarding/Authentication:** Welcome, Wallet Connect (MetaMask functional; WalletConnect & Coinbase Wallet placeholders), Email Sign Up/In, Verification, Forgot Password.
... (rest of the screens remain the same)

---

## 🛠️ Tech Stack

-   **Frontend Framework (Web):** Next.js (v15.x) with React (v18.x).
-   **Mobile Framework:** React Native (with Expo).
-   **Language (Frontend & Mobile):** TypeScript.
-   **Styling (Web):** Tailwind CSS (v3.x), ShadCN UI.
-   **Styling (Mobile):** StyleSheet API, potentially a UI library (e.g., React Native Paper, NativeBase).
-   **State Management (Web):** React Context API (`AuthContext`), React Hooks.
-   **State Management (Mobile):** React Context API, Zustand, or Redux (to be decided).
-   **Form Handling (Web):** React Hook Form with Zod.
-   **Charting (Web):** Recharts.
-   **AI Integration:** Genkit.
-   **Icons (Web):** Lucide React.
-   **Backend (Node.js/Express/PostgreSQL - in `artnft-backend/` directory):**
    -   Runtime: Node.js with Express.js.
    -   Language (Backend): TypeScript.
    -   Database: **PostgreSQL (version 12+ recommended)**.
    -   ORM: **TypeORM**.
    -   Authentication: JWT, bcryptjs, UUID, **`ethers` (for backend signature verification - actively implemented)**.
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
    -   Expo managed workflow.
    -   Component-based architecture (Screens, Components).
    -   Navigation using React Navigation.
    -   API service for backend communication.
    -   State management solution (Context API or dedicated library).
-   **Styling Architecture:** Global styles, Tailwind CSS config (web); StyleSheet API, theme file (mobile).

---

## 🗂️ APIs So Far (Conceptual & Initial Backend Implementation)

-   **Authentication (`/api/auth/`)**: Signup, Signin, Wallet Signin (**backend actively attempts sig verification**), Me, Forgot/Reset Password (**backend actively attempts email sending**).
-   **Users (`/api/users/`)**: Get public profile (`/:userId`), Update authenticated profile (`/me`), Get favorites (`/me/favorites`), Get activity (`/me/activity`).
-   **NFTs (`/api/nfts/`)**: Get all (filtered), Get trending, Get single (`/:id_or_slug`), Create, Get activity (`/:nftId/activity`), Toggle favorite (`/:nftId/favorite`).
-   **Collections (`/api/collections/`)**: Get all (filtered), Get single (`/:id_or_slug`), Create.
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
- **For React Native Development:** See `react-native-app/README.md` for detailed prerequisites.

### Installation & Setup
1. Clone the repository (or download the project files).
2. Navigate into the project's root directory.

### Frontend Setup (Next.js)
1. Navigate to the frontend directory (usually the project root if not a monorepo, or `src/` if `package.json` is at root).
2. Install dependencies: `npm install`
3. Create a `.env.local` file in the project root directory (alongside `package.json`) and add:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001/api 
   # Replace with your actual backend URL if different
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
2. Create a `.env` file (you can copy `.env.example` if it exists and rename it).
3. Fill in the required environment variables:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_db_user        # Your PostgreSQL username
   DB_PASSWORD=your_strong_password # Your PostgreSQL password
   DB_DATABASE=artnft_db           # Your PostgreSQL database name

   # JWT Configuration
   JWT_SECRET=your_very_strong_and_long_jwt_secret_key_at_least_32_characters
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

#### Database Migrations
1. Install backend dependencies (if not already done):
   ```bash
   cd artnft-backend
   npm install
   ```
2. Run TypeORM migrations to create database tables:
   ```bash
   npm run migration:run
   ```
   Ensure your database server is running and the `.env` file is correctly configured before running migrations.

### React Native App Setup
1.  Navigate to the `react-native-app/` directory.
2.  Follow the setup instructions in `react-native-app/README.md`. This typically involves installing dependencies (`npm install`) and then running the app on an emulator/simulator or physical device (`npm start` or `expo start`).

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
  expo start
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
        -   Test individual service methods in isolation.
        -   Mock database repository calls (`AppDataSource.getRepository(...).find...`, `.save`, etc.) to control inputs and verify outputs without actual database interaction.
        -   **`AuthService`**:
            *   Mock `ethers.verifyMessage` to simulate valid and invalid signature scenarios for `signInWithWallet`.
            *   Mock `nodemailer.createTransport().sendMail` to test `initiatePasswordReset` logic (e.g., token generation, user updates) without actual email dispatch. Ensure correct parameters are passed to the mailer.
            *   Test password hashing and comparison logic.
        -   **`OfferService`**: Test offer creation, acceptance (including NFT state changes, transaction logging, rejection of other offers), rejection, and cancellation logic with various valid and invalid inputs. Verify atomicity of transactions.
        -   **`StatsService`**: Test aggregation logic for trading volume, top collections/NFTs, and leaderboards, ensuring correct calculations with mock transaction data. Cover edge cases (no data, single data point, etc.).
    -   **Controllers:** Test request handling, DTO validation, and correct service method calls. Mock service dependencies.
-   **Integration Tests:**
    -   Test interactions between components, typically at the API endpoint level.
    -   Use a test database (e.g., a separate PostgreSQL instance or schema) populated with test data.
    -   **Authentication Flow (`/api/auth/`):** Test full signup, signin (email/password), wallet signin (with a mechanism to provide mock signatures or a test wallet provider if possible in CI), forgot password, and reset password API flows.
    -   **Offer Flow (`/api/offers/`, `/api/nfts/.../offers`):** Test creating, viewing, accepting, rejecting, and canceling offers via API calls, verifying database state changes (NFT ownership, offer status, transaction records).
    -   **Stats Endpoints (`/api/stats/`):** Test endpoints with various query parameters (periods, limits, sortBy), ensuring correct data aggregation and response structure. Test against known datasets.
    -   Verify middleware (auth, admin role, validation) behavior.

### Frontend Testing (`src/` - Web Application)
-   **Component Tests (e.g., using React Testing Library with Jest/Vitest):**
    -   Test individual components like `WalletConnectModal` (various states, button interactions, error display), `SigninForm`, `NftCard`, `MakeOfferModal`, `PaginationControls`, etc.
    *   Verify UI rendering based on props and state.
    *   Test user interactions (button clicks, form inputs) and that they trigger expected callbacks or state changes.
    *   Mock `apiService` calls to simulate backend responses and test how components react to success/error states.
    *   For components interacting with wallet providers (e.g., `WalletConnectModal`), mock the `window.ethereum` object or relevant parts of wallet library SDKs to simulate different scenarios (wallet not installed, connection rejected, signature rejected, successful connection/signature).
-   **Integration Tests (Frontend Context):**
    -   Test flows involving multiple components and context providers.
    *   **Wallet Login Flow (`WalletConnectModal` + `AuthContext`):** Simulate MetaMask connection, message signing, and the `AuthContext.login` call. Verify UI updates based on authentication state.
    *   **Forgot Password Flow (`ForgotPasswordForm`):** Test form submission and the display of success/error messages from `AuthContext`.
    *   **Offer Creation/Management (`NftDetailPage`, `MakeOfferModal`, `ProfilePage` Offers Tab):** Test opening modals, submitting offer forms, and UI updates when offers are created or their status changes.

### Mobile App Testing (`react-native-app/`)
-   **Unit Tests (e.g., using Jest with React Native Testing Library):**
    -   Test individual React Native components (buttons, inputs, cards) for rendering and basic interactions.
    -   Test utility functions, API service logic (mocking `axios` or `fetch`).
    -   Test state management logic (e.g., reducers, context updates).
-   **Component Integration Tests:**
    -   Test how screens compose and interact with their child components.
    -   Verify navigation between screens.
    -   Mock API calls to test screen behavior with different data responses.
-   **End-to-End (E2E) Tests (e.g., using Detox, Appium, or Maestro):**
    -   Simulate full user flows on emulators/simulators or real devices.
    -   Test core scenarios: signup, login (email/wallet), profile viewing/editing, NFT/collection browsing, making offers (if implemented).
    -   Requires setting up a dedicated E2E testing framework for React Native.

### End-to-End (E2E) Tests (Overall Application - Web)
-   Simulate full user journeys through the web application in a real browser environment (e.g., using Cypress, Playwright).
-   **Authentication & Recovery:**
    -   User successfully signs up with email/password.
    *   User successfully signs in with email/password.
    *   User successfully signs in using MetaMask (requires browser extension support in the E2E tool or a way to mock wallet interactions at the browser level).
    *   User attempts to sign in with invalid credentials (email/password, wallet signature).
    *   User successfully requests a password reset email and completes the password reset flow (requires a way to intercept or read emails in the test environment, or mock the token validation part of the reset flow).
-   **Core Marketplace Flows (Web):**
    *   User browses NFTs and collections.
    *   User creates an NFT and a Collection.
    *   User makes an offer on an NFT.
    *   NFT owner accepts/rejects an offer made by another user.
    *   User views their profile and activity.
-   **Admin Panel Flows (Web):**
    *   Admin logs in.
    *   Admin views and performs basic management actions on users, NFTs, collections.

### General Testing Principles:
-   **CI/CD Integration:** Automate tests to run on every commit/pull request for all parts of the project (backend, web frontend, mobile app).
-   **Test Coverage:** Aim for good test coverage, especially for critical business logic (auth, offers, sales) and user flows.
-   **Mocking:** Use appropriate mocking strategies for external services (payment gateways if any, blockchain interactions if not fully on-chain yet, email services in unit/integration tests) and browser/native APIs (like `window.ethereum` or mobile device features).
-   **Data Seeding:** Use consistent test data seeding strategies for integration and E2E tests.

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
- [x] **Web Frontend Wallet Integration (MetaMask):** Functional MetaMask sign-in implemented. Placeholders for other wallets.

**Phase 2.5: Mobile App Foundation & Core Features (Initiated)**
- [ ] **React Native Project Setup:** Basic structure, navigation, API service, theme.
- [ ] **Mobile Authentication:** Implement email/password and wallet sign-in flows.
- [ ] **Mobile Core Screens:** Home, NFT/Collection browsing, Profile.
- [ ] **Mobile - View NFTs/Collections.**
- [ ] **(Future for Mobile)** Create NFT/Collection, Offer Management, etc.

**Phase 3: Advanced Features & Polish (Web & Backend)**
-   [ ] **Web Frontend - Full WalletConnect & Other Provider Support:** Integrate libraries like Web3Modal/RainbowKit.
-   [ ] **Testing:** Implement comprehensive unit, integration, and E2E tests as outlined in the "Comprehensive Testing" section for web and backend.
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

    