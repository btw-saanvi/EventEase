<p align="center">
  <img src="https://img.shields.io/badge/EventEase-✨_Event_Planning_Platform-7c3aed?style=for-the-badge&labelColor=0a0a0f" alt="EventEase" />
</p>

<h1 align="center">EventEase</h1>

<p align="center">
  <strong>A modern, full-stack event planning platform built with React &amp; Node.js</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**EventEase** is an all-in-one event planning platform that helps you manage events, track budgets, organise guest lists, discover vendors, and write reviews — all from a beautiful, glassmorphic dark-mode interface.

It features **Google OAuth** authentication for seamless sign-in, a **demo mode** for quick previews without needing a Google account, and a fully responsive design that works across desktop and mobile.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Google OAuth 2.0 sign-in + demo user bypass |
| 📅 **Event Management** | Create, edit, and track events with status and type categorisation |
| 💰 **Budget Tracking** | Set budgets per event, add/edit expenses by category, track paid/unpaid |
| 👥 **Guest Management** | Add guests, track RSVPs (pending/confirmed/declined), dietary notes |
| 🏪 **Vendor Marketplace** | Browse a curated catalog of vendors with search, filter & sort |
| 💾 **Saved Vendors** | Save vendors for quick access and track booking status |
| ⭐ **Reviews** | Write and manage vendor reviews with ratings |
| 👤 **Profile** | Update your name, phone, bio, and avatar |
| 🌙 **Dark Glassmorphic UI** | Premium dark theme with gradient accents and micro-animations |
| 📱 **Fully Responsive** | Works beautifully on desktop, tablet, and mobile |

---

## 🛠 Tech Stack

### Frontend
- **React 19** — UI framework
- **Vite 8** — Build tool and dev server
- **React Router v7** — Client-side routing
- **TanStack React Query** — Server state management
- **Tailwind CSS 3** — Utility-first styling
- **Lucide React** — Icon library
- **Sonner** — Toast notifications
- **Axios** — HTTP client
- **@react-oauth/google** — Google OAuth integration
- **React Hook Form + Zod** — Form handling and validation

### Backend
- **Node.js** — Runtime
- **Express 5** — Web framework
- **MongoDB + Mongoose 9** — Database and ODM
- **JSON Web Tokens (JWT)** — Authentication tokens
- **Google Auth Library** — Google token verification
- **CORS** — Cross-origin resource sharing
- **dotenv** — Environment variable management

---

## 📁 Project Structure

```
EventEase/
├── backend/
│   ├── data/
│   │   └── vendors.js          # Static vendor catalog
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── models/
│   │   ├── Budget.js           # Budget & expenses schema
│   │   ├── Event.js            # Event schema
│   │   ├── Guest.js            # Guest schema
│   │   ├── Review.js           # Review schema
│   │   ├── SavedVendor.js      # Saved vendor schema
│   │   └── User.js             # User schema
│   ├── routes/
│   │   ├── auth.js             # Auth routes (Google, mock, me)
│   │   ├── budget.js           # Budget CRUD routes
│   │   ├── events.js           # Event CRUD routes
│   │   ├── guests.js           # Guest CRUD routes
│   │   ├── profile.js          # Profile get/update routes
│   │   ├── reviews.js          # Review CRUD routes
│   │   └── vendors.js          # Vendor catalog + save routes
│   ├── .env                    # Environment variables (not committed)
│   ├── .env.example            # Example env file
│   ├── package.json
│   └── server.js               # Express app entry point
│
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/           # Landing page sections
│   │   │   ├── layout/         # Navbar, Footer, layouts
│   │   │   ├── ui/             # Reusable UI components
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state management
│   │   ├── hooks/
│   │   │   └── use-auth.js     # Auth hook wrapper
│   │   ├── lib/
│   │   │   ├── api.js          # Axios instance with interceptors
│   │   │   └── utils.js        # Utility functions
│   │   ├── pages/              # All page components
│   │   ├── App.jsx             # Route definitions
│   │   ├── main.jsx            # App entry point
│   │   ├── App.css             # App-specific styles
│   │   └── index.css           # Global styles & design system
│   ├── .env                    # Frontend env variables
│   ├── .env.example            # Example env file
│   ├── index.html              # HTML template
│   ├── package.json
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── postcss.config.js       # PostCSS configuration
│   └── vite.config.js          # Vite configuration
│
└── readme.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** — A running MongoDB instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **Google OAuth Credentials** — From the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (optional for demo mode)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/EventEase.git
cd EventEase
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
MONGODB_URI=mongodb://localhost:27017/eventease
GOOGLE_CLIENT_ID=your-google-client-id
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

Start the backend development server:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`.

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

