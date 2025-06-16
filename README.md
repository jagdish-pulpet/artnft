
# ArtNFT Marketplace

**A Modern Platform for Discovering, Creating, and Trading Digital Art & NFTs**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <a href="https://github.com/jagdish-pulpet/artnft/stargazers"><img src="https://img.shields.io/github/stars/jagdish-pulpet/artnft?style=flat-square" alt="GitHub Stars"/></a>
  <a href="https://github.com/jagdish-pulpet/artnft/network/members"><img src="https://img.shields.io/github/forks/jagdish-pulpet/artnft?style=flat-square" alt="GitHub Forks"/></a>
  <a href="https://github.com/jagdish-pulpet/artnft/issues"><img src="https://img.shields.io/github/issues/jagdish-pulpet/artnft?style=flat-square" alt="GitHub Issues"/></a>
  <a href="https://github.com/jagdish-pulpet/artnft/commits/main"><img src="https://img.shields.io/github/last-commit/jagdish-pulpet/artnft?style=flat-square" alt="GitHub Last Commit"/></a>
  <br/>
  <a href="apps/web/package.json"><img src="https://img.shields.io/badge/WebApp-v0.1.0-blue?style=flat-square" alt="Web App Version"/></a>
  <a href="apps/api/package.json"><img src="https://img.shields.io/badge/API-v1.0.0-green?style=flat-square" alt="API Version"/></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Web-Next.js-black?style=flat-square&logo=next.js&logoColor=white" alt="Built with Next.js"/></a>
  <a href="https://reactnative.dev"><img src="https://img.shields.io/badge/Mobile-React%20Native-blueviolet?style=flat-square&logo=react&logoColor=white" alt="Mobile: React Native"/></a>
  <br/>
  <a href="https://www.mysql.com"><img src="https://img.shields.io/badge/Database-MySQL%20%2F%20MariaDB-blue?style=flat-square&logo=mysql&logoColor=white" alt="Database: MySQL / MariaDB"/></a>
  <a href="https://graphql.org"><img src="https://img.shields.io/badge/API-GraphQL%20%26%20REST-f5005F?style=flat-square&logo=graphql&logoColor=white" alt="API: GraphQL & REST"/></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Styling-TailwindCSS-cyan?style=flat-square&logo=tailwindcss&logoColor=white" alt="Styling: Tailwind CSS"/></a>
  <a href="https://firebase.google.com/docs/genkit"><img src="https://img.shields.io/badge/AI-Genkit-brightgreen?style=flat-square&logo=google&logoColor=white" alt="AI: Genkit"/></a>
  <br/>
  <a href="https://github.com/jagdish-pulpet/artnft"><img src="https://img.shields.io/github/languages/top/jagdish-pulpet/artnft?style=flat-square" alt="GitHub top language"/></a>
  <a href="https://github.com/jagdish-pulpet/artnft"><img src="https://img.shields.io/github/repo-size/jagdish-pulpet/artnft?style=flat-square" alt="GitHub repo size"/></a>
  <a href="https://github.com/jagdish-pulpet/artnft/graphs/contributors"><img src="https://img.shields.io/github/contributors/jagdish-pulpet/artnft?style=flat-square" alt="GitHub contributors"/></a>
</p>

ArtNFT Marketplace is a cutting-edge, full-stack platform designed for artists, collectors, and enthusiasts in the burgeoning world of Non-Fungible Tokens (NFTs). It offers a seamless and engaging experience across web and mobile for discovering unique digital artworks, creating and listing NFTs, and interacting with a vibrant community. This project is structured as a monorepo to manage multiple applications and shared packages efficiently.

## Table of Contents

