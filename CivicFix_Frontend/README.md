# CivicFix — Intelligent Civic Complaint Resolution Platform

> **Official Tagline:** *"Every Voice Matters, Every Issue Counts."*
> 
> **Design Identity:** *"Civic Operations — Human-Centered Intelligence"*

CivicFix is a complete civic technology web prototype designed for college mini-project demonstration and modular backend integration. It provides an intuitive, high-transparency platform connecting citizen complaint reporting with municipal authority triage, rule-based hazard assessment, and end-to-end resolution tracking.

---

## 🏛️ System Modules Overview

1. **Module 1 — User Authentication & Role Management**
   - Distinct portals for **Citizen** and **Authority Operations**.
   - Role-based route protection (`ProtectedRoute`) preventing unauthorized cross-portal navigation.
   - Built-in **Reviewer Mode Quick-Switcher** in the sticky top banner for instant 1-click access to demo accounts (Citizen Aarav Sharma & Commissioner Priya Nair).
   - Citizen registration with age, residential address, terms acknowledgement, and phone validation.
   - Authority onboarding with municipal department, official designation, employee ID, and official ID-proof upload (with pending verification notice).

2. **Module 2 — Citizen Complaint Registration**
   - Comprehensive multi-category submission: *Roads & Potholes*, *Water Supply*, *Waste Management*, *Drainage & Sewage*, *Streetlights*, *Public Safety*, and *Other Civic Issues*.
   - **Speech Recognition ("Speak Your Complaint")**: Browser Web Speech API integration with live microphone transcription and visual recording indicators.
   - Issue duration tracking (days active) and prominent landmark input supporting "Nil" for remote areas.
   - Browser **Geolocation API** request with graceful denial/timeout fallbacks and coordinate acquisition ("Use My Location").
   - Image upload with size/format validation, real-time image preview, removal controls, and pre-seeded sample photo presets.
   - **Pre-submission Review Modal**: Clean inspection step before final ticket creation.
   - Instant confirmation screen displaying newly generated ID (e.g. `CF-2026-0009`) and triage assessment summary.

3. **Module 3 — Intelligent Complaint Analysis & Assessment**
   - Dedicated operational assessment card displaying:
     - **Issue Classification & Domain Mapping**
     - **Assessed Risk Score (0–100)** with interactive dial and explanatory criteria.
     - **Triage Priority** (*Low*, *Medium*, *High*, *Critical*) with trigger keyword explanation.
     - **Automated Duplicate Detection** (calculates text and proximity similarity against existing reports).
     - **Department Routing** (automatically maps category to responsible municipal body).
   - Cleanly isolated in `src/services/analysisService.js` for future replacement with Python AI/ML microservices.

4. **Module 4 — Authority Complaint Management Workspace**
   - Civic Operations Desk with live metrics dynamically calculated from the shared demo data store across the **5 exact platform statuses**:
     - *Total Complaints*, *Registered*, *Ongoing*, *Waiting List*, *Resolved*, *Denied*, and *Critical/High Risk Alerts*.
   - **Priority Queue**: Dynamically sorted Critical → High → Medium → Low, with risk score and timestamp tie-breakers.
   - Comprehensive multi-facet filtering toolbar:
     - Search by Complaint ID or Title.
     - Filter by Category.
     - Filter by Priority tier.
     - Filter by Status.
     - Filter by Ward / Location text.
     - Filter by Risk Score range (Low, Medium, High, Critical).
     - Sort by Priority, Risk Score, or Date.
     - Instant filter reset and live matching count.

