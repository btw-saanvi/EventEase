# EventEase — Technical Decisions & Challenges

## Introduction

This document records the engineering decisions, implementation challenges, architectural trade-offs, and technical reasoning behind core components of EventEase. The technical details and rationale documented here are supported directly by the repository source code, Mongoose schemas, API route handlers, configuration files, and Git commit history.

---

## 1. Authentication and Protected API Access

### Problem
The application requires secure account management for event hosts, including email/password registration, password recovery via one-time passwords (OTP), and optional Google OAuth sign-in. Furthermore, all private event planning resources—such as events, budgets, guest lists, reviews, and saved vendors—must be shielded from unauthenticated access, improper direct object references (IDOR), and account enumeration.

### Options Considered
The repository does not record multiple architectural alternatives considered; the final implementation was a custom stateless JSON Web Token (JWT) Bearer authentication system built with Express middleware and `bcryptjs`.

Importantly, the codebase does **not** implement Role-Based Access Control (RBAC):
- The `User` Mongoose schema (`backend/models/User.js`) only defines identity and profile fields (`name`, `email`, `password`, `avatar`, `phone`, `location`, `bio`, `resetOTP`, `resetOTPExpiry`).
- There is no `role` attribute on the user model, nor are there distinct role checks (e.g., admin vs. vendor vs. user) in any route handlers or middleware.
- All authenticated users operate under a single host persona planning small-to-medium events.

### Final Approach
- **Stateless Bearer Token Authentication**:
  - `backend/middleware/auth.js` defines the `verifyToken` middleware. It extracts the Bearer token from the `Authorization` request header, verifies the signature using `jwt.verify` against `process.env.JWT_SECRET`, and populates `req.user = decoded` with `{ id, name, email }`. If `JWT_SECRET` is missing in the environment, the middleware halts request processing with a 500 server error rather than falling back to an insecure default.
- **Credential Storage & Password Recovery**:
  - Registration in `backend/routes/auth.js` hashes passwords using `bcryptjs` with 12 salt rounds.
  - Registration checks the domain of the supplied email address using Node's `dns` module (`dns.resolveMx` and `dns.resolve4` in `checkDomainReal`) to reject non-existent domains.
  - Login returns a generic error message (`"Invalid email or password."`) and executes a dummy bcrypt comparison if the user is not found, preventing timing-based account enumeration.
  - Password recovery generates a cryptographically secure 6-digit OTP using `crypto.randomInt` with a 15-minute expiry (`resetOTPExpiry`). OTP verification uses constant-time string comparison (`crypto.timingSafeEqual` in `safeOTPCompare`) to prevent timing side-channel attacks.
- **Route Rate Limiting**:
  - Authentication endpoints are protected using `express-rate-limit`: `authLimiter` (10 requests per 15 minutes, skipping successful requests), `forgotPasswordLimiter` (5 requests per hour), and `otpLimiter` (8 attempts per 15 minutes).
- **Frontend Authentication Handling**:
  - `frontend/src/context/AuthContext.jsx` manages user state, persisting credentials in `localStorage` under `ee_token` and `ee_user`.
  - `frontend/src/lib/api.js` configures an Axios instance with a request interceptor that automatically attaches `Authorization: Bearer <token>` to outbound API calls. A response interceptor handles HTTP 401 Unauthorized responses by clearing local storage and redirecting the browser to `/login`.
  - Client-side routes are guarded by `<ProtectedRoute>` (`frontend/src/components/ProtectedRoute.jsx`), which checks `isAuthenticated` and redirects unauthenticated users to `/login`.
- **Commit Evidence**:
  - Initial auth routes and middleware: `f104109` — `feat: Outline of all features, demo design and functions`
  - Security hardening and rate limiting: `54af121` — `refactor: backend security hardening and codebase cleanup of unused packages & assets`

### Why This Approach
A stateless JWT token model avoids maintaining persistent server-side session stores in MongoDB or Redis, matching Vercel's ephemeral serverless execution model where containers start and terminate dynamically. Enforcing ownership checks via Mongoose queries scoped strictly to `userId: req.user.id` guarantees multi-tenant data isolation without the unneeded complexity of a full RBAC role-permission matrix.

