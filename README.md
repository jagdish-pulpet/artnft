
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
  <a href="https://graphql.org"><img src="https://img.shields.io/badge/API-REST%20%26%20GraphQL-f5005F?style=flat-square&logo=graphql&logoColor=white" alt="API: REST & GraphQL"/></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Styling-TailwindCSS-cyan?style=flat-square&logo=tailwindcss&logoColor=white" alt="Styling: Tailwind CSS"/></a>
  <a href="https://firebase.google.com/docs/genkit"><img src="https://img.shields.io/badge/AI-Genkit-brightgreen?style=flat-square&logo=google&logoColor=white" alt="AI: Genkit"/></a>
  <br/>
  <a href="https://github.com/jagdish-pulpet/artnft"><img src="https://img.shields.io/github/languages/top/jagdish-pulpet/artnft?style=flat-square" alt="GitHub top language"/></a>
  <a href="https://github.com/jagdish-pulpet/artnft"><img src="https://img.shields.io/github/repo-size/jagdish-pulpet/artnft?style=flat-square" alt="GitHub repo size"/></a>
  <a href="https://github.com/jagdish-pulpet/artnft/graphs/contributors"><img src="https://img.shields.io/github/contributors/jagdish-pulpet/artnft?style=flat-square" alt="GitHub contributors"/></a>
</p>

ArtNFT Marketplace is a cutting-edge, full-stack platform designed for artists, collectors, and enthusiasts in the burgeoning world of Non-Fungible Tokens (NFTs). It offers a seamless and engaging experience across web and mobile for discovering unique digital artworks, creating and listing NFTs, and interacting with a vibrant community. This project is structured as a **monorepo** to manage multiple applications and shared packages efficiently.

## Table of Contents

