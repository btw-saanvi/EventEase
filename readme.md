# EventEase

> Personal full-stack event planning project by **Saanvi Garg**.

EventEase is a modern web app for planning events end-to-end: create events, track budgets, manage guests, explore vendors, and write reviews in one place.

## Project Summary

EventEase is my “one dashboard, zero chaos” event planning build.
It combines planning + execution workflows in a single product: from discovering vendors and requesting quotations to managing budgets, guest RSVPs, and post-event reviews.

The goal of this project is to make event management feel less like spreadsheet warfare and more like a clean, visual command center.
Design-wise, I went for a bold, playful brutalist UI so the product feels memorable instead of generic.

---

## Preview

- Landing page with a bold custom design system
- Authenticated dashboard for event operations
- Responsive UI across desktop and mobile

---

## Core Features

- **Authentication**
  - Google OAuth login
  - Demo login flow for local testing
- **Event Management**
  - Create, edit, and track events
- **Budget Planner**
  - Set total budget
  - Add/edit/delete expenses by category
- **Guest Manager**
  - Track RSVP status and guest details
- **Vendor Experience**
  - Browse vendors
  - Save favorites
  - Maintain personal reviews and ratings
- **Profile**
  - Update personal profile information

---

## Tech Stack

### Frontend
- React 19
- Vite 8
- React Router
- TanStack Query
- Tailwind CSS
- Lucide Icons
- Axios

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT Auth

---

## Project Structure

```text
EventEase/
├─ backend/
│  ├─ models/
│  ├─ routes/
│  ├─ middleware/
│  └─ server.js
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ context/
│  │  └─ lib/
│  └─ vite.config.js
└─ readme.md
```

---

## Run Locally

### 1) Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/eventease
GOOGLE_CLIENT_ID=your-google-client-id
JWT_SECRET=your-secret-key
PORT=5000
```

Start backend:

```bash
npm run dev
```

### 2) Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

Start frontend:

```bash
npm run dev
```

Open: `http://localhost:5173`

---

## Deploy on Vercel

1. Push this repo to GitHub and import it in [Vercel](https://vercel.com).
2. Keep the **root directory** as the repo root (where `vercel.json` lives).
3. Add these environment variables in Vercel → Project → Settings → Environment Variables:

**Backend**
- `MONGODB_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`

**Frontend (build-time)**
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_API_URL` = `/api`

4. Redeploy after saving env vars.

### Why 404 happens on Vercel

The most common cause is the SPA fallback pointing to the wrong file path. Vercel serves the Vite build from the deployment root (`/index.html`, `/assets/...`), not `/frontend/dist/index.html`. This repo’s `vercel.json` uses:

- `/api/*` → Express backend
- static files from the build output
- all other routes → `/index.html` (React Router)

If assets or pages still 404, open DevTools → Network and check which exact URL fails (JS bundle, API route, or favicon).

---

## Scripts

### Backend
- `npm run dev` - Run API with watch mode
- `npm start` - Run API in normal mode

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run lint checks

---

## Notes

- This repository is a **personal project** and portfolio work.
- It is **not intended as an open-source collaboration project**.

---

## Inspiration

Landing page section flow is inspired by [Event Planet](https://eventplanet.in/) and reinterpreted in EventEase’s own brutalist design style.

---

## Author

Built by **Saanvi Garg**.
