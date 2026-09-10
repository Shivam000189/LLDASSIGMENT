# Low-Level Design (LLD) Practice Platform — Backend

A modern, robust backend service for practicing and evaluating Object-Oriented Low-Level Design (LLD) problems in TypeScript. Built with **Node.js, Express, TypeScript, and MongoDB (Mongoose)** with integration for deterministic static analysis and AI-assisted qualitative evaluation (Anthropic Claude).

---

## Table of Contents
- [Overview](#overview)
- [Architecture & Design Principles](#architecture--design-principles)
- [Core End-to-End Flow](#core-end-to-end-flow)
- [Project Directory Structure](#project-directory-structure)
- [Data Models & Schema](#data-models--schema)
- [Evaluation Strategy](#evaluation-strategy)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Scripts Reference](#scripts-reference)
- [Environment Variables](#environment-variables)

---

## Overview

Unlike algorithmic platforms (e.g. LeetCode) where correctness is binary, Low-Level Design requires evaluating design trade-offs across multiple qualitative and structural dimensions:
- **Class decomposition & Single Responsibility Principle (SRP)**
- **Coupling & Cohesion**
- **Abstraction & Interface usage**
- **Extensibility & Open/Closed Principle**
- **Naming conventions & Domain entity coverage**

This platform provides an automated **Submit → Non-blocking Evaluation → Actionable Feedback → Retry** practice loop.

---

## Architecture & Design Principles

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Client / Frontend                               │
└───────────────┬─────────────────────────────────────────────▲───────────────┘
  1. POST Code  │                                             │ 4. Poll Status
 (202 Accepted) │                                             │ (GET /attempts/:id)
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
│ (Structural) │ │ (Qualitative)│                             │
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

1. **Strategy Pattern for Evaluators**: All evaluation components implement a common `Evaluator` interface:
   ```typescript
   export interface Evaluator {
     evaluate(submission: Submission, problem: Problem): Promise<EvaluationResult>;
   }
   ```
2. **Independent Failure Isolation**: `FeedbackAssembler` uses `Promise.allSettled()` to evaluate both static structural checks and LLM qualitative critique in parallel. If the LLM call fails or times out, the system automatically falls back to deterministic-only feedback with clear fallback messaging.
3. **Non-blocking Asynchronous Polling Model**: `POST /api/attempts` immediately validates inputs, creates a database record with `status: "evaluating"`, and returns `202 Accepted`. Evaluation continues in the background, allowing clients to poll `GET /api/attempts/:id` without long-hanging HTTP connections.
4. **Embedded Subdocument Design**: `Submission` and `Feedback` are stored as embedded subdocuments inside `Attempt` documents because they are always queried and displayed together with their parent attempt.

---

## Project Directory Structure

```
server/
├── package.json               # Dependencies and scripts (dev, build, seed, typecheck)
├── tsconfig.json              # Strict ES2022 TypeScript configuration
├── .env                       # Local environment secrets & config
├── .env.example               # Example configuration template
├── .gitignore
└── src/
    ├── types.ts               # Core shared domain types & interfaces
    ├── app.ts                 # Express application setup, middleware, and route mounting
    ├── server.ts              # Database connection bootstrap and HTTP server listener
    │
    ├── config/
    │   ├── env.ts             # Strongly-typed environment variables
    │   └── db.ts              # MongoDB Mongoose connection and event listeners
    │
    ├── models/
    │   ├── Problem.ts         # Problem Mongoose model
    │   ├── Attempt.ts         # Attempt Mongoose model (embedded subdocuments)
    │   └── index.ts           # Model exports
    │
    ├── evaluators/
    │   ├── Evaluator.ts       # Evaluator interface contract
    │   ├── DeterministicEvaluator.ts # Static regex-based structural analysis
    │   ├── LLMEvaluator.ts    # Anthropic API qualitative evaluator with 1 retry
    │   └── index.ts           # Evaluator exports
    │
    ├── services/
    │   ├── FeedbackAssembler.ts # Independent evaluation assembly via Promise.allSettled
    │   ├── AttemptService.ts  # Attempt creation, async evaluation, and history queries
    │   └── index.ts           # Service exports
    │
    ├── routes/
    │   ├── health.ts          # GET /api/health (System and DB status)
    │   ├── problems.ts        # GET /api/problems, GET /api/problems/:id
    │   ├── attempts.ts        # POST /api/attempts, GET /api/attempts/:id, GET /api/attempts
    │   └── index.ts           # Root API router
    │
    ├── seed/
    │   ├── problems.ts        # Seed data for "Parking Lot" and "Vending Machine"
    │   ├── run.ts             # Idempotent upsert seeding script
    │   └── index.ts           # Seed exports
    │
    └── middlewares/
        ├── errorHandler.ts    # Centralized global error handling middleware
        └── notFound.ts        # 404 Route Not Found middleware
```

---

## Data Models & Schema

### 1. `Problem`
Represents an LLD practice problem stored in MongoDB's `problems` collection:
- `_id` (`String`): Problem ID (e.g. `"parking-lot"`, `"vending-machine"`)
- `title` (`String`): Problem title
- `requirements` (`String[]`): List of functional requirements
- `constraints` (`String[]`): Architectural and design constraints
- `expectedEntities` (`String[]`): Core domain entities expected in the design (hidden from learners in API responses)

### 2. `Attempt`
Represents a learner's submission and evaluation lifecycle in the `attempts` collection:
- `_id` (`ObjectId`): Unique attempt identifier
- `problemId` (`String`): Reference to the problem
- `learnerId` (`String`): Identifier for the user/learner
- `status` (`"evaluating" | "completed" | "failed"`): Current lifecycle status
- `submission` (Embedded Subdocument):
  - `code` (`String`): Submitted TypeScript code
  - `language` (`"TS"`): Fixed literal type
  - `submittedAt` (`Date`): Timestamp
- `feedback` (Embedded Subdocument, optional during evaluation):
  - `deterministic` (`EvaluationResult`): Structural check dimensions
  - `llm` (`EvaluationResult | null`): Qualitative LLM scores or null
  - `usedFallback` (`Boolean`): Flag indicating if AI evaluation was unavailable
  - `overallNotes` (`String`): Summary feedback note
- `createdAt` / `updatedAt` (`Date`): Timestamps (indexed for descending history queries)

---

## Evaluation Strategy

### 1. Deterministic Evaluation (`DeterministicEvaluator`)
Performs static checks on `submission.code`:
- **`structurePresent`** (score: `0` or `1`): Verifies presence of `class` or `interface` keywords.
- **`entityCoverage`** (score: `0.0` - `1.0`): Calculates fraction of `expectedEntities` identified in code with detailed found/missing lists.
- **`statePresent`** (score: `0` or `1`): Checks for `enum` declarations for state/type modeling.
- **`responsibilitySpread`** (score: `0.0` - `1.0`): Evaluates class count and decomposition (capped at 3+ classes).

### 2. LLM Evaluation (`LLMEvaluator`)
Interacts with the Anthropic Claude API (`@anthropic-ai/sdk`) using a strict JSON-only schema:
- **`srp`**: Single Responsibility Principle score (`0.0` - `1.0`) & actionable critique.
- **`coupling`**: Coupling, cohesion, and abstraction score & critique.
- **`extensibility`**: Open/Closed principle & extension points score.
- **`naming`**: Domain nomenclature and readability score.
- **Resilience**: Retries once on API/parse failure before throwing to `FeedbackAssembler` to activate fallback.

---

## API Reference

### Health Check
#### `GET /api/health`
Returns the operational status of the server and database.

**Response (`200 OK`):**
```json
{
  "status": "ok",
  "timestamp": "2026-09-10T08:30:00.000Z",
  "uptime": 124.5,
  "database": {
    "provider": "mongodb",
    "status": "connected",
    "host": "127.0.0.1"
  }
}
```

---

### Problems API

#### `GET /api/problems`
List all seeded practice problems (omits internal `expectedEntities`).

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "parking-lot",
      "title": "Parking Lot",
      "requirements": [
        "Support multiple vehicle types...",
        "Manage limited parking spots...",
        "Issue parking tickets..."
      ],
      "constraints": [
        "Clean separation of concerns..."
      ],
      "createdAt": "2026-09-10T08:00:00.000Z",
      "updatedAt": "2026-09-10T08:00:00.000Z"
    }
  ]
}
```

#### `GET /api/problems/:id`
Get single problem details by ID (`parking-lot` or `vending-machine`).

---

### Attempts API

#### `POST /api/attempts`
Submit a TypeScript solution for evaluation. Returns `202 Accepted` immediately with status `"evaluating"`.

**Request Body:**
```json
{
  "problemId": "parking-lot",
  "learnerId": "learner-123",
  "code": "export enum VehicleType { MOTORCYCLE, CAR } export class Vehicle { constructor(public type: VehicleType) {} } export class ParkingSpot {} export class Ticket {} export class ParkingLot {}"
}
```

**Response (`202 Accepted`):**
```json
{
  "success": true,
  "data": {
    "id": "66dfd52a78f149b01a234567",
    "problemId": "parking-lot",
    "learnerId": "learner-123",
    "status": "evaluating",
    "submission": {
      "code": "export enum VehicleType ...",
      "language": "TS",
      "submittedAt": "2026-09-10T08:35:00.000Z"
    },
    "createdAt": "2026-09-10T08:35:00.000Z",
    "updatedAt": "2026-09-10T08:35:00.000Z"
  }
}
```

---

#### `GET /api/attempts/:id`
Poll the attempt status and retrieve evaluation results.

**Response when completed (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "66dfd52a78f149b01a234567",
    "problemId": "parking-lot",
    "learnerId": "learner-123",
    "status": "completed",
    "submission": {
      "code": "export enum VehicleType ...",
      "language": "TS",
      "submittedAt": "2026-09-10T08:35:00.000Z"
    },
    "feedback": {
      "deterministic": {
        "source": "deterministic",
        "dimensions": {
          "structurePresent": {
            "score": 1,
            "explanation": "Found class or interface declarations in submission."
          },
          "entityCoverage": {
            "score": 1,
            "explanation": "Identified 4/4 expected entities. Found: [Vehicle, ParkingSpot, Ticket, ParkingLot]. Missing: []."
          },
          "statePresent": {
            "score": 1,
            "explanation": "Found enum definition(s) representing domain states/types."
          },
          "responsibilitySpread": {
            "score": 1,
            "explanation": "Identified 4 class definition(s) in the submitted code."
          }
        }
      },
      "llm": {
        "source": "llm",
        "dimensions": {
          "srp": { "score": 0.85, "explanation": "Classes maintain focused responsibilities." },
          "coupling": { "score": 0.8, "explanation": "Good cohesion between entities." },
          "extensibility": { "score": 0.9, "explanation": "Pricing strategies can be added easily." },
          "naming": { "score": 0.9, "explanation": "Clear and idiomatic domain names." }
        }
      },
      "usedFallback": false,
      "overallNotes": "Combined deterministic and AI-assisted feedback."
    },
    "createdAt": "2026-09-10T08:35:00.000Z",
    "updatedAt": "2026-09-10T08:35:02.000Z"
  }
}
```

---

#### `GET /api/attempts?problemId=X&learnerId=Y`
Retrieve all previous attempts for a learner on a given problem, sorted by `createdAt` descending.

**Response (`200 OK`):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "66dfd52a78f149b01a234568",
      "problemId": "parking-lot",
      "learnerId": "learner-123",
      "status": "evaluating",
      "submission": {
        "code": "export class ParkingLot { /* revised design */ }",
        "language": "TS",
        "submittedAt": "2026-09-10T08:45:00.000Z"
      },
      "createdAt": "2026-09-10T08:45:00.000Z",
      "updatedAt": "2026-09-10T08:45:00.000Z"
    },
    {
      "id": "66dfd52a78f149b01a234567",
      "problemId": "parking-lot",
      "learnerId": "learner-123",
      "status": "completed",
      "submission": {
        "code": "export class Vehicle {} export class ParkingLot {}",
        "language": "TS",
        "submittedAt": "2026-09-10T08:35:00.000Z"
      },
      "feedback": {
        "deterministic": {
          "source": "deterministic",
          "dimensions": {
            "structurePresent": {
              "score": 1,
              "explanation": "Found class or interface declarations in submission."
            },
            "entityCoverage": {
              "score": 0.5,
              "explanation": "Identified 2/4 expected entities. Found: [Vehicle, ParkingLot]. Missing: [ParkingSpot, Ticket]."
            },
            "statePresent": {
              "score": 0,
              "explanation": "No enum definitions found."
            },
            "responsibilitySpread": {
              "score": 0.67,
              "explanation": "Identified 2 class definition(s) in the submitted code."
            }
          }
        },
        "llm": {
          "source": "llm",
          "dimensions": {
            "srp": { "score": 0.75, "explanation": "Basic class structure present but responsibilities are concentrated." },
            "coupling": { "score": 0.7, "explanation": "Introduce abstractions for spot allocation and ticketing." },
            "extensibility": { "score": 0.65, "explanation": "Consider Strategy pattern for fee calculations." },
            "naming": { "score": 0.85, "explanation": "Domain names are clear and idiomatic." }
          }
        },
        "usedFallback": false,
        "overallNotes": "Combined deterministic and AI-assisted feedback."
      },
      "createdAt": "2026-09-10T08:35:00.000Z",
      "updatedAt": "2026-09-10T08:35:02.000Z"
    }
  ]
}
```

---

## Getting Started

### Prerequisites
- **Node.js** v18+ (tested on Node v22)
- **MongoDB** running locally on port `27017` or a MongoDB Atlas URI

### Installation & Run

1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/lld_assignment
   CORS_ORIGIN=*
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ANTHROPIC_MODEL=claude-sonnet-5
   ```

4. Seed the database with predefined problems:
   ```bash
   npm run seed
   ```

5. Start the development server with hot-reloading:
   ```bash
   npm run dev
   ```

The server will be running on `http://localhost:5000`.

---

## Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Runs the server in development mode using `tsx watch` |
| `npm run build` | Compiles TypeScript source to production JavaScript in `dist/` |
| `npm start` | Runs the compiled server from `dist/server.js` |
| `npm test` | Runs the full Jest test suite with in-memory MongoDB |
| `npm run typecheck` | Validates TypeScript types across the project (`tsc --noEmit`) |
| `npm run seed` | Seeds/upserts the predefined problems into MongoDB |

---

## Production Deployment

### 1. Build and Run Directly with Node.js
```bash
# 1. Install dependencies
npm ci

# 2. Build the TypeScript source to dist/
npm run build

# 3. Start the production server
npm start
```

### 2. Running with a Process Manager (e.g. PM2)
```bash
# Install PM2 globally if needed
npm install -g pm2

# Build and start the cluster
npm run build
pm2 start dist/server.js --name "lld-backend" -i max
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Port for the Express server |
| `NODE_ENV` | No | `development` | Environment mode (`development` / `production` / `test`) |
| `MONGO_URI` | Yes | `mongodb://127.0.0.1:27017/lld_assignment` | MongoDB connection URI |
| `CORS_ORIGIN` | No | `*` | Allowed CORS origin(s), comma-separated in production |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limiting window in milliseconds (15 mins) |
| `RATE_LIMIT_MAX` | No | `300` | Max requests allowed per window per IP |
| `GEMINI_API_KEY` | Optional | `""` | Free Google Gemini API key from AI Studio |
| `GEMINI_MODEL` | No | `gemini-3.6-flash` | Gemini model version |
| `ANTHROPIC_API_KEY` | Optional | `""` | Anthropic API key (fallback activates if omitted) |
| `ANTHROPIC_MODEL` | No | `claude-sonnet-5` | Anthropic model version to use |