---

## 2. Vendor Discovery and Booking State Data Modeling

### Problem
Event planners need to discover local vendors across multiple event categories (Catering, Decoration, Photography, Music & DJ, Salon & Makeup, etc.), view ratings and locations, and manage their vendor pipeline (saving favorites, contacting vendors, confirming bookings, or declining). However, maintaining a self-hosted database of real-world vendors across multiple cities requires continuous updates, moderation, and geolocation maintenance.

### Options Considered
- Storing an internal, static MongoDB collection of vendor records alongside a dedicated relational `Booking` model.
- The repository does not record formal written design proposals; however, commit history demonstrates an evolution: the application began with static mock data (`backend/data/vendors.js`), then migrated to a live multi-tier external vendor search service in `backend/routes/vendors.js`.
- For bookings, instead of introducing an independent `Booking` collection with complex reservation lifecycles and payment gateways, the project tracks vendor interaction state directly on the `SavedVendor` model.

### Final Approach
- **Decoupled Multi-Tier Vendor Search (`fetchRealVendors`)**:
  - `GET /api/vendors` does not query a local MongoDB vendor table. Instead, `fetchRealVendors` in `backend/routes/vendors.js` executes a cascading search:
    1. **Foursquare Places API**: Queries `https://api.foursquare.com/v3/places/search` with the configured API key.
    2. **Google Places API**: Queries `https://maps.googleapis.com/maps/api/place/textsearch/json` if a Google Places key is present.
    3. **OpenStreetMap Nominatim Fallback**: Queries `https://nominatim.openstreetmap.org/search` as a live fallback, ensuring vendor searches in any city return real local listings even if external API quotas are exhausted.
  - Vendor identifiers are strings derived from external APIs (e.g., Foursquare `fsq_id`, Google `place_id`, or OSM IDs) rather than MongoDB ObjectIds.
- **Vendor Interaction & Pipeline Modeling (`SavedVendor`)**:
  - Host interactions with vendors are captured in `backend/models/SavedVendor.js`:
    - `userId`: `mongoose.Schema.Types.ObjectId` (ref `User`, required)
    - `eventId`: `mongoose.Schema.Types.ObjectId` (ref `Event`, optional)
    - `vendorId`: `String` (required, storing the external vendor string identifier)
    - `vendorName`: `String`
    - `vendorCategory`: `String`
    - `status`: Enum `["saved", "contacted", "booked", "declined"]` with default `"saved"`
    - `notes`: `String`
    - Compound unique index: `{ userId: 1, vendorId: 1 }` prevents a user from duplicating a saved vendor record.
  - When querying `GET /api/vendors/saved`, the backend enriches the saved records with vendor metadata.
- **Commit Evidence**:
  - Live vendor search integration: `829e60c` — `Refactor: event planning app for small-scale events, AI quotation math, and live vendor search`
  - Foursquare API configuration: `767b20f` — `add: foursquare api key`
  - Schema relationship adjustments: `6f34937` — `refactor: remove Firebase, fix frontend-backend data mapping, and configure Vercel deployment`

### Why This Approach
Decoupling vendor discovery from local database storage eliminates the overhead of synchronizing external place details and coordinates in MongoDB. Leveraging live Places APIs ensures real addresses, ratings, and phone numbers. Modeling the booking workflow via a `status` enum on `SavedVendor` provides a clear CRM pipeline (`saved` → `contacted` → `booked` → `declined`) tailored for small-to-medium event hosts without the overhead of a heavy transactional booking engine.

---

## 3. Frontend-Backend Data Schema Alignment & Refactoring