1.  [✨ Key Features](#-key-features)
2.  [🏗️ Project Architecture](#️-project-architecture)
3.  [📁 Current Project Structure](#-current-project-structure)
4.  [🛠️ Tech Stack](#️-tech-stack)
5.  [🚀 Getting Started](#-getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Monorepo Setup](#monorepo-setup)
    *   [Application-Specific Setup](#application-specific-setup)
    *   [Running Development Servers](#running-development-servers)
6.  [🎨 Styling & Theming](#-styling--theming)
7.  [🤖 AI Integration (Genkit)](#-ai-integration-genkit)
8.  [📱 Mobile Application (React Native)](#-mobile-application-react-native)
9.  [🔗 API Layer (REST & GraphQL)](#-api-layer-rest--graphql)
10. [🌍 Building for Production](#-building-for-production)
11. [☁️ Deployment](#️-deployment)
12. [🤝 Contributing](#-contributing)
13. [🗺️ Roadmap](#️-roadmap)
14. [📄 License](#-license)
15. [📞 Contact](#-contact)

## ✨ Key Features

*(Key features remain largely the same but apply to web and conceptually mobile where relevant. The backend supports these frontends.)*

<details>
<summary><strong>User Authentication (Across Platforms):</strong></summary>
*   Secure sign-up and login for web users, handled by the central API.
*   Admin login via the API.
*   Simulated wallet connection UI.
</details>

<details>
<summary><strong>Dynamic Dashboards (Web & Mobile Home):</strong></summary>
*   Responsive layouts for web (`apps/web/src/app`) and native experience for mobile (`apps/mobile`).
*   Personalized content feeds, artist spotlights, category exploration.
</details>

<details>
<summary><strong>Advanced NFT Creation & Listing (Web, with AI):</strong></summary>
*   User-friendly interface for minting NFTs with AI-powered content assistance (Genkit within Next.js, primarily in `apps/web/src/ai`).
</details>

<details>
<summary><strong>Comprehensive NFT & User Discovery:</strong></summary>
*   Detailed NFT pages, robust search with filtering, category pages, user profiles accessible via web and mobile.
</details>

<details>
<summary><strong>Robust Admin Panel (`apps/web/src/app/admin`):</strong></summary>
*   Secure admin login, user/NFT management, category control, promotions, analytics, audit logs, content moderation, site settings.
</details>

## 🏗️ Project Architecture

ArtNFT Marketplace is architected as a **monorepo** to manage its multiple applications and shared libraries efficiently. This approach enhances code sharing, simplifies dependency management, and streamlines the development workflow.

The core components are:

*   **Applications (`apps/`):**
    *   **Web App (`apps/web`):** A Next.js application serving the main user-facing marketplace and the admin panel. It handles user authentication, NFT discovery, creation (with Genkit AI), and user profiles. The source code is primarily in `apps/web/src/`, with pages and routes in `apps/web/src/app/`.
    *   **Mobile App (`apps/mobile`):** A React Native application (placeholder) providing a native experience for iOS and Android users.
    *   **API Service (`apps/api`):** A Node.js (Express.js) backend providing RESTful APIs (GraphQL planned). It handles business logic, database interactions (MySQL/MariaDB via Sequelize), authentication (JWT), and serves data to all frontend applications. Source code is in `apps/api/src/`.

*   **Shared Packages (`packages/`):**
    *   **`ui/`:** Reusable React UI components (e.g., `AppLayout`, `ArtNFTLogo`, `GlobalHeader`) built with ShadCN UI, shared primarily by `apps/web`. Source: `packages/ui/src/`.
    *   **`mobile-ui/`:** (Placeholder) Reusable React Native UI components for `apps/mobile`.
    *   **`utils/`:** Common utility functions (like `cn` for classnames) shared across the entire codebase. Source: `packages/utils/src/`.
    *   **`types/`:** (Placeholder) Centralized TypeScript definitions for API contracts, database models, etc.
    *   **`api-client/`:** (Placeholder) A dedicated client library for frontend applications to interact with `apps/api`.
    *   **`core-logic/`:** (Placeholder) Shared business logic modules.

*   **Database (`database/`):**
    *   A MySQL/MariaDB relational database.
    *   Schema is managed via `database/schema.sql` and versioned using database migrations (planned).

*   **Communication:**
    *   Client applications (`web`, `mobile`) communicate with the central `apps/api` service.
    *   Genkit AI functionalities are integrated within the `apps/web` Next.js server environment (in `apps/web/src/ai/`).

## 📁 Current Project Structure

This project utilizes a monorepo structure:

```
artnft-marketplace/
├── apps/
│   ├── web/                      # Next.js Frontend (User & Admin)
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/              # Next.js App Router (pages, layouts)
│   │   │   │   ├── admin/        # Admin panel routes & components
│   │   │   │   └── ...           # User-facing routes
│   │   │   ├── components/       # Web-app specific components (NFTCard, etc.)
│   │   │   │   └── ui/           # ShadCN UI components (specific to web app)
│   │   │   ├── lib/              # Web-app specific utils (e.g., utils.ts for cn)
│   │   │   ├── hooks/            # Web-app specific hooks (e.g., use-toast)
│   │   │   └── ai/               # Genkit AI flows & config
│   │   ├── components.json       # ShadCN config for apps/web
│   │   ├── next.config.ts
│   │   └── package.json
│   ├── mobile/                   # React Native App (Placeholder)
│   │   ├── src/
│   │   └── package.json
│   └── api/                      # Node.js Backend API
│       ├── src/                  # Backend source (Express, Sequelize, etc.)
│       └── package.json
├── packages/
│   ├── ui/                       # Shared React UI components (AppLayout, ArtNFTLogo)
│   │   ├── src/
│   │   └── package.json
│   ├── mobile-ui/                # (Placeholder) Shared React Native UI components
│   │   ├── src/
│   │   └── package.json
│   ├── utils/                    # Shared utility functions (cn utility)
│   │   ├── src/
│   │   └── package.json
│   ├── types/                    # (Placeholder) Shared TypeScript types
│   │   └── package.json
│   └── ...                       # Other shared packages (api-client, core-logic placeholders)
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schema.sql
├── .gitignore
├── README.md                     # This file
└── package.json                  # Root package.json for monorepo (npm workspaces)
```

## 🛠️ Tech Stack

**Monorepo Management:**
*   **Tooling:** NPM Workspaces (TurboRepo or Nx can be added for advanced task running).

**Web Frontend & Admin Panel (`apps/web`):**
*   **Framework:** [Next.js](https://nextjs.org/) (v15+ with App Router located in `apps/web/src/app/`)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Library:** [React](https://react.dev/)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/) (local to `apps/web/src/components/ui/`)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (configured in `apps/web/tailwind.config.ts`, main styles in `apps/web/src/app/globals.css`)
*   **AI Integration:** [Genkit (by Google)](https://firebase.google.com/docs/genkit) (in `apps/web/src/ai/`)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Shared Code:** Consumes `packages/ui` (for `AppLayout`, `ArtNFTLogo`), `packages/utils` (for `cn`).

**Mobile Application (`apps/mobile`) (Placeholder):**
*   **Framework:** [React Native](https://reactnative.dev/)
*   *(Details similar to previous, consumes shared packages as needed)*

**Backend API (`apps/api`):**
*   **Runtime:** [Node.js](https://nodejs.org/) (Source in `apps/api/src/`)
*   **Framework:** [Express.js](https://expressjs.com/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **API Styles:** RESTful APIs (GraphQL planned)
*   **Database:** [MySQL / MariaDB](https://www.mysql.com/)
*   **ORM:** [Sequelize](https://sequelize.org/)
*   **Authentication:** JWT (JSON Web Tokens)
*   *(Details similar to previous)*

**Shared Packages (`packages/*`):**
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **`packages/ui`:** Core shared layout and UI primitive components.
*   **`packages/utils`:** Core shared utilities like `cn`.

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [npm](https://www.npmjs.com/) (v7+ for workspace support, or Yarn)
*   [MySQL Server](https://dev.mysql.com/downloads/mysql/) or [MariaDB Server](https://mariadb.org/download/)
*   A MySQL/MariaDB client
*   For Mobile: React Native development environment.

### Monorepo Setup
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jagdish-pulpet/artnft.git
    cd artnft
    ```
2.  **Install dependencies from the root:**
    ```bash
    npm install # This will install dependencies for all workspaces
    ```
3.  **Environment Variables:**
    *   **Web App (`apps/web/.env.local`):**
        *   `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000` (or your API's URL)
        *   `GOOGLE_API_KEY=` (for Genkit)
        *   `COINMARKETCAP_API_KEY=` (for Stats page)
    *   **API Service (`apps/api/.env`):**
        *   `DB_HOST=localhost`
        *   `DB_USER=your_db_user`
        *   `DB_PASSWORD=your_db_password`
        *   `DB_NAME=artnft_db`
        *   `DB_PORT=3306`
        *   `JWT_SECRET=your_jwt_secret`
        *   `PORT=5000` (optional, defaults to 5000 in `apps/api/src/server.ts`)

### Application-Specific Setup

*   **API (`apps/api`):**
    *   Ensure MySQL/MariaDB server is running.
    *   Create the database (e.g., `artnft_db`).
    *   Apply schema: `npm run db:schema:apply --workspace=apps/api` (from the root directory) or navigate to `apps/api` and run `npm run db:schema:apply`.
*   **Web Frontend (`apps/web`):**
    *   No additional specific setup beyond environment variables.

### Running Development Servers

*   **From the root directory (recommended):**
    ```bash
    # Run both web and API concurrently
    npm run dev
    ```
    This typically uses the `dev` script in the root `package.json`: `"dev": "npm run dev:web & npm run dev:api"`

*   **Individually:**
    1.  **API (`apps/api`):** In a terminal, from the root: `npm run dev:api` (or `cd apps/api && npm run dev`). Runs on `http://localhost:5000` (or `process.env.PORT`).
    2.  **Web App (`apps/web`):** In another terminal, from the root: `npm run dev:web` (or `cd apps/web && npm run dev`). Runs on `http://localhost:9002`.
    3.  **Genkit Dev UI (for `apps/web`):** From the root: `npm run genkit:watch --workspace=apps/web` (or `cd apps/web && npm run genkit:watch`). Runs on `http://localhost:4000`.

## 🎨 Styling & Theming
*   Main styles in `apps/web/src/app/globals.css`.
*   Tailwind CSS configured in `apps/web/tailwind.config.ts`.
*   ShadCN UI components are local to `apps/web/src/components/ui/`.

## 🤖 AI Integration (Genkit)
*   Genkit flows are located in `apps/web/src/ai/flows/`.
*   Genkit development server can be run via `npm run genkit:watch --workspace=apps/web`.

## 📱 Mobile Application (React Native) (`apps/mobile`)
*   This is currently a placeholder. Development would involve setting up React Native and integrating with `packages/api-client` and `packages/mobile-ui`.

## 🔗 API Layer (REST & GraphQL) (`apps/api`)
*   The `apps/api` service provides RESTful endpoints. GraphQL integration is planned.
*   Uses Express.js, Sequelize for MySQL/MariaDB.

## 🌍 Building for Production
*   `npm run build --workspace=apps/web`
*   `npm run build --workspace=apps/api`
*   (For monorepo tools like Turborepo, a single `turbo run build` might be configured in the future).

## ☁️ Deployment
*   **Frontend (`apps/web`):** Firebase App Hosting, Vercel, Netlify.
*   **Backend (`apps/api`):** Node.js hosting (Google Cloud Run, AWS Elastic Beanstalk, Heroku).
*   **Database:** Cloud-hosted MySQL/MariaDB.

## 🤝 Contributing
*(Contribution guidelines would apply to the monorepo as a whole.)*

## 🗺️ Roadmap

*   **Phase 1 (Monorepo & Core):**
    *   [x] Establish Monorepo structure with NPM workspaces.
    *   [x] Migrate Next.js app to `apps/web`.
    *   [x] Migrate Node.js backend to `apps/api`.
    *   [x] Refactor key shared elements (UI: `AppLayout`, `ArtNFTLogo`; Utils: `cn`) into `packages/*`.
    *   [ ] Implement full backend CRUD operations and business logic in `apps/api`.
    *   [ ] Fully connect `apps/web` to `apps/api` for all features.
*   **Phase 2: GraphQL API & Mobile Foundation:**
    *   [ ] Define GraphQL schema in `apps/api`.
    *   [ ] Implement resolvers for GraphQL queries and mutations.
    *   [ ] Update/create `packages/api-client` to support GraphQL & REST.
    *   [ ] Initialize React Native project in `apps/mobile` with basic navigation.
*   **Phase 3: Feature Expansion & Polish:**
    *   [ ] Develop core mobile screens for `apps/mobile`.
    *   [ ] Advanced GenAI integrations, personalized recommendations.
    *   [ ] Community features (commenting, messaging).
    *   [ ] Comprehensive testing, performance optimization, security hardening.

## 📄 License
Distributed under the MIT License.

## 📞 Contact
Project Lead / Maintainer: [CloudFi] - [artnft.io]
Project Link: [https://github.com/jagdish-pulpet/artnft](https://github.com/jagdish-pulpet/artnft)
---
Thank you for checking out ArtNFT Marketplace! We're excited to see how it evolves.
        