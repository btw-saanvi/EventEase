# EventEase — Individual Contribution & Development Timeline Log

## Project Overview

**EventEase** is a full-stack web application designed for planning small-scale events. Its main purpose is to streamline event organization by providing tools for budget tracking, guest management, and live vendor searches, complemented by advanced features like AI-driven quotation generation and an interactive 3D mascot.

**Technologies Used (Verified from Repository):**
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose models)
- **Deployment:** Vercel
- **APIs/Integrations:** Foursquare API (Vendors), AI integration

**My Contribution:**
As a full-stack developer on this project, I architected and implemented the entire system. This includes developing the Express backend, designing MongoDB data models, building the React frontend with a modern neobrutalist theme, implementing AI quotation logic, integrating the Foursquare API for vendor searches, and managing the project's deployment configuration on Vercel.

---

## Important Note Regarding Timeline

> **Note:** I previously listed the development timeline for EventEase on my resume as "May 2025 – July 2025". The timeline documented below is reconstructed strictly from the **current Git repository's history**, which shows activity from **May 21, 2026 to August 23, 2026**.
> 
> The original project was completed earlier, but the repository reflects a later period of significant feature additions, refactoring, and updates (e.g., AI integrations, neobrutalist theme update). This document serves as verifiable evidence of the development activity present in the current Git history, and cannot independently verify the earlier development period.

---

## Chronological Commit History

| Date | Commit Hash | Exact Commit Message | Changes / Contribution | Development Phase |
| :--- | :--- | :--- | :--- | :--- |
| 2026-05-21 | 81c6721 | initial commit | Initialized the Git repository. | Initial Project Setup |
| 2026-05-27 | f104109 | feat: Outline of all features, demo design and functions | Created foundational frontend/backend structures, models, API routes, and base UI components. | Initial Project Setup |
| 2026-05-27 | 64c0c7e | feat: vercel file and deployment system | Added `vercel.json` configuration file for deployment. | Deployment & Configuration |
| 2026-05-27 | 9c7ae0f | fix: design fix and vercel problem solved | Adjusted frontend layout and Vercel deployment parameters. | Deployment & Configuration |
| 2026-05-27 | 81ead1a | Fix JSON formatting in vercel.json | Fixed JSON syntax errors in the Vercel config. | Deployment & Configuration |
| 2026-05-27 | 2c74948 | fix: Fix JSON formatting in vercel.json | Further corrected JSON formatting in `vercel.json`. | Deployment & Configuration |
| 2026-05-27 | 2a975dd | Merge branch 'main' of https://github.com/btw-saanvi/EventEase | Merged remote changes into the main branch. | Deployment & Configuration |
| 2026-05-27 | 1e850e0 | fix: deployment json formate | Finalized JSON format fixes for reliable deployment. | Deployment & Configuration |
| 2026-05-31 | 6f34937 | refactor: remove Firebase, fix frontend-backend data mapping, and configure Vercel deployment | Removed Firebase dependencies, updated API data mappings across frontend/backend, and refined Vercel setup. | Backend/API Development |
| 2026-06-01 | 2f9fb2f | feat: align components to neobrutalist theme & add review image upload | Styled extensive UI components with a neobrutalist design and added image upload functionality to the backend Review models and frontend pages. | Frontend Development |
| 2026-08-23 | 829e60c | Refactor: event planning app for small-scale events, AI quotation math, and live vendor search | Updated vendor routes, budget routes, and frontend pages to support AI quotations and live Foursquare vendor searches. | Event Management / Vendor System |
| 2026-08-23 | e5270d6 | add :3D interactive owl pet mascot Easey and backend AI quotation service | Implemented `InteractiveMascot.jsx` frontend component and created the `/ai` backend route for quotation generation. | Frontend Development / Backend API |
| 2026-08-23 | 54af121 | refactor: backend security hardening and codebase cleanup of unused packages & assets | Cleaned up unused frontend UI components/assets and implemented security improvements in backend middleware and API routes. | Bug Fixes & Refinements |
| 2026-08-23 | e348453 | Readme update | Wrote comprehensive project documentation in `readme.md`. | Bug Fixes & Refinements |
| 2026-08-23 | 767b20f | add: foursquare api key | Integrated Foursquare API credentials into vendor routes and backend data files. | Vendor/Booking System |