### Problem
As documented in `EventEase_Development_Timeline_Log.md` and commit `6f34937`, the project transitioned away from earlier prototype architectures toward a dedicated Express and MongoDB Atlas stack. This architectural evolution left several critical data mapping discrepancies between backend Mongoose schemas and frontend React components:
1. **Budget Scope Mismatch**: The original `Budget` model required an `eventId` (`{ eventId: ..., unique: true }`) and was queried through `/api/budget/:eventId`. However, the frontend `Budget.jsx` view was structured as a global user-level budget planner that did not pass an `eventId`, leading to 404s and broken budget state.
2. **Guest Property Discrepancies**: The backend `Guest` schema expected `rsvp`, `table`, and `dietary`, whereas `frontend/src/pages/Guests.jsx` sent and rendered `rsvpStatus`, `tableNumber`, and `dietaryRestrictions`. In addition, the `plusOne` boolean field was absent from the backend schema.
3. **Event Property Mismatches**: The backend `Event` schema defined `title`, `expectedGuests`, and `venue`, but `frontend/src/pages/Dashboard.jsx` accessed `event.name`, `event.guestCount`, and `event.location`, causing event cards to display empty fields.
4. **API Envelope Inconsistencies**: Some route handlers returned raw arrays (e.g., `res.json(events)`), while frontend data hooks expected wrapped response envelopes (e.g., `{ events: [...] }`, `{ guests: [...] }`, `{ reviews: [...] }`).

### Options Considered
The repository does not record multiple alternatives considered; the final implementation was a unified refactoring across backend models, route handlers, and frontend views committed in `6f34937`.

### Final Approach
Commit `6f34937` (`refactor: remove Firebase, fix frontend-backend data mapping, and configure Vercel deployment`) resolved these mismatches across the stack:
- **User-Centric Budget Model (`backend/models/Budget.js` & `backend/routes/budget.js`)**:
  - Re-anchored the `Budget` schema to `userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }`.
  - Moved `eventId` into individual `expenseSchema` subdocuments as an optional string (`eventId: { type: String, default: "" }`).
  - Updated `backend/routes/budget.js` to expose `/api/budget` with upsert logic (`findOneAndUpdate({ userId: req.user.id }, ..., { new: true, upsert: true })`), automatically initializing a budget record when a user first accesses the view.
  - Standardized expense categories to an explicit enum: `["Venue", "Catering", "Decoration", "Photography", "Music & DJ", "Flowers", "Transport", "Attire", "Invitations", "Gifts", "Miscellaneous"]`.
- **Guest Schema Alignment (`backend/models/Guest.js` & `frontend/src/pages/Guests.jsx`)**:
  - Added `plusOne: { type: Boolean, default: false }` to `backend/models/Guest.js`.
  - Updated form state and table rendering in `Guests.jsx` to map directly to `guest.rsvp`, `guest.table`, and `guest.dietary`.
- **Dashboard Property Alignment (`frontend/src/pages/Dashboard.jsx`)**:
  - Updated card rendering to use `event.title`, `event.expectedGuests`, and `event.venue`.
- **Standardized Response Envelopes**:
  - Updated `backend/routes/events.js` to return `res.json({ events })`.
  - Updated `backend/routes/guests.js` to return `res.json({ guests })`.
  - Updated `backend/routes/reviews.js` to return `res.json({ reviews })`.

### Why This Approach
Aligning schema field names and standardizing response envelopes established a consistent data contract across the client and server. Scoping budgets directly to the user rather than requiring an event ID allows event hosts to manage overarching budgets and track cross-event expenses without artificial relational constraints.

---

## 4. Full-Stack Monorepo Deployment Configuration on Vercel

### Problem
EventEase is structured as a full-stack monorepo with a Vite React SPA in `frontend/` and an Express API in `backend/`. Deploying this architecture on Vercel presented several challenges:
1. **Single Page Application (SPA) Routing & Fallback**: Client-side routes (such as `/dashboard`, `/budget`, `/guests`, `/vendors`) must serve `index.html` to allow React Router to handle navigation, while API calls (`/api/*`) must route to the Express serverless function (`backend/server.js`). Misconfigured routes caused direct page refreshes and static asset requests to return 404 Not Found errors.
2. **Build Orchestration in a Monorepo**: Vercel needs to install dependencies and compile the frontend Vite application from the repository root.
3. **Serverless MongoDB Connection Churn**: In traditional Node.js deployments, `app.listen()` keeps the process alive with a persistent MongoDB connection. In Vercel's serverless environment, invocations run inside ephemeral execution environments. Calling `mongoose.connect()` on every incoming request introduces connection latency and quickly exhausts MongoDB Atlas connection pools.

