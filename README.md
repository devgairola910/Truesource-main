# TrueSource — SportShield AI

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore_%26_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Google Cloud](https://img.shields.io/badge/Google_Cloud-Storage-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Sharp](https://img.shields.io/badge/Sharp-Perceptual_Hashing-99CC00?style=for-the-badge&logo=sharp&logoColor=white)

**Cloud-native digital media rights protection, provenance tracking, and leak detection platform for sports leagues, broadcasters, and content owners.**

[Key Features](#key-features) • [Architecture](#system-architecture) • [Project Structure](#project-structure) • [Setup Guide](#setup-guide) • [User Workflows](#end-to-end-user-workflows) • [API Reference](#api-reference) • [Troubleshooting](#troubleshooting)

</div>

---

## Overview

Sports organizations and content publishers distribute high-value media across broadcast and digital channels. Once assets are clipped, compressed, cropped, or reposted, manual enforcement becomes slow, costly, and ineffective. 

**TrueSource (SportShield AI)** provides an operational content integrity platform that:
1. **Registers & Protects Official Assets**: Ingests high-resolution images and videos into a canonical registry and computes resilient fingerprints.
2. **Embeds Hidden Provenance**: Uses Blue-channel Least Significant Bit (LSB) steganography (`TS-<ID>`) for invisible watermarking alongside 64-bit perceptual hashes (`aHash`).
3. **Monitors Public Internet Surfaces**: Continuously ingests candidate feeds (e.g. social and public web streams) and evaluates visual similarity using Hamming distance calculations.
4. **Empowers Reviewers with Explainable Evidence**: Surfaces actionable incident alerts with similarity scores, provenance payloads, and side-by-side evidence inspection.
5. **Suppresses Noise with Whitelisting**: Allows rights managers to whitelist verified syndication partners and authorized broadcaster domains to eliminate false positives.

---

## Key Features

- **🛡️ Canonical Media Registry**: Upload and catalog images and videos with rights owner attribution, distribution channel tags, and direct resumable cloud uploads.
- **🔬 Dual-Layer Fingerprinting Pipeline**:
  - *Steganographic Watermarking*: Embeds and extracts invisible attribution payloads (`TS-<ID>`) into pixel data without visual distortion.
  - *Perceptual Hashing (aHash)*: Computes 64-bit perceptual hashes via Sharp, resilient against compression, resizing, and minor modifications.
- **🔍 Dual Scanning Engines**:
  - *Instant Leak Check*: Direct manual verification where users drag-and-drop suspect files to test for watermarks and perceptual similarity against the entire registry.
  - *Autonomous Web Crawler*: Cloud worker engine crawling public internet feeds (e.g. Reddit public feeds), extracting hashes, and automatically generating alerts when Hamming distance $\le 10$ bits (confidence $\ge 80\%$).
- **⚖️ Incident Review & Triage Workspace**:
  - Real-time queue filtered by severity (`critical`, `high`, `medium`) and status (`new`, `confirmed`, `dismissed`, `whitelisted`).
  - Side-by-side comparison, signal breakdown, and full audit logging of reviewer actions.
  - One-click actions to confirm piracy, dismiss false positives, or suppress future alerts by allowlisting the source domain.
- **🌐 Domain Whitelist Management**: Centralized allowlist to prevent alert fatigue from legitimate distribution partners, sponsors, and official affiliates.
- **📊 Operational Telemetry & Analytics**: Real-time KPI dashboards tracking Open Alerts, Confirmed Incidents, Precision Rates, and Protected Volume, with CSV export capabilities for compliance reporting.
- **👥 Enterprise Role-Based Access Control (RBAC)**: Team administration supporting Admin, Reviewer, Analyst, and Viewer roles.
- **🔐 Enterprise Authentication**: Firebase Authentication supporting Google OAuth and Email/Password credentials with Firebase ID token verification.

---

## System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client (Next.js 16 App Router)"]
        UI["Modern Web Interface\n(Dashboard, Scans, Registry, Triage)"]
        AuthClient["Firebase Auth Client\n(Google OAuth / Email)"]
    end

    subgraph API ["Next.js Server API Layer (app/api)"]
        AuthGuard["requireAuth Middleware\n(Firebase ID Token Verification)"]
        UploadRoute["Upload Handler\n(Direct / Signed GCS URLs)"]
        ScanEngine["Scan Engine\n(Instant Check & Autonomous Crawler)"]
        AlertService["Incident & Alert Service"]
        WhitelistService["Domain Whitelist Manager"]
    end

    subgraph Processing ["Media Processing Engine (lib/fingerprint.ts)"]
        SharpEngine["Sharp Image Engine"]
        LSB["LSB Steganography\n(Embed / Extract 'TS-' Payloads)"]
        PHash["64-bit Perceptual Hash\n(aHash + Hamming Distance)"]
    end

    subgraph Storage ["Cloud Infrastructure (Google Cloud & Firebase)"]
        Firestore[("Cloud Firestore\n(Users, Assets, Alerts, Whitelist, KPIs)")]
        GCS[("Google Cloud Storage\n('official-registry' Bucket)")]
        ExtFeed["Public Web / Social Stream\n(e.g., Reddit Public API)"]
    end

    %% Data Flow
    UI --> AuthClient
    AuthClient --> AuthGuard
    UI --> AuthGuard

    AuthGuard --> UploadRoute
    AuthGuard --> ScanEngine
    AuthGuard --> AlertService
    AuthGuard --> WhitelistService

    UploadRoute --> SharpEngine
    ScanEngine --> SharpEngine
    SharpEngine --> LSB
    SharpEngine --> PHash

    UploadRoute --> GCS
    UploadRoute --> Firestore
    ScanEngine --> ExtFeed
    ScanEngine --> Firestore
    AlertService --> Firestore
    WhitelistService --> Firestore
```

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with custom design tokens |
| **Media Processing** | [Sharp 0.34](https://sharp.pixelplumbing.com/) (Perceptual Hashing, Steganography) |
| **Database** | [Google Cloud Firestore](https://firebase.google.com/docs/firestore) |
| **Object Storage** | [Google Cloud Storage](https://cloud.google.com/storage) (`@google-cloud/storage`) |
| **Authentication** | [Firebase Authentication](https://firebase.google.com/docs/auth) & Firebase Admin SDK |
| **Analytics & Telemetry** | [@vercel/analytics](https://vercel.com/analytics) & Custom KPI Engine |

---

## Project Structure

```text
Truesource-main/
├── app/                                 # Next.js App Router
│   ├── api/                             # Backend API Routes
│   │   ├── alerts/                      # Incident alerts (/api/alerts & /api/alerts/[alertId])
│   │   ├── analytics/                   # Aggregated detection metrics & chart telemetry
│   │   ├── assets/                      # Protected asset catalog operations
│   │   ├── auth/                        # Session management & user registration
│   │   ├── candidates/                  # Monitored candidates feed
│   │   ├── contact/                     # Public contact inquiries handler
│   │   ├── dashboard/                   # Unified dashboard overview snapshot
│   │   ├── health/                      # Health check endpoint
│   │   ├── kpis/                        # High-level operational KPI data
│   │   ├── scans/                       # Instant manual leak scanner
│   │   │   └── run/                     # Autonomous web crawler job
│   │   ├── team/                        # Team member directory and roles
│   │   ├── upload/                      # File upload handler & signed URL generator
│   │   └── whitelist/                   # Domain suppression allowlist
│   ├── dashboard/                       # Authenticated Dashboard Views
│   │   ├── analytics/                   # Performance charts & top infringing sources
│   │   ├── assets/                      # Media registry table & upload modal
│   │   ├── incidents/                   # Incident queue & deep review workspace ([id])
│   │   ├── integrations/                # Connected cloud services (Vision, BigQuery, GCS)
│   │   ├── reports/                     # Audit & compliance report generation (CSV export)
│   │   ├── scans/                       # Scanner hub (leak-check & autonomous crawler)
│   │   ├── settings/                    # Org settings, notifications, security & allowlist
│   │   └── team/                        # Team invitations & RBAC management
│   ├── (auth)/                          # Authentication Pages (login, signup, forgot-password)
│   ├── (marketing)/                     # Public Pages (landing, about, services, blog, contact)
│   ├── globals.css                      # Global design system variables & Tailwind styles
│   └── layout.tsx                       # Root HTML shell with font & analytics injection
├── components/                          # Modular React Components
│   ├── analytics/                       # KPI grids and metric visualizations
│   ├── auth/                            # Login, Signup, and auth tracker components
│   ├── governance/                      # Whitelist management interfaces
│   ├── layout/                          # AppShell, Topbar, Sidebar, Header, Footer
│   ├── registry/                        # Asset inventory table and filters
│   ├── review/                          # Incident triage workspace & evidence cards
│   ├── scanning/                        # Candidate stream indicators
│   ├── ui/                              # Reusable UI primitives (Button, Modal, Badge, etc.)
│   └── upload/                          # Multi-file drag-and-drop uploader
├── lib/                                 # Shared Utilities & Backend Services
│   ├── backend/                         # Server-side business logic
│   │   ├── http.ts                      # requireAuth guard & standardized JSON responses
│   │   ├── store.ts                     # Firestore data layer & CRUD operations
│   │   ├── types.ts                     # Backend DTOs and contracts
│   │   └── validators.ts                # Payload normalization & input validation
│   ├── auth-client.ts                   # Client-side session persistence (localStorage sync)
│   ├── fingerprint.ts                   # LSB watermark embedding/extraction & aHash
│   ├── firebase-admin.ts                # Firebase Admin SDK initialization
│   ├── firebase.ts                      # Client Firebase SDK initialization
│   ├── gcs.ts                           # Google Cloud Storage client & signed URL generator
│   └── types.ts                         # Shared domain types (AssetRecord, AlertRecord, etc.)
├── scratch/                             # Diagnostic & verification utilities
│   ├── check-buckets.js                 # Validate GCS bucket connectivity
│   ├── diagnose-gcs.js                  # Diagnostic tool for GCS credentials & permissions
│   ├── fix-env.js                       # Helper to format multiline JSON in .env.local
│   └── test-firestore.js                # Validate Firestore credentials & collection access
├── .env.example                         # Environment configuration template
├── package.json                         # Project dependencies and npm scripts
└── tsconfig.json                        # TypeScript configuration
```

---

## Setup Guide

Follow this guide to get TrueSource running locally or deployed to staging.

### Prerequisites

1. **Node.js**: `v20.x` or `v24.x` (LTS recommended)
2. **Package Manager**: `npm` (v10+), `yarn`, or `pnpm`
3. **Google Cloud Platform (GCP) Project**:
   - Google Cloud Storage API enabled.
   - A storage bucket created (default name: `official-registry`).
4. **Firebase Project**:
   - Authentication enabled (Google Provider and Email/Password Provider).
   - Cloud Firestore Database enabled (Production or Test mode).

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/truesource.git
cd truesource
```

---

### Step 2: Install Dependencies

Install project packages using `npm`:

```bash
npm install
```

> [!NOTE]
> The project uses `sharp` for image fingerprinting. On macOS (Apple Silicon or Intel) and modern Linux distros, precompiled libvips binaries are downloaded automatically during installation.

---

### Step 3: Google Cloud & Firebase Setup

#### 1. Set Up Firebase Authentication & Firestore
1. Visit the [Firebase Console](https://console.firebase.google.com/) and create a project.
2. In **Build > Authentication**, enable:
   - **Email/Password**
   - **Google**
3. In **Build > Firestore Database**, click **Create Database** (start in Test mode for initial local development, or configure production security rules).
4. In **Project Settings > General > Your apps**, register a **Web App** and copy the `firebaseConfig` keys.

#### 2. Configure Firebase Admin Credentials
1. In **Project Settings > Service accounts**, click **Generate new private key**.
2. Download the resulting JSON file.

#### 3. Set Up Google Cloud Storage (GCS)
1. In the [Google Cloud Console](https://console.cloud.google.com/), select your project.
2. Navigate to **Cloud Storage > Buckets** and create a bucket named `official-registry` (or your preferred bucket name).
3. Ensure the service account created in the previous step has the **Storage Object Admin** and **Storage Object Viewer** IAM roles on this bucket.
4. *(Optional for client-side uploads)* Configure CORS on your GCS bucket:
   ```json
   [
     {
       "origin": ["http://localhost:3000", "https://your-domain.com"],
       "method": ["GET", "PUT", "POST", "HEAD"],
       "responseHeader": ["Content-Type", "x-goog-resumable"],
       "maxAgeSeconds": 3600
     }
   ]
   ```
   Apply it via `gcloud storage buckets update gs://official-registry --cors-file=cors.json`.

---

### Step 4: Environment Variables Configuration

Copy the sample environment file to `.env.local`:

```bash
cp .env.example .env.local
```

Open `.env.local` and populate the values:

```ini
# =====================================================================
# Firebase Client Configuration (Browser)
# =====================================================================
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-..."

# =====================================================================
# Firebase Admin SDK Service Account (Server-side)
# =====================================================================
# Paste the minified, single-line JSON wrapped in single quotes:
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project-id","private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvg...\\n-----END PRIVATE KEY-----\\n","client_email":"firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com"}'

# =====================================================================
# Google Cloud Storage Service Account (Server-side)
# =====================================================================
# Can be the same service account if it possesses Storage Object Admin rights:
GCP_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project-id","private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvg...\\n-----END PRIVATE KEY-----\\n","client_email":"truesource-storage@your-project-id.iam.gserviceaccount.com"}'

# =====================================================================
# Bucket Configuration
# =====================================================================
GCS_BUCKET_NAME="official-registry"
NODE_ENV="development"
```

> [!TIP]
> **Service Account JSON Formatting Tip:**
> Make sure the JSON string is on a **single line** and enclosed in **single quotes** (`'...'`). If your private key contains newlines, replace them with literal `\n`. If you need to fix formatting automatically, check `scratch/fix-env.js`.

---

### Step 5: Verify Connectivity with Scratch Diagnostics

Before launching the Next.js server, verify your cloud credentials:

1. **Test Firestore Connectivity**:
   ```bash
   node scratch/test-firestore.js
   ```
   *Expected output:* `Testing Firestore connectivity... Success! Found N assets.`

2. **Test GCS Bucket Connectivity**:
   ```bash
   node scratch/diagnose-gcs.js
   ```
   *Expected output:* `Bucket 'official-registry' exists: true. Connection: VERIFIED.`

---

### Step 6: Run the Development Server

Start the Next.js local server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- Check the API health status anytime at: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## End-to-End User Workflows

### 1. Register & Protect Official Media
1. Sign in or create an account via `/login` (Email/Password or Google).
2. Go to **Dashboard > Media Registry** (`/dashboard/assets`).
3. Click **Upload Asset**. Drag and drop an official image (e.g., match photo or highlight thumbnail).
4. Fill in the Rights Owner (e.g. `Premier Football League`) and Distribution Partner.
5. Click **Upload and Protect**:
   - The file is uploaded to the GCS `official-registry` bucket.
   - Sharp generates a 64-bit perceptual hash (`pHash`).
   - The invisible steganographic watermark (`TS-XXXXX`) is embedded into the blue color channel.
   - The asset record is committed to Firestore with status `protected`.

### 2. Run an Instant Leak Check
1. Go to **Dashboard > Protection Scanners** (`/dashboard/scans`).
2. Select **Instant Leak Check** (`/dashboard/scans/leak-check`).
3. Upload an unverified or suspect image found on the web.
4. Click **Run Integrity Analysis**:
   - If an invisible watermark is detected, it reports an **Exact 100% Provenance Match**.
   - If modified or re-compressed, the perceptual hash compares Hamming distance against all registered assets.
   - Shows similarity percentage, matched asset ID, and rights owner.

### 3. Run Autonomous Web Scanning
1. Go to **Dashboard > Protection Scanners > Autonomous Web Scan** (`/dashboard/scans/autonomous`).
2. Click **Start Autonomous Scan**:
   - Connects to public media streams (e.g. Reddit public feed).
   - Ingests candidates, hashes media in-memory, and calculates Hamming distance against the protected registry.
   - Automatically generates real-time incidents for high-confidence matches ($\le 10$ bits distance).

### 4. Review & Triage an Incident
1. Go to **Dashboard > Incident Queue** (`/dashboard/incidents`).
2. Select an alert with status `Needs Review`.
3. Inspect side-by-side evidence:
   - Official source asset vs. infringing candidate URL.
   - Perceptual hash similarity score and visual cue indicators.
4. Choose an action:
   - **Confirm Piracy**: Flags incident as confirmed and records audit timestamp for DMCA dispatch.
   - **Dismiss**: Closes incident as fair use or false positive.
   - **Whitelist Domain**: Automatically adds the source domain to the allowlist to suppress future noise.

---

## API Reference

All protected endpoints require an `Authorization: Bearer <FIREBASE_ID_TOKEN>` header.

### Authentication & Sessions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register user profile and credentials |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and issue session |
| `GET` | `/api/auth/session` | Bearer | Retrieve active authenticated session |
| `DELETE` | `/api/auth/session` | Bearer | Invalidate session |

### Asset Registry & Uploads
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/assets` | Bearer | List protected media assets belonging to the user |
| `POST` | `/api/assets` | Bearer | Register asset metadata in Firestore |
| `GET` | `/api/upload` | Bearer | Generate signed GCS URL for direct client upload |
| `POST` | `/api/upload` | Bearer | Upload media buffer, embed watermark & generate pHash |

### Scanning & Matching
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/scans` | Bearer | Instant leak check: extract watermark & fuzzy match pHash |
| `POST` | `/api/scans/run` | Bearer | Autonomous crawler scan across public candidate stream |
| `GET` | `/api/candidates` | Bearer | List monitored candidate records |

### Incident Triage & Governance
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/alerts` | Bearer | List incident alerts (supports `?status=<status>` filter) |
| `GET` | `/api/alerts/:alertId` | Bearer | Retrieve incident details with evidence & audit trail |
| `PATCH` | `/api/alerts/:alertId` | Bearer | Update status (`new`, `confirmed`, `dismissed`, `whitelisted`) |
| `GET` | `/api/whitelist` | Bearer | List suppressed/allowlisted partner domains |
| `POST` | `/api/whitelist` | Bearer | Add domain to suppression allowlist |
| `DELETE` | `/api/whitelist?domain=x` | Bearer | Remove domain from suppression allowlist |

### Telemetry & System
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/dashboard` | Bearer | Unified metrics snapshot for dashboard |
| `GET` | `/api/analytics` | Bearer | Aggregated detection trends, precision, and top sources |
| `GET` | `/api/kpis` | Bearer | Retrieve KPI metrics |
| `GET` | `/api/team` | Bearer | List organization team members and roles |
| `POST` | `/api/contact` | Public | Submit contact / pilot inquiry |
| `GET` | `/api/health` | Public | System health check (`status: ok`) |

---

## Troubleshooting

### 1. `Firebase Admin SDK: Failed to parse Service Account JSON`
- **Cause**: The `FIREBASE_SERVICE_ACCOUNT` string in `.env.local` contains unescaped newlines or isn't valid JSON.
- **Solution**: Wrap the entire minified JSON string in single quotes:
  ```env
  FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
  ```
  Ensure all newlines in `private_key` are written as literal `\n`. Run `node scratch/test-firestore.js` to verify.

### 2. `GCS Save Error` or `Bucket 'official-registry' does not exist`
- **Cause**: Google Cloud Storage bucket has not been created or the service account lacks IAM permissions.
- **Solution**:
  1. Create the bucket in the Google Cloud Console with the exact name configured in `GCS_BUCKET_NAME`.
  2. Grant the service account the **Storage Object Admin** role.
  3. Run `node scratch/diagnose-gcs.js` to diagnose the exact error code.

### 3. `Authorization token is invalid or missing` (401 Error)
- **Cause**: Client request did not include a valid Firebase ID token in the `Authorization: Bearer <token>` header.
- **Solution**: Ensure you are signed in via `/login`. The client automatically attaches `auth.currentUser.getIdToken()` to API calls.

### 4. `sharp` module compilation or platform binding errors
- **Cause**: Moving `node_modules` across different CPU architectures or OSes.
- **Solution**: Reinstall sharp bindings:
  ```bash
  npm rebuild sharp
  # or
  npm install --platform=darwin --arch=arm64 sharp # for Apple Silicon
  ```

---

## Available Scripts

In the project root, you can run:

| Command | Description |
|---|---|
| `npm run dev` | Runs the Next.js development server at `http://localhost:3000` |
| `npm run build` | Builds the production bundle |
| `npm run start` | Starts the production Next.js server |
| `npm run lint` | Runs ESLint over the project codebase |

---

## Security & Best Practices

- **Zero Client-Side Secrets**: Service account credentials and database keys are strictly isolated to server-side Next.js route handlers (`lib/firebase-admin.ts`, `lib/gcs.ts`).
- **Resilient Signal Layering**: Rather than relying solely on watermarking (which can be degraded by aggressive re-encoding), TrueSource layers LSB steganography with perceptual Hamming distance matching.
- **Idempotent Allowlisting**: Domain whitelisting automatically cascades to suppress repetitive candidate ingestion, protecting human reviewers from alert fatigue.
