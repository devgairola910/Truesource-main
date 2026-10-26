# TrueSource Backend Guide

This document describes the backend APIs implemented for the MVP.

## Architecture

- Runtime: Next.js App Router route handlers in `app/api`.
- Data store: Cloud Firestore managed via Firebase Admin SDK in `lib/backend/store.ts`.
- Object storage: Google Cloud Storage (`official-registry` bucket) managed in `lib/gcs.ts`.
- Media processing: Steganographic watermarking & perceptual hashing in `lib/fingerprint.ts`.
- Validation: centralized helpers in `lib/backend/validators.ts`.
- HTTP helpers and auth guard: `lib/backend/http.ts` (Firebase ID Token verification).
- Contracts and domain types: `lib/backend/types.ts` and `lib/types.ts`.

## Authentication

Session model:
- Client authenticates via Firebase Authentication (Email/Password or Google OAuth).
- Authenticated requests pass Firebase ID token in `Authorization: Bearer <idToken>`.
- Server validates token via `firebase-admin` Auth in `requireAuth()`.

Endpoints:
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/session`
- `DELETE /api/auth/session`

## Domain APIs

Protected endpoints:
- `GET /api/assets` - List user's registered protected assets
- `POST /api/assets` - Register asset metadata into Firestore
- `GET /api/upload` - Generate GCS signed upload URL for direct client uploads
- `POST /api/upload` - Process buffer (embed fingerprint, generate pHash) and upload to GCS
- `POST /api/scans` - Instant leak check (extract watermark & calculate Hamming similarity)
- `POST /api/scans/run` - Autonomous crawler scan comparing public feed against protected registry
- `GET /api/candidates` - List monitored media candidate records
- `GET /api/alerts` - List detected incidents (supports `?status=` filtering)
- `GET /api/alerts/:alertId` - Get incident details with evidence signals and audit log
- `PATCH /api/alerts/:alertId` - Update incident status (new, confirmed, dismissed, whitelisted)
- `GET /api/whitelist` - List suppressed/allowlisted domains
- `POST /api/whitelist` - Add verified partner domain to allowlist
- `DELETE /api/whitelist?domain=<domain>` - Remove domain from allowlist
- `GET /api/kpis` - Fetch core operational KPI metrics
- `GET /api/dashboard` - Unified dashboard snapshot (metrics, asset breakdown, recent alerts)
- `GET /api/analytics` - Aggregated detection trends, precision rate, and top infringing sources
- `GET /api/team` - List workspace members and role assignments
- `GET /api/contact` - Retrieve contact inquiries (authenticated)

Public endpoint:
- `POST /api/contact` - Submit contact inquiry

Health endpoint:
- `GET /api/health` - Health check status

## Notes

- Primary database: Google Cloud Firestore collections (`assets`, `alerts`, `users`, `whitelist`, `kpis`, `contact_inquiries`, `sessions`).
- Media storage: Google Cloud Storage bucket (`official-registry`).
- Automated background crawler: Simulated via `/api/scans/run`, suitable for deployment as a scheduled Cloud Run Job or Google Cloud Function via Cloud Scheduler.