### Options Considered & Iterations Tried
The repository's Git commit history records a progression of deployment configurations across several commits:
1. **Commit `64c0c7e` (`feat: vercel file and deployment system`)**:
   - Introduced `vercel.json` with builds for `backend/server.js` (`@vercel/node`) and `frontend/package.json` (`@vercel/static-build`, with `distDir: "dist"`).
   - Used `rewrites` mapping `/api/(.*)` to `/backend/server.js` and `/(.*)` to `/frontend/dist/index.html`.
   - In `backend/server.js`, exported `module.exports = app` and conditionally suppressed `app.listen()` when `process.env.NODE_ENV !== "production"`.
2. **Commit `9c7ae0f` (`fix: design fix and vercel problem solved`)**:
   - Replaced `rewrites` with `routes` syntax, adding `handle: "filesystem"` but retaining destination `/frontend/dist/index.html`.
3. **Commits `81ead1a` & `2c74948` (`Fix JSON formatting in vercel.json`)**:
   - Addressed JSON syntax errors in `vercel.json`.
4. **Commit `1e850e0` (`fix: deployment json formate`)**:
   - Identified the root cause of SPA 404 errors: Vercel serves the compiled Vite output from the deployment root (`/index.html`), not `/frontend/dist/index.html`.
   - Updated `vercel.json` routes to check `handle: "filesystem"` first and route all remaining requests `/(.*)` to `/index.html`. Documented this explicitly in `readme.md` ("Why 404 happens on Vercel").
   - Added CORS handling in `backend/server.js` for dynamic `process.env.VERCEL_URL` origins and added static file fallback for local production testing.
5. **Commit `6f34937` (`refactor: remove Firebase, fix frontend-backend data mapping, and configure Vercel deployment`)**:
   - Added a root-level `package.json` specifying the unified build command: `"build": "npm install --prefix frontend && npm run build --prefix frontend"`.
   - Updated `vercel.json` so the static build targets root `package.json` with `distDir: "frontend/dist"`.
   - Implemented database connection caching (`cachedDb`) in `backend/server.js` to reuse existing Mongoose connections across warm serverless function invocations:
     ```javascript
     let cachedDb = null;

     const connectDB = async () => {
       if (cachedDb) return cachedDb;
       const conn = await mongoose.connect(MONGODB_URI);
       cachedDb = conn;
       return conn;
     };
     ```
   - Guarded `app.listen()` to only execute in local development or non-Vercel environments (`!process.env.VERCEL`).
   - Added `backend/index.js` exporting the Express `app` instance.

### Final Approach
The verified deployment configuration consists of:
- **Root Build Orchestration (`package.json`)**:
  ```json
  {
    "name": "eventease",
    "version": "1.0.0",
    "description": "EventEase — MERN event planning platform",
    "scripts": {
      "build": "npm install --prefix frontend && npm run build --prefix frontend"
    }
  }
  ```
- **Vercel Build and Routing Specification (`vercel.json`)**:
  ```json
  {
    "version": 2,
    "builds": [
      {
        "src": "package.json",
        "use": "@vercel/static-build",
        "config": {
          "distDir": "frontend/dist"
        }
      },
      {
        "src": "backend/server.js",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/api/(.*)",
        "dest": "/backend/server.js"
      },
      {
        "handle": "filesystem"
      },
      {
        "src": "/(.*)",
        "dest": "/index.html"
      }
    ]
  }
  ```
- **Connection Caching in Serverless Handler (`backend/server.js`)**:
  - Uses the `cachedDb` pattern to maintain an active Mongoose connection across multiple invocations within the same container.
  - Exports `app` for Vercel's Node.js runtime while avoiding calling `app.listen()` when `process.env.VERCEL` is set.
- **Frontend API Base URL Configuration (`frontend/src/lib/api.js`)**:
  - Evaluates `API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/api" : "http://localhost:5000/api")`, seamlessly routing production requests through Vercel's serverless rewrite without cross-origin configuration.

### Why This Approach
This architecture enables a full-stack MERN application to be deployed as a single project on Vercel without maintaining independent hosting providers for frontend and backend. The routing configuration prevents client-side 404 errors on deep page refreshes, handles static assets properly through the filesystem handler, and mitigates database connection exhaustion through in-memory connection caching.
