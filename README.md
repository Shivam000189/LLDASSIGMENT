# Low-Level Design (LLD) Practice Platform

An automated, full-stack platform for practicing, evaluating, and mastering Object-Oriented Low-Level Design (LLD) in **TypeScript** and **Python**. Built with **React 19, TypeScript, Express, MongoDB, Google Gemini, and Anthropic Claude**.

---

## 🌐 Live Deployments

- **Frontend Application (Vercel)**: [https://llm-nu-six.vercel.app/](https://llm-nu-six.vercel.app/)
- **Backend API Server (Render)**: [https://lldassigment.onrender.com/](https://lldassigment.onrender.com/)
- **API Health Check**: [https://lldassigment.onrender.com/api/health](https://lldassigment.onrender.com/api/health)

---

## 📑 Table of Contents
- [Overview](#overview)
- [Screenshots & Demo](#screenshots--demo)
- [Core Features](#core-features)
- [Multi-Language Support (TypeScript & Python)](#multi-language-support-typescript--python)
- [Curated Problem Catalog](#curated-problem-catalog)
- [Technology Stack](#technology-stack)
- [System Architecture & Design Patterns](#system-architecture--design-patterns)
- [Evaluation Engine](#evaluation-engine)
- [Project Directory Structure](#project-directory-structure)
- [Local Development & Setup](#local-development--setup)
- [Running Tests](#running-tests)
- [Production Deployment](#production-deployment)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)

---

## Overview

Unlike algorithmic coding platforms (e.g. LeetCode) where evaluation is a binary pass/fail based on input/output test cases, **Object-Oriented Low-Level Design requires evaluating structural architecture and qualitative design trade-offs**:

- **Decomposition & Single Responsibility Principle (SRP)**
- **Coupling, Cohesion & Abstraction Quality**
- **Extensibility & Open/Closed Principle (OCP)**
- **Domain Modeling, State Representation & Entity Coverage**
- **Readability & Idiomatic Naming Conventions**

This platform provides an automated **Submit → Non-Blocking Evaluation → Multi-Dimensional Feedback → Iterate** learning loop with real-time static analysis and LLM-assisted design critiques for both TypeScript and Python.

---

## Screenshots & Demo

### 1. Problem Catalog
*Browse through curated LLD challenges with requirement teasers and difficulty indicators.*

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                   [ Screenshot: Problem Catalog Page ]                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. Problem Detail & Dual-Language Code Workspace
*Review comprehensive requirements and constraints alongside a monospaced code editor with TypeScript/Python toggles.*

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│             [ Screenshot: Problem Detail & Code Workspace ]             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3. Real-Time Feedback & Multi-Dimensional Scores
*Instant deterministic checks combined with qualitative AI design critique and language badges.*

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                  [ Screenshot: Detailed Feedback View ]                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4. Attempt History & Progression
*Track score trends and review submissions across TypeScript and Python over time.*

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                 [ Screenshot: Attempt History Dashboard ]               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Core Features

- **Multi-Language Static Evaluation**:
  - Full support for both **TypeScript (`"TS"`)** and **Python (`"PY"`)** submissions without sandboxing or code execution risks.
- **Dual-Strategy Evaluation Engine**:
  - **Deterministic Static Analyzer**: Instant regex-based analysis checking class hierarchy, expected domain entity coverage, enum state representations, and separation of concerns adapted to language idioms.
  - **Qualitative AI Evaluator**: Leverages Google Gemini 3.6 / Anthropic Claude for deep analysis of SRP, coupling, extensibility, and naming conventions tailored to language conventions.
- **Fault-Tolerant Resilience (`Promise.allSettled`)**:
  - If AI APIs encounter rate limits or network issues, the platform seamlessly activates a rule-based fallback without crashing or blocking the learner.
- **Non-Blocking Fire-and-Forget Evaluation**:
  - Submissions immediately return `202 Accepted` with status `"evaluating"`. The client polls until completion, preventing long-lived hanging connections.
- **Zero-Config Database Auto-Seeding**:
  - Backend automatically detects empty database collections on startup and seeds standard LLD problems (Parking Lot, Vending Machine, Elevator System).
- **Persistent Attempt History**:
  - Learner attempts are automatically tracked in local storage and MongoDB, enabling side-by-side score comparisons and language-tagged iterations.
- **Production-Hardened Security**:
  - Helmet security headers, rate limiting (DDoS protection), payload size boundaries (`1mb`), response compression (gzip), and dynamic CORS for Vercel subdomains.

---

## Multi-Language Support (TypeScript & Python)

The platform evaluates code using language-aware static analysis:

| Evaluation Dimension | TypeScript (`"TS"`) | Python (`"PY"`) |
|---|---|---|
| **Structure & Classes** (`structurePresent`) | Validates presence of `class` or `interface` declarations. | Validates presence of `class` declarations (no `interface` required). |
| **Domain Entities** (`entityCoverage`) | Scans for expected domain entities in identifier contexts. | Scans for expected domain entities in identifier contexts. |
| **State Representation** (`statePresent`) | Checks for `enum` declarations. | Checks for `Enum`, `IntEnum`, `StrEnum` classes or `enum` module imports. |
| **Class Decomposition** (`responsibilitySpread`) | Counts distinct class declarations. | Counts distinct class declarations. |
| **AI Design Critique** (`LLMEvaluator`) | Evaluates TS interfaces, types, OOP abstractions, and design patterns. | Evaluates Pythonic design patterns (ABCs, protocols, `@property`, dataclasses, duck typing). |

---

## Curated Problem Catalog

1. **Parking Lot (`parking-lot`)**
   - Multi-level parking system supporting vehicle categorization (Car, Motorcycle, Truck), dynamic fee strategies, and spot reservation.
   - *Expected Entities*: `Vehicle`, `ParkingSpot`, `Ticket`, `ParkingLot`
2. **Vending Machine (`vending-machine`)**
   - State-driven vending machine handling item selection, inventory validation, cash/card payment handling, and change dispensing.
   - *Expected Entities*: `Item`, `Inventory`, `PaymentStrategy`, `VendingMachine`
3. **Elevator System (`elevator-system`)**
   - Multi-car elevator scheduling system managing floor pickup/destination requests, motion/door states, capacity constraints, and dispatching strategies.
   - *Expected Entities*: `Elevator`, `ElevatorController`, `Request`, `Floor`

---

## Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8 (with manual vendor chunk splitting)
- **Styling**: TailwindCSS v4
- **Routing**: React Router v7 (SPA with Vercel & Netlify rewrite fallbacks)
- **Icons**: Lucide React / SVG Design System

### Backend
- **Runtime**: Node.js v20+ / TypeScript
- **Framework**: Express 4
- **Database & ODM**: MongoDB with Mongoose 8
- **AI Integrations**:
  - `@google/genai` (Google Gemini 3.6 Flash)
  - `@anthropic-ai/sdk` (Claude 3.5 / Sonnet)
- **Security & Performance**:
  - `helmet` (HTTP security headers)
  - `express-rate-limit` (API rate limiting)
  - `compression` (Gzip/Deflate compression)
  - `cors` (Dynamic origin matching)

### Testing & Quality
- **Test Runner**: Jest + `ts-jest`
- **Integration Testing**: Supertest + `mongodb-memory-server`
- **Static Analysis**: TypeScript (`tsc --noEmit`)

---

## System Architecture & Design Patterns

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             React 19 Frontend                               │
│                         (https://llm-nu-six.vercel.app)                     │
└───────────────┬─────────────────────────────────────────────▲───────────────┘
  1. POST Code  │                                             │ 4. Poll Status
  (TS / Python) │                                             │ (GET /api/attempts/:id)
 (202 Accepted) │                                             │
                ▼                                             │
┌───────────────────────────────┐                             │
│       Express API Router      │                             │
└───────────────┬───────────────┘                             │
                │                                             │
                ▼                                             │
┌───────────────────────────────┐     Saves status:           │
│        AttemptService         │───► "evaluating"            │
└───────────────┬───────────────┘     in MongoDB              │
                │                                             │
                │ (Background Fire-and-Forget)                │
                ▼                                             │
┌───────────────────────────────┐                             │
│       FeedbackAssembler       │                             │
│      (Promise.allSettled)     │                             │
└───────┬───────────────┬───────┘                             │
        │               │                                     │
        ▼               ▼                                     │
┌──────────────┐ ┌──────────────┐                             │
│Deterministic │ │     LLM      │                             │
│  Evaluator   │ │  Evaluator   │                             │
│ (Language-   │ │ (Language-   │                             │
│    Aware)    │ │    Aware)    │                             │
└───────┬──────┘ └──────┬───────┘                             │
        │               │                                     │
        └───────┬───────┘                                     │
                ▼                                             │
    Assembled Feedback Object                                 │
                │                                             │
                ▼                                             │
┌───────────────────────────────┐     Persists feedback &     │
│       Attempt Document        │───► status: "completed" ────┘
│          in MongoDB           │     (or "failed")
└───────────────────────────────┘
```

### Key Architectural Patterns
1. **Strategy Pattern**: Both `DeterministicEvaluator` and `LLMEvaluator` implement a shared `Evaluator` interface, making it trivial to add new language rules or alternative LLM providers.
2. **Failure Isolation**: `FeedbackAssembler` wraps evaluators in `Promise.allSettled()`. Evaluator crashes or timeouts never cascade into server errors.
3. **Embedded Subdocument Design**: Submissions and feedback are persisted directly within `Attempt` documents for atomic writes and single-query reads.

---

## Evaluation Engine

### 1. Deterministic Static Checks (`DeterministicEvaluator`)
| Dimension | Score Range | Description |
|---|---|---|
| `structurePresent` | `0` or `1` | Verifies presence of `class`/`interface` (TS) or `class` (Python) declarations |
| `entityCoverage` | `0.0` - `1.0` | Identifies coverage of problem's expected domain entities with found/missing lists |
| `statePresent` | `0` or `1` | Checks for `enum` (TS) or `Enum` class/import (Python) |
| `responsibilitySpread` | `0.0` - `1.0` | Scores separation of concerns across multiple class abstractions |

### 2. Qualitative AI Checks (`LLMEvaluator`)
| Dimension | Score Range | Description |
|---|---|---|
| `srp` | `0.0` - `1.0` | Single Responsibility Principle adherence & critique |
| `coupling` | `0.0` - `1.0` | Coupling, cohesion, and abstraction depth |
| `extensibility` | `0.0` - `1.0` | Open/Closed Principle compliance (ease of adding new strategies/handlers) |
| `naming` | `0.0` - `1.0` | Domain-appropriate terminology and clarity |

---

## Project Directory Structure

```
.
├── client/                     # React 19 Frontend
│   ├── src/
│   │   ├── api/client.ts       # Typed API client with language payload support
│   │   ├── components/         # Shared Nav, ErrorBoundary, LoadingState, ErrorState
│   │   ├── pages/              # LandingPage, ProblemList, ProblemDetail, AttemptResult, AttemptHistory
│   │   ├── lib/learner.ts      # Anonymous learner ID management
│   │   ├── types.ts            # Shared TypeScript domain interfaces (TS | PY)
│   │   └── main.tsx            # Application entrypoint & Router setup
│   ├── vercel.json             # Vercel SPA routing rewrite configuration
│   ├── vite.config.ts          # Vite configuration with vendor chunk splitting
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/             # Environment, Database & Dynamic CORS configuration
│   │   ├── evaluators/         # Evaluator Strategy (Deterministic & LLM Evaluators)
│   │   ├── middlewares/        # Centralized ErrorHandler & 404 handler
│   │   ├── models/             # Problem and Attempt Mongoose schemas
│   │   ├── routes/             # Health, Problems, and Attempts API routes
│   │   ├── seed/               # Problem definitions (Parking Lot, Vending Machine, Elevator System)
│   │   ├── services/           # FeedbackAssembler & AttemptService lifecycle
│   │   ├── __tests__/          # Unit and integration test suites (18 tests)
│   │   ├── app.ts              # Express application configuration
│   │   └── server.ts           # HTTP server startup & graceful shutdown
│   ├── jest.config.js          # Jest configuration for TypeScript
│   ├── tsconfig.json           # Development & test TypeScript config
│   ├── tsconfig.build.json     # Production build config (excludes tests)
│   └── package.json
│
└── README.md
```

---

## Local Development & Setup

### Prerequisites
- **Node.js** v20+
- **MongoDB** running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI

---

### 1. Clone the Repository
```bash
git clone https://github.com/Shivam000189/LLDASSIGMENT.git
cd LLDASSIGMENT
```

---

### 2. Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create local environment configuration
cp .env.example .env
```

Configure your `server/.env` file:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/lld_assignment
CORS_ORIGIN=*

# Free Google Gemini API Key (https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
```

Seed the database and start the backend:
```bash
# Seed initial problems (Parking Lot, Vending Machine, Elevator System)
npm run seed

# Start server in development mode (hot-reload)
npm run dev
```
*Backend runs on `http://localhost:5000` (Health check at `http://localhost:5000/api/health`).*

---

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client

# Install dependencies
npm install

# Create frontend environment configuration
cp .env.example .env
```

Ensure `client/.env` points to the backend:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## Running Tests

The backend includes a comprehensive test suite powered by Jest and `mongodb-memory-server` (runs completely in-memory, requiring no external database or network calls):

```bash
cd server
npm test
```

### Test Suite Breakdown:
1. **`DeterministicEvaluator.test.ts`**: Verifies TypeScript and Python entity extraction, class counting, enum detection, empty inputs, and malformed code resilience.
2. **`FeedbackAssembler.test.ts`**: Verifies dual evaluation combination, LLM error fallback behavior, and crash isolation via `Promise.allSettled`.
3. **`attempts.test.ts`**: Integration tests testing the immediate `202 Accepted` response for both TS and PY submissions, language validation (`400 Bad Request` on invalid/missing language), input validation (400/404), and polling completion.

---

## Production Deployment

### Backend (e.g. Render / Railway / VPS / PM2)
```bash
cd server

# 1. Install production dependencies
npm ci

# 2. Compile TypeScript to dist/
npm run build

# 3. Start the production server
npm start
```

*Or with PM2:*
```bash
npm run build
pm2 start dist/server.js --name "lld-backend" -i max
```

### Frontend (e.g. Vercel / Netlify / Cloudflare Pages)
```bash
cd client

# 1. Build optimized SPA assets
npm run build

# Output is generated in client/dist/
```

---

## Environment Variables

### Backend (`server/.env`)
| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Port for the Express server |
| `NODE_ENV` | No | `development` | Environment mode (`development` / `production` / `test`) |
| `MONGO_URI` | Yes | `mongodb://127.0.0.1:27017/lld_assignment` | MongoDB connection URI |
| `CORS_ORIGIN` | No | `*` | Allowed CORS origin(s), comma-separated in production |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limiting window (15 mins) |
| `RATE_LIMIT_MAX` | No | `300` | Max requests allowed per window per IP |
| `GEMINI_API_KEY` | Optional | `""` | Google Gemini API Key from Google AI Studio |
| `GEMINI_MODEL` | No | `gemini-3.6-flash` | Gemini model version |
| `ANTHROPIC_API_KEY` | Optional | `""` | Anthropic API key (fallback activates if omitted) |
| `ANTHROPIC_MODEL` | No | `claude-sonnet-5` | Anthropic model version |

### Frontend (`client/.env`)
| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | Yes | `http://localhost:5000/api` | Backend API base endpoint |

---

## API Reference

### Health Check
`GET /api/health`
```json
{
  "status": "ok",
  "environment": "production",
  "uptimeSeconds": 360,
  "database": {
    "provider": "mongodb",
    "status": "connected",
    "connected": true
  },
  "memory": {
    "rssMb": "42.15",
    "heapUsedMb": "23.40"
  }
}
```

### Problems
- `GET /api/problems` — List all practice problems.
- `GET /api/problems/:id` — Get specific problem description, requirements, and constraints.

### Attempts
- `POST /api/attempts` — Submit solution for async evaluation (Returns `202 Accepted`).
  ```json
  {
    "problemId": "parking-lot",
    "learnerId": "learner_123",
    "language": "TS",
    "code": "export class Vehicle {} export class ParkingLot {}"
  }
  ```
  *(Supported `language` values: `"TS"`, `"PY"`)*

- `GET /api/attempts/:id` — Retrieve attempt status (`evaluating`, `completed`, `failed`) and feedback.
- `GET /api/attempts?problemId=parking-lot&learnerId=learner_123` — Query past attempt history sorted by date descending.

---

## 📄 License
ISC License © 2026 Shivam.