5. **Module 5 — Complaint Status Tracking & Resolution Management**
   - Strict 5-stage lifecycle: **Registered → Ongoing → Waiting List → Resolved → Denied**.
   - Visual status progress timeline with step markers and completion bars.
   - Reassuring civic messaging on timeline for non-final states:
     - Ongoing: *"Your concern is being addressed. Every step brings us closer to a solution."*
     - Waiting List: *"Your complaint matters. Waiting does not mean forgotten."*
   - Detailed event history log tracking timestamped actions, actor identities, and operational notes.
   - Authority status transition modal requiring a mandatory on-ground resolution note or respectful denial explanation when closing tickets.
   - Strict citizen privacy enforcement: citizens can only view their own complaints; unauthorized direct ID lookups are denied.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm

### Installation & Launch
```bash
# Navigate to project root
cd e:/CivicFix/CivicFix_Frontend

# Install dependencies (React 18, Vite, React Router DOM, Axios, Lucide React, Tailwind CSS)
npm install

# Run the local development server
npm run dev
```

Open `http://localhost:5173` in your web browser.

---

## 🧭 Routes & Information Architecture

### Public Routes
- `/` — Homepage (Hero, CSS Marquee Tagline, Lifecycle, Features, Transparency)
- `/about` — About CivicFix, Mission, and Technical Architecture
- `/how-it-works` — Step-by-step reporting and municipal triage guide
- `/citizen/login` — Citizen portal sign-in with 1-click reviewer demo access
- `/citizen/register` — Citizen registration form with age, phone, and address validation
- `/authority/login` — Municipal authority command login with 1-click reviewer demo access
- `/authority/register` — Official authority onboarding form with ID-proof upload
- `*` — 404 Not Found page

### Citizen Routes (Protected)
- `/citizen/dashboard` — Citizen overview with personal 5-status complaint counts and recent submissions
- `/citizen/report` — Interactive complaint submission form with voice input, GPS, and review modal
- `/citizen/complaints` — My Complaints list with search and 5-status filtering tabs
- `/citizen/complaints/:id` — Live complaint tracking with reassuring progress timeline and photo proof
- `/citizen/profile` — Citizen account details and reporting summary
- `/citizen/settings` — Citizen notifications, password change, and privacy preferences

### Authority Routes (Protected)
- `/authority/dashboard` — Operations Command Desk, Priority Queue (Critical → Low), and live 5-status KPIs
- `/authority/complaints` — Full complaint management table with multi-facet filters
- `/authority/complaints/:id` — Full operational inspection, intelligence analysis card, and status changer (5 statuses)
- `/authority/reports` — Department workload allocation and resolution efficiency analytics
- `/authority/profile` — Municipal officer profile and clearance details
- `/authority/settings` — Authority operational settings, thresholds, and notification rules

---

## 🧑‍💻 Demo Profiles for Reviewers

A sticky **Reviewer Mode Bar** is docked at the top of every page allowing instant role switching:

1. **Citizen Demo**:
   - **Name**: Aarav Sharma
   - **Email**: `aarav.sharma@example.com`
   - **Password**: Any password or 1-click demo button
   - Pre-loaded with realistic complaints in Roads, Water, and Streetlighting.

2. **Authority Demo**:
   - **Name**: Commissioner Priya Nair
   - **Email**: `priya.nair@civic.gov`
   - **Department**: Central Civic Operations Command
   - **Password**: Any password or 1-click demo button
   - Full clearance to filter all tickets, inspect analysis cards, and transition status.

3. **Reset Demo Data**:
   - Resets any modifications back to the default seed dataset at any time via the top demo bar.

---

## 🔌 Backend Integration Specification

The frontend is ready for immediate integration with the upcoming Python Flask + SQLite backend:

- Central Axios client configured in `src/services/api.js`.
- Configurable environment variable `VITE_API_BASE_URL` in `.env`.
- `VITE_USE_MOCK_API=false` seamlessly routes all authentication and complaint CRUD calls to Flask endpoints.
- Full API contracts, JSON schemas, and SQLite models are documented in [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md).

---

## 📜 Disclaimer

*CivicFix is an academic college mini-project prototype developed for demonstration, software engineering review, and educational evaluation. It is not an officially deployed government platform or endorsed municipal department service.*
