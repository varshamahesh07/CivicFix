# CivicFix Frontend

A React + Vite prototype of a civic complaint platform with two roles, Citizen and Authority, sharing one complaint store.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
```

Copy `.env.example` to `.env` to configure the API. Leave `VITE_API_BASE_URL` empty for demo mode.

## Demo logins (prototype only)

| Role | Identifier | Password |
|------|-----------|----------|
| Citizen | citizen@demo.civicfix (or 9876543210) | Citizen@123 |
| Citizen (second, to test privacy) | citizen2@demo.civicfix | Citizen@123 |
| Authority (approved) | AUTH-DEMO-001 or officer@demo.civicfix | Authority@123 |
| Authority (pending, cannot log in) | AUTH-DEMO-002 or pending@demo.civicfix | Pending@123 |

## Routes

Public: `/`, `/citizen/login`, `/citizen/register`, `/authority/login`, `/authority/register`

Citizen (protected): `/citizen/dashboard`, `/citizen/report`, `/citizen/complaints`, `/citizen/complaints/:id`, `/citizen/profile`, `/citizen/settings`

Authority (protected): `/authority/dashboard`, `/authority/complaints`, `/authority/priority`, `/authority/complaints/:id`, `/authority/reports`, `/authority/profile`, `/authority/settings`

## Architecture

- `src/services/` is the service layer. `authService`, `complaintService`, and `analysisService` contain demo logic today. Each function that will call the backend is guarded by `assertDemoMode`, so it fails loudly rather than pretending to succeed.
- `src/services/api.js` holds `apiRequest()` for when the Flask API is connected.
- `src/context/AppContext.jsx` provides the shared state. Citizens and authorities read one store, filtered by role. Every authority status update triggers a re-render of the citizen view.
- `src/services/demoStore.js` is an in-memory store. Data resets on page reload, which avoids storing personal data in browser storage.

## Demo workflow test

1. Open `/`, then log in as the demo citizen.
2. Go to **Report a Complaint**. Type a title and description, or use **Speak Your Complaint** in a supported browser. Enter an address and a locality, and set the duration. Review, then submit. Note the new ID (CF-2026-0008 onward).
3. Confirm it appears in **My Complaints**. Log out.
4. Log in as the authority. Search for the new ID in **All Complaints**, then open it.
5. Change the status to **Ongoing** with a note and save. Confirm the dashboard counts update.
6. Log out, log in as the citizen, and confirm the new status and history appear.
7. As the authority, change the status to **Resolved** and confirm. Check the citizen view shows the resolution note.
8. Log in as the second citizen and confirm complaints from the first citizen are not visible.

## Limitations (read before any production use)

- **Authentication is a demo.** Passwords are hashed with SHA-256 in the browser so they are not stored in plain text, but this is not secure. Production needs server-side hashing (bcrypt or argon2), HTTPS, rate limiting, session or token management, and CSRF protection.
- **Route protection is UX only.** Anyone can edit client code or call the API directly. The backend must check the user's role and ownership on every request.
- **Authority verification is not implemented.** Authority accounts stay `pending` until a real verification process approves them. Uploaded ID documents are not stored; only the file name is kept.
- **Demo data is in memory.** Registrations and complaints disappear when the page reloads.
- **Analysis is simulated.** Priority uses keyword rules and duplicate detection uses word overlap. Image classification, NLP, risk scores, and department routing are not real AI. Risk scores display "Not available" until a genuine service supplies them.
- **Settings that need a backend** (password change, notifications, email change) are shown disabled.
- **Browser features.** Voice input needs `SpeechRecognition` (Chrome, Edge, Safari). Geolocation needs permission and a secure context. Hashing needs `crypto.subtle`, so use `localhost` or HTTPS.

## Flask integration map

| Frontend function | Suggested endpoint |
|---|---|
| `authService.login` | `POST /api/auth/citizen/login`, `POST /api/auth/authority/login` |
| `authService.registerCitizen` | `POST /api/auth/citizen/register` |
| `authService.registerAuthority` | `POST /api/auth/authority/register` (multipart, ID document) |
| `complaintService.listComplaints` | `GET /api/complaints` (role-filtered server-side) |
| `complaintService.createComplaint` | `POST /api/complaints` (multipart, with image) |
| `complaintService.updateComplaintStatus` | `PATCH /api/complaints/:id/status` (authority only) |
| `analysisService.analyzeComplaint` | `POST /api/analysis` (image, NLP, duplicate, priority, risk) |

Replace each function body with an `apiRequest(...)` call and remove the `assertDemoMode` guard.