---

## Development Phases

### Phase 1 — Initial Project Setup
- **Date Range:** May 21, 2026 – May 27, 2026
- **What I was working on:** Establishing the core architecture of the application.
- **Problem/Requirement:** The project needed a solid foundation with an Express backend, MongoDB models, and a React frontend to support upcoming features.
- **What I implemented:** Initialized the repository and laid out the foundational features, demo design, routing, and database models.
- **Why the work was necessary:** To provide the structural scaffolding required to build feature-specific modules like the budget tracker and vendor search.
- **Relevant Commits:** `81c6721`, `f104109`

### Phase 2 — Deployment & Configuration
- **Date Range:** May 27, 2026
- **What I was working on:** Setting up continuous deployment using Vercel.
- **Problem/Requirement:** The web application needed to be publicly accessible, requiring proper hosting configuration.
- **What I implemented:** Added and iteratively fixed the `vercel.json` configuration file to ensure smooth deployment of the full-stack app.
- **Why the work was necessary:** Vercel requires specific routing rules to serve a React frontend alongside an Express backend effectively.
- **Relevant Commits:** `64c0c7e`, `9c7ae0f`, `81ead1a`, `2c74948`, `2a975dd`, `1e850e0`

### Phase 3 — Backend/API Development
- **Date Range:** May 31, 2026
- **What I was working on:** Refining the backend data flow and removing legacy dependencies.
- **Problem/Requirement:** The app was transitioning away from Firebase to a custom backend solution, which broke frontend-backend communication.
- **What I implemented:** Stripped out Firebase integrations, re-mapped data structures between the React frontend and Node/Express backend, and updated the Vercel config.
- **Why the work was necessary:** To finalize the migration to a fully custom backend architecture using MongoDB/Express.
- **Relevant Commits:** `6f34937`

### Phase 4 — Frontend Development
- **Date Range:** June 1, 2026 – August 23, 2026
- **What I was working on:** Overhauling the user interface and adding interactive elements.
- **Problem/Requirement:** The UI needed a distinct, modern identity, and user reviews required media support.
- **What I implemented:** Re-styled all frontend components to follow a distinct "neobrutalist" aesthetic, added image upload capabilities, and later implemented an interactive 3D mascot ("Easey").
- **Why the work was necessary:** To improve user engagement and provide a highly modern, polished visual experience.
- **Relevant Commits:** `2f9fb2f`, `e5270d6`

### Phase 5 — Event Management / Vendor System
- **Date Range:** August 23, 2026
- **What I was working on:** Adding live data and AI capabilities to core event planning tools.
- **Problem/Requirement:** Users needed realistic cost estimates and the ability to find actual local vendors dynamically.
- **What I implemented:** Integrated the Foursquare API for live vendor searching, added backend AI routes to generate dynamic budget quotations, and refactored the app for small-scale events.
- **Why the work was necessary:** To transform the app from a static tracker into a smart, dynamic planning assistant.
- **Relevant Commits:** `829e60c`, `767b20f`

### Phase 6 — Bug Fixes & Refinements
- **Date Range:** August 23, 2026
- **What I was working on:** Optimizing the codebase and improving security.
- **Problem/Requirement:** The project had accumulated unused UI assets, and backend routes lacked sufficient security middleware.
- **What I implemented:** Deleted dozens of unused React components and assets, hardened backend authentication middleware, and updated the project `readme.md`.
- **Why the work was necessary:** To reduce bundle size, improve application security, and ensure the code is maintainable for future development.
- **Relevant Commits:** `54af121`, `e348453`

---

## Evidence & Verification

- **Repository Name:** EventEase
- **Repository URL:** https://github.com/btw-saanvi/EventEase
- **Inspection Command Used:** `git log --reverse --format="%h | %ad | %s" --date=short` and `git log --reverse --name-status`
- **Earliest Commit Date:** 2026-05-21
- **Latest Commit Date:** 2026-08-23
- **Total Commits Inspected:** 15
- **Verification Note:** This entire timeline and the technical contributions claimed have been reconstructed strictly and verifiably from the repository's Git history. No commits were altered, and all claimed features map directly to the file diffs found in the commit logs.
