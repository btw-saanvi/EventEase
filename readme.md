# ✦ EventEase 🦉

<div align="center">

![EventEase Banner](https://img.shields.io/badge/EventEase-Small%20%26%20Medium%20Event%20Hub-FFD933?style=for-the-badge&logoColor=black)

**One Dashboard. Zero Chaos. Unforgettable Small & Medium Events.**

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite 8](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![xAI Grok](https://img.shields.io/badge/AI-xAI%20Grok-FF6B6B?style=flat-square&logo=x&logoColor=white)](https://x.ai)

</div>

---

## 1. Overview

**EventEase** is a full-stack, neo-brutalist web application designed to take the stress out of event planning. While traditional platforms focus on oversized $50k+ destination weddings, EventEase specializes in **small-to-medium scale celebrations** — house parties, micro-weddings, casual family BBQs, birthday bashes, and baby showers.

It combines intelligent AI estimation, live local vendor search via Google Places, real-time budget tracking, guest RSVP management, and selective user privacy safeguards into a single, high-energy interactive hub.

---

## 2. Links

- **Live Demo**: [https://event-ease-ashen.vercel.app/](https://event-ease-ashen.vercel.app/)
- **GitHub Repository**: [https://github.com/btw-saanvi/EventEase](https://github.com/btw-saanvi/EventEase)

---

## 3. Features

### 🤖 Grok AI Quotation & Planning Engine
- **Smart Math Allocation**: Input your budget and guest count — our backend powered by **xAI Grok** computes accurate category allocations (Catering, Decor, Sound/Venue, Extras, Emergency Buffer) based on your selected experience level (*Budget*, *Standard*, *Premium*).
- **Personalized Tips**: Easey the Owl generates 2 custom, witty, actionable party tips tailored to your specific dietary notes, timing, location, and guest list.

### 📍 Live Vendor Marketplace & Foursquare / Google Places Integration
- **Real Local Business Lookup**: Search for vendors in any city (e.g. *Delhi, Mumbai, Kolkata*) or category (*Flowers, DJ, Catering, Salon & Makeup, Photography*).
- **Foursquare & Google Places Proxy**: Integrates Foursquare Places API (`api.foursquare.com/v3`) and Google Places API to fetch real business listings, category tags, ratings, and direct Google Maps directions.
- **Resilient Multi-Tier Fallback**: Automatically cascades from Foursquare Places → Google Places → OpenStreetMap Nominatim live search, guaranteeing search results are never empty.

### 🛡️ Security & Selective Vendor Privacy
- **Selective Info Controls**: Personal phone, email, and location are protected by default and strictly revealed only to vendors that users explicitly favorite/save.
- **Security Hardened**: Protected against CORS exploits, mass assignment (IDOR), XSS injection, account enumeration, timing attacks, and API credit exhaustion.

### 📊 Interactive Event Command Center
- **Budget Manager**: Track paid vs. pending vendor expenses with interactive category breakdowns.
- **Guest List Manager**: Filter RSVPs (Confirmed, Pending, Declined), track dietary restrictions, plus-ones, and table assignments.
- **Reviews & Feedback**: Submit and manage authentic vendor ratings tied to your organized events.

### 🎨 Bold Neo-Brutalist Design System
- High-contrast typography, crisp offset shadows (`box-shadow: 4px 4px 0 #1E1E1E`), glassmorphism cards, and an interactive 3D mascot.

---

## 4. Screenshots / Demo

*Meet Easey the Owl — Your 3D Smart Event Companion!*
![Easey the Owl Mascot](./frontend/src/assets/mascot.png)

*(Note: Additional app screenshots were not found in the repository).*

---

## 5. Tech Stack

### **Frontend**
- **Framework**: React 19 + Vite 8
- **State & Query**: TanStack Query (React Query v5) + Context API
- **Routing**: React Router v7
- **Styling**: Tailwind CSS + Custom Brutalist Design Tokens
- **Icons**: Lucide React Icons
- **HTTP Client**: Axios

### **Backend**
- **Runtime**: Node.js v22
- **Framework**: Express.js 5.x
- **Database**: MongoDB Atlas via Mongoose 9.x
- **AI Service**: xAI Grok API (`api.x.ai/v1`)
- **Security**: Helmet, Express Rate Limit, bcryptjs, jsonwebtoken, Validator.js
- **Mailer**: Nodemailer

---

## 6. Live Demo

Experience the live application here: **[EventEase Live Demo](https://event-ease-ashen.vercel.app/)**

---

## 7. Setup Instructions

### Prerequisites
- **Node.js**: v20.x or v22.x
- **MongoDB**: Local MongoDB instance or MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/btw-saanvi/EventEase.git
cd EventEase
```

### 2. Backend Configuration
```bash
cd backend
npm install
```

Create a `backend/.env` file:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/eventease
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000

# API Keys
GROK_API_KEY=gsk_your_xai_grok_api_key
FOURSQUARE_API_KEY=WLPU4XXKNE5AHRAL3XHPXMIWDYBDJLAO3VDU0ROD0PVFSFP3
GOOGLE_PLACES_API_KEY=your_google_places_api_key

# Nodemailer OTP Settings (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Configuration
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `frontend/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the Vite development server:
```bash
npm run dev
```

Visit **`http://localhost:5173`** in your browser! 🎉

---

## 8. Technical Decisions

EventEase involved several implementation and deployment challenges, including stateless authentication and protected API access without role bloat, multi-tier vendor discovery and booking data modeling, frontend-backend schema reconciliation, and monorepo Vercel serverless deployment configuration.

For the detailed engineering decisions, implementation reasoning, alternatives considered, and challenges encountered, see:

[Technical Decisions & Challenges](./TECHNICAL_DECISIONS.md)

---

## 📄 License & Attribution

- **Author**: Built with ❤️ by **Saanvi Garg**.
- **Inspiration**: UI layout and flow inspired by modern web design & brutalist aesthetics.
- **License**: Personal project & portfolio showcase. All rights reserved.
