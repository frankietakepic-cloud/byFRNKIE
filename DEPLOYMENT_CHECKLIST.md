# Production Deployment Checklist
## L'Officina Creative Operating System v3.0

This checklist must be executed prior to promoting any Release Candidate to live production servers (Vercel, Railway, Cloud Run, Custom Domain `byfrnk.com`).

---

## 1. Environment & Secrets Verification

- [x] **OFFICINA_PASSCODE**: Passkey secret configured in environment variables.
- [x] **NODE_ENV**: Set to `production` in live container runtime.
- [x] **GEMINI_API_KEY**: Configured for AI Editorial Assistant.
- [x] **PORT**: Default set to `3000` behind reverse proxy.

---

## 2. File System & Storage Prerequisites

- [x] Data directory (`/data`) exists and is writable.
- [x] Uploads directory (`/public/uploads`) exists with required sub-partition directories:
  - `/public/uploads/tmp`
  - `/public/uploads/originals`
  - `/public/uploads/web`
  - `/public/uploads/thumbs`
- [x] Initial seed JSON files present (`photos.json`, `journals.json`, `projects.json`, `pages.json`, `hero_config.json`).

---

## 3. Server Endpoints & Health Check Audit

- [x] `GET /api/health`: Returns HTTP 200 with memory usage, storage writeability, and Sharp status.
- [x] `GET /api/version`: Returns HTTP 200 with commit hash and version metadata.
- [x] `GET /api/ready`: Returns HTTP 200 when storage layers are online.
- [x] `POST /api/officina/auth`: Verifies passcode and issues bearer token.
- [x] `POST /api/photos`: Handles binary file uploads with SHA-256 duplicate detection and Sharp WebP conversion.

---

## 4. Security & Boundary Checks

- [x] **CORS Configuration**: Restricts credentials and methods to authorized domain origins (`byfrnk.com`, `www.byfrnk.com`).
- [x] **Path Traversal Protection**: Upload delete and file access routines sanitize paths relative to `UPLOADS_DIR`.
- [x] **Payload Size Limits**: Multi-file streaming limited to 500MB per file; JSON payload limited to 50MB.

---

## 5. Verification Sign-Off

- [x] **Level 1 Verification**: TypeScript check (`tsc --noEmit`) clean with 0 errors.
- [x] **Level 1 Verification**: Production build (`vite build && esbuild server.ts`) completes successfully.
- [x] **Level 2 Verification**: Application boots cleanly in Cloud Run sandbox environment.
- [ ] **Level 3 Verification**: GitHub push & automated CI/CD deployment to Railway / Vercel.
- [ ] **Level 4 Verification**: Live production domain validation on `https://byfrnk.com`.