1.  [✨ Key Features](#-key-features)
2.  [📄 Application Screens Overview](#-application-screens-overview)
3.  [🏗️ Project Architecture](#️-project-architecture)
4.  [📁 Proposed Project Structure](#-proposed-project-structure)
5.  [🛠️ Tech Stack](#️-tech-stack)
6.  [🚀 Getting Started](#-getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Monorepo Setup](#monorepo-setup)
    *   [Application-Specific Setup](#application-specific-setup)
    *   [Running Development Servers](#running-development-servers)
7.  [🎨 Styling & Theming](#-styling--theming)
8.  [🤖 AI Integration (Genkit)](#-ai-integration-genkit)
9.  [📱 Mobile Application (React Native)](#-mobile-application-react-native)
10. [🔗 API Layer (REST & GraphQL)](#-api-layer-rest--graphql)
11. [🌍 Building for Production](#-building-for-production)
12. [☁️ Deployment](#️-deployment)
13. [🤝 Contributing](#-contributing)
14. [🗺️ Roadmap](#️-roadmap)
15. [📄 License](#-license)
16. [📞 Contact](#-contact)

## ✨ Key Features

*(Key features remain largely the same but would now apply to web, admin, and conceptually mobile where relevant. The backend supports all these frontends.)*

<details>
<summary><strong>User Authentication (Across Platforms):</strong></summary>
*   Secure sign-up and login for web and mobile users, handled by the central API.
*   Admin login via the API.
*   Simulated wallet connection UI (can be adapted for mobile).
</details>

<details>
<summary><strong>Dynamic Dashboards (Web & Mobile Home):</strong></summary>
*   Responsive layouts for web (`apps/web`) and native experience for mobile (`apps/mobile`).
*   Personalized content feeds, artist spotlights, category exploration.
</details>

<details>
<summary><strong>Advanced NFT Creation & Listing (Web, with AI):</strong></summary>
*   User-friendly interface for minting NFTs with AI-powered content assistance (Genkit within Next.js).
</details>

<details>
<summary><strong>Comprehensive NFT & User Discovery:</strong></summary>
*   Detailed NFT pages, robust search with filtering, category pages, user profiles accessible via web and mobile.
</details>

<details>
<summary><strong>Robust Admin Panel (`apps/admin` or part of `apps/web`):</strong></summary>
*   Secure admin login, user/NFT management, category control, promotions, analytics, audit logs, content moderation, site settings.
</details>

*(Other feature details like Notifications, Settings, Crypto Stats page would be adapted or implemented for each relevant application: web, admin, mobile.)*

## 📄 Application Screens Overview
*(This section would be updated to specify which screens apply to Web, Admin, and the new Mobile app.)*

## 🏗️ Project Architecture

ArtNFT Marketplace is architected as a **monorepo** to manage its multiple applications and shared libraries efficiently. This approach enhances code sharing, simplifies dependency management, and streamlines the development workflow.

The core components are:

*   **Applications (`apps/`):**
    *   **Web App (`apps/web`):** A Next.js application serving the main user-facing marketplace. It handles user authentication, NFT discovery, creation (with Genkit AI), and user profiles.
    *   **Admin Panel (`apps/admin` or part of `apps/web`):** A Next.js application (or a section within the web app) for platform administration.
    *   **Mobile App (`apps/mobile`):** A React Native application providing a native experience for iOS and Android users to browse, discover, and interact with NFTs and the community.
    *   **API Service (`apps/api`):** A Node.js (Express.js) backend providing both **RESTful** and **GraphQL** APIs. It handles business logic, database interactions (MySQL/MariaDB via Sequelize), authentication (JWT), and serves data to all frontend applications.

*   **Shared Packages (`packages/`):**
    *   **`ui/` & `mobile-ui/`:** Reusable React (for web/admin) and React Native (for mobile) UI components.
    *   **`utils/`:** Common utility functions shared across the entire codebase.
    *   **`types/`:** Centralized TypeScript definitions for API contracts, database models, and other shared data structures, ensuring type consistency.
    *   **`api-client/`:** A dedicated client library (e.g., using `fetch`, Apollo Client for GraphQL) for frontend applications to interact with the `apps/api` service.
    *   **`core-logic/`:** Shared business logic modules if applicable.

*   **Database (`database/`):**
    *   A MySQL/MariaDB relational database stores all persistent data.
    *   Schema is managed via `schema.sql` and versioned using database migrations.

*   **Communication:**
    *   All client applications (`web`, `admin`, `mobile`) communicate with the central `apps/api` service via its REST and/or GraphQL endpoints.
    *   Genkit AI functionalities are integrated within the `apps/web` (or `apps/admin`) Next.js server environment.

## 📁 Proposed Project Structure

This project proposes a monorepo structure for better organization and scalability:

```
artnft-marketplace/
├── apps/
│   ├── web/                      # Next.js Frontend (User-facing) - Current root project
│   │   ├── public/
│   │   ├── src/                  # Your current Next.js app's src
│   │   └── package.json          # Next.js app dependencies
│   ├── admin/                    # Next.js Admin Panel (Could be part of 'web' or separate)
│   │   ├── public/
│   │   ├── src/                  # Admin-specific Next.js src
│   │   └── package.json
│   ├── mobile/                   # React Native App (NEW)
│   │   ├── src/
│   │   ├── ios/
│   │   ├── android/
│   │   └── package.json          # React Native app dependencies
│   └── api/                      # Node.js Backend (Evolved from artnft-backend-node)
│       ├── src/                  # Backend source (Express, GraphQL, Sequelize)
│       └── package.json          # Backend dependencies
├── packages/
│   ├── ui/                       # Shared React UI components (ShadCN based for web/admin)
│   │   ├── src/
│   │   └── package.json
│   ├── mobile-ui/                # Shared React Native UI components (NEW)
│   │   ├── src/
│   │   └── package.json
│   ├── utils/                    # Shared utility functions (TS/JS)
│   │   ├── src/
│   │   └── package.json
│   ├── types/                    # Shared TypeScript types (API contracts, domain models)
│   │   ├── src/
│   │   └── package.json
│   ├── api-client/               # Client for interacting with the API
│   │   ├── src/
│   │   └── package.json
│   └── core-logic/               # Shared business logic modules (if any)
│       ├── src/
│       └── package.json
├── database/
│   ├── migrations/               # Database migration files
│   ├── seeds/                    # Database seed files
│   └── schema.sql                # Main database schema (MySQL/MariaDB)
├── tools/
│   └── monorepo-tool-config/     # (e.g., turbo.json, nx.json, lerna.json config)
├── .gitignore
├── README.md                     # This file
└── package.json                  # Root package.json for monorepo tooling (e.g., Turborepo, Lerna)
```
*Note: Implementing this structure would involve moving existing code into the `apps/web` and `apps/api` (from `artnft-backend-node`) directories and setting up monorepo tooling.*

## 🛠️ Tech Stack

This project leverages a modern, full-stack technology suite:

**Monorepo Management (Recommended):**
*   **Tooling:** [Turborepo](https://turbo.build/repo), [Nx](https://nx.dev/), or [Lerna](https://lerna.js.org/) for managing the multi-package repository.

**Web Frontend & Admin Panel (`apps/web`, `apps/admin`):**
*   **Framework:** [Next.js](https://nextjs.org/) (v15+ with App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Library:** [React](https://react.dev/)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/) (built on Radix UI)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (with HSL-based theming)
*   **AI Integration (Specific Features):** [Genkit (by Google)](https://firebase.google.com/docs/genkit) with Google AI Models (e.g., Gemini), run within the Next.js server environment.
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **State Management:** React Hooks, Next.js Router Hooks.
*   **Form Handling:** Standard React, [React Hook Form](https://react-hook-form.com/).
*   **Shared Code:** Consumes `packages/ui`, `packages/api-client`, `packages/types`, `packages/utils`.

**Mobile Application (`apps/mobile`) (NEW):**
*   **Framework:** [React Native](https://reactnative.dev/) (or [Expo](https://expo.dev/) for streamlined development)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Navigation:** [React Navigation](https://reactnavigation.org/)
*   **State Management:** Options like Zustand, Redux Toolkit, or React Query / TanStack Query.
*   **Styling:** React Native StyleSheet, Styled Components, or utility-first libraries for React Native.
*   **Shared Code:** Consumes `packages/mobile-ui`, `packages/api-client`, `packages/types`, `packages/utils`.

**Backend API (`apps/api`):**
*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework:** [Express.js](https://expressjs.com/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **API Styles:**
    *   **GraphQL:** [Apollo Server](https://www.apollographql.com/docs/apollo-server/) or [Yoga GraphQL](https://the-guild.dev/graphql/yoga-server) (integrated with Express).
    *   **RESTful APIs:** Using Express.js routing.
*   **Database:** [MySQL / MariaDB](https://www.mysql.com/)
*   **ORM:** [Sequelize](https://sequelize.org/)
*   **Authentication:** JWT (JSON Web Tokens), `bcryptjs` for password hashing.
*   **Environment Management:** `dotenv`.
*   **Shared Code:** Consumes `packages/core-logic`, `packages/types`.

**Shared Packages (`packages/*`):**
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **`packages/ui` Development:** [Storybook](https://storybook.js.org/) for component development and testing.

**Database Layer (`database/`):**
*   **System:** MySQL / MariaDB
*   **Schema Definition:** SQL (`schema.sql`)
*   **Migrations:** Sequelize CLI or [Knex.js](https://knexjs.org/) migrations (recommended for versioning schema changes).

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   [MySQL Server](https://dev.mysql.com/downloads/mysql/) or [MariaDB Server](https://mariadb.org/download/)
*   A MySQL/MariaDB client (e.g., `mysql` CLI, MySQL Workbench, DBeaver)
*   For Mobile:
    *   React Native development environment (Xcode for iOS, Android Studio for Android). Refer to [React Native Environment Setup](https://reactnative.dev/docs/environment-setup).
    *   Expo CLI (if using Expo): `npm install -g expo-cli`
*   Monorepo tool (e.g., Turborepo): `npm install -g turbo`

### Monorepo Setup
(Assuming a tool like Turborepo is used)
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jagdish-pulpet/artnft.git
    cd artnft
    ```
2.  **Install root dependencies and bootstrap packages:**
    ```bash
    npm install # Or yarn install
    # Monorepo tool might have a bootstrap command, e.g., turbo install or lerna bootstrap
    ```
3.  **Environment Variables:**
    *   Each application in `apps/` (web, api, mobile) will have its own `.env` or `.env.local` file for specific configurations (API keys, database URLs, etc.).
    *   `apps/web/.env.local`: `GOOGLE_API_KEY`, `COINMARKETCAP_API_KEY`, `NEXT_PUBLIC_API_BASE_URL` (pointing to `apps/api`).
    *   `apps/api/.env`: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `JWT_SECRET`.

### Application-Specific Setup

*   **API (`apps/api` - formerly `artnft-backend-node`):**
    *   Navigate to `apps/api`.
    *   Install dependencies: `npm install`.
    *   Setup `.env` file with database credentials and JWT secret.
    *   Ensure MySQL/MariaDB server is running. Create the database (e.g., `artnft_db`).
    *   Apply schema: `mysql -u your_user -p artnft_db < ../../database/schema.sql`.
    *   Run migrations (if using a migration tool): `npx sequelize-cli db:migrate`.
*   **Web Frontend & Admin (`apps/web`, `apps/admin`):**
    *   Navigate to `apps/web` (or `apps/admin`).
    *   Install dependencies: `npm install`.
    *   Setup `.env.local`.
*   **Mobile App (`apps/mobile`):**
    *   Navigate to `apps/mobile`.
    *   Install dependencies: `npm install`.
    *   Follow React Native/Expo instructions for platform-specific setup (iOS, Android).

### Running Development Servers
(Commands might vary based on monorepo tool)

*   **From the root directory using a monorepo tool (e.g., Turborepo):**
    ```bash
    turbo run dev 
    # This would typically run dev scripts for all apps/packages defined in turbo.json
    # Alternatively, run specific apps:
    # turbo run dev --filter=api
    # turbo run dev --filter=web
    # turbo run dev --filter=mobile 
    # turbo run genkit:watch --filter=web # For Genkit within the web app
    ```

*   **Individually (if not using a monorepo runner for all):**
    1.  **API (`apps/api`):** In `apps/api/`, run `npm run dev`. (Typically on `http://localhost:5000`)
    2.  **Web App (`apps/web`):** In `apps/web/`, run `npm run dev`. (Typically on `http://localhost:9002`)
    3.  **Genkit Dev UI (from `apps/web`):** In `apps/web/`, run `npm run genkit:watch`. (Typically on `http://localhost:4000`)
    4.  **Mobile App (`apps/mobile`):** In `apps/mobile/`, run `npm run ios` or `npm run android` (or `expo start`).

## 🎨 Styling & Theming
*(Largely unchanged, applies to `apps/web` and `apps/admin`)*

## 🤖 AI Integration (Genkit)
*(Largely unchanged, primarily within `apps/web` or `apps/admin` Next.js server environment)*

## 📱 Mobile Application (React Native) (NEW)

*   **Platform:** `apps/mobile` built with React Native (or Expo).
*   **Purpose:** Provides a native mobile experience for users to discover, view, and interact with NFTs and the marketplace community.
*   **Key Features (Conceptual):**
    *   NFT browsing and discovery.
    *   User profiles and followed artists.
    *   Notifications.
    *   Wallet connection (using mobile-specific wallet SDKs).
*   **API Communication:** Uses the shared `packages/api-client` to interact with `apps/api`.

## 🔗 API Layer (REST & GraphQL) (NEW/ENHANCED)

The `apps/api` service provides a robust backend for all client applications.
*   **Dual Interface:** Offers both RESTful endpoints (Express.js) for traditional API interactions and a GraphQL API (e.g., Apollo Server) for flexible data querying.
*   **GraphQL Benefits:** Particularly useful for the mobile app to fetch precisely the data it needs, reducing over-fetching and under-fetching.
*   **`packages/api-client`:** This shared package will be designed to consume both REST and GraphQL endpoints, providing a unified interface for frontend apps.
*   **Authentication:** JWT-based authentication is used for securing both REST and GraphQL endpoints.

## 🌍 Building for Production
*(Commands would be adapted for monorepo tooling, e.g., `turbo run build --filter=...`)*

## ☁️ Deployment
*   **Monorepo Considerations:** Deployment strategies will need to accommodate the monorepo structure. CI/CD pipelines can be set up to build and deploy individual apps from `apps/` when changes are detected in them or their dependencies in `packages/`.
*   **Frontend (`apps/web`, `apps/admin`):** Firebase App Hosting, Vercel, Netlify.
*   **Backend (`apps/api`):** Node.js hosting (Heroku, AWS Elastic Beanstalk, Google Cloud Run).
*   **Mobile App (`apps/mobile`):** App Store (iOS), Google Play Store (Android).
*   **Database:** Cloud-hosted MySQL/MariaDB (AWS RDS, Google Cloud SQL, Azure, DigitalOcean Managed Databases).

## 🤝 Contributing
*(Contribution guidelines would generally apply to the monorepo as a whole, with specific considerations for each package/app.)*

## 🗺️ Roadmap

*   **Phase 1 & 2 (Refined for Monorepo):**
    *   [ ] Establish Monorepo structure with tooling (e.g., Turborepo).
    *   [ ] Migrate existing Next.js app to `apps/web`.
    *   [ ] Migrate existing Node.js backend to `apps/api`.
    *   [ ] Refactor shared elements (UI, utils, types) into `packages/*`.
    *   [ ] Implement full backend CRUD operations and business logic in `apps/api` for MySQL/MariaDB.
    *   [ ] Fully connect `apps/web` (and `apps/admin`) to `apps/api`.
*   **Phase X: GraphQL API Implementation (NEW):**
    *   [ ] Define GraphQL schema in `apps/api`.
    *   [ ] Implement resolvers for GraphQL queries and mutations.
    *   [ ] Update/extend `packages/api-client` to support GraphQL.
*   **Phase Y: Mobile Application Development (NEW):**
    *   [ ] Initialize React Native project in `apps/mobile`.
    *   [ ] Develop core mobile screens (Home, NFT Details, Profile, Search).
    *   [ ] Implement mobile-specific authentication and wallet interactions.
    *   [ ] Integrate `packages/api-client` for data fetching.
*   **Phase Z: Advanced Features & Polish (Across all platforms):**
    *   Advanced GenAI integrations, personalized recommendations.
    *   Community features (commenting, messaging).
    *   Comprehensive testing, performance optimization, security hardening.

## 📄 License
Distributed under the MIT License.

## 📞 Contact
Project Lead / Maintainer: [CloudFi] - [artnft.io]
Project Link: [https://github.com/jagdish-pulpet/artnft](https://github.com/jagdish-pulpet/artnft)
---
Thank you for checking out ArtNFT Marketplace! We're excited to see how it evolves.

    