Start the frontend development server:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

### 4. Try it out!

Open [http://localhost:5173](http://localhost:5173) in your browser. You can:
- **Sign in with Google** if you've configured OAuth credentials
- **Use Demo Mode** — click "Sign in as Demo User" to bypass Google authentication

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID | ❌ (demo mode works without it) |
| `JWT_SECRET` | Secret key for signing JWT tokens | ✅ |
| `PORT` | Server port (default: `5000`) | ❌ |

### Frontend (`frontend/.env`)

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Backend API URL (default: `http://localhost:5000/api`) | ❌ |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID | ❌ (demo mode works without it) |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/google` | Google OAuth sign-in | ❌ |
| `POST` | `/api/auth/mock` | Demo user sign-in | ❌ |
| `GET` | `/api/auth/me` | Get current user | ✅ |

### Events
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/events` | List user's events | ✅ |
| `POST` | `/api/events` | Create an event | ✅ |
| `GET` | `/api/events/:id` | Get single event | ✅ |
| `PUT` | `/api/events/:id` | Update an event | ✅ |
| `DELETE` | `/api/events/:id` | Delete an event | ✅ |

### Guests
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/guests` | List guests (optional `?eventId=`) | ✅ |
| `POST` | `/api/guests` | Add a guest | ✅ |
| `PUT` | `/api/guests/:id` | Update a guest | ✅ |
| `DELETE` | `/api/guests/:id` | Delete a guest | ✅ |

### Budget
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/budget/:eventId` | Get budget for event | ✅ |
| `PUT` | `/api/budget/:eventId` | Update total budget | ✅ |
| `POST` | `/api/budget/:eventId/expenses` | Add an expense | ✅ |
| `PUT` | `/api/budget/:eventId/expenses/:expenseId` | Update expense | ✅ |
| `DELETE` | `/api/budget/:eventId/expenses/:expenseId` | Delete expense | ✅ |

### Vendors
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/vendors` | Browse vendor catalog | ❌ |
| `GET` | `/api/vendors/saved` | Get saved vendors | ✅ |
| `POST` | `/api/vendors/save` | Save a vendor | ✅ |
| `DELETE` | `/api/vendors/save/:vendorId` | Unsave a vendor | ✅ |

### Reviews
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/reviews` | List user's reviews | ✅ |
| `GET` | `/api/reviews/vendor/:vendorId` | Get vendor reviews | ✅ |
| `POST` | `/api/reviews` | Create a review | ✅ |
| `PUT` | `/api/reviews/:id` | Update a review | ✅ |
| `DELETE` | `/api/reviews/:id` | Delete a review | ✅ |

### Profile
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/profile` | Get user profile | ✅ |
| `PUT` | `/api/profile` | Update profile | ✅ |

---

## 📜 Scripts

### Backend

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `node --watch server.js` | Start dev server with auto-restart |
| `npm start` | `node server.js` | Start production server |

### Frontend

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `vite` | Start Vite dev server |
| `npm run build` | `vite build` | Build for production |
| `npm run preview` | `vite preview` | Preview production build |
| `npm run lint` | `eslint .` | Run ESLint |

---





<p align="center">
  Made with ❤️ by <strong>Saanvi Garg</strong>
</p>
