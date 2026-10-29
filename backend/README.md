# CivicFix Backend

A Flask API that implements the contract the CivicFix frontend already expects. It serves the same
data shapes, validation messages, and role rules as the frontend's demo store, so the frontend
can switch from demo mode to this API by changing its service layer. Nothing about the UI changes.

## Stack

- Flask 3 with a Flask-SQLAlchemy ORM. SQLite by default; set `DATABASE_URL` for PostgreSQL.
- Server-side sessions in a signed, HttpOnly, SameSite=Lax cookie.
- Passwords hashed with Werkzeug's scrypt. Nothing is stored in plain text.
- Uploads are validated by file signature (magic bytes), not by the browser's declared type.

## Run it

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

export APP_ENV=development
export SECRET_KEY="$(python -c 'import secrets; print(secrets.token_hex(32))')"
export DEMO_SEED=1          # loads the demo accounts and complaints into an empty database
flask --app wsgi run --port 5000
```

Set `VITE_API_BASE_URL=http://localhost:5000/api` in the frontend's `.env`, then run `npm run dev`.

Tests: `pytest -q tests`

Production: `APP_ENV=production`, a real `SECRET_KEY`, `DEMO_SEED` unset, `SESSION_COOKIE_SECURE=1`,
HTTPS, and `gunicorn -w 4 -b 0.0.0.0:8000 wsgi:app`. Use one worker with SQLite.

## Endpoints

Every response is JSON. Errors are `{"message": "..."}`, and the message is the text the frontend shows.
Validation errors also include `errors` with one message per field.

| Method | Path | Who | Frontend function |
|---|---|---|---|
| POST | `/api/auth/citizen/login` | public | `authService.login('citizen')` |
| POST | `/api/auth/authority/login` | public | `authService.login('authority')` |
| POST | `/api/auth/citizen/register` | public | `authService.registerCitizen` (no sign-in, as in the demo) |
| POST | `/api/auth/authority/register` | public, multipart with `idDocument` | `authService.registerAuthority` (always `pending`) |
| POST | `/api/auth/logout` | any | logout |
| GET | `/api/auth/me` | signed in | restore session on page load (new) |
| PATCH | `/api/auth/profile` | citizen | `authService.updateProfile` |
| GET | `/api/complaints` | signed in | `complaintService.listComplaints` (citizens see own only) |
| POST | `/api/complaints` | citizen, JSON or multipart with `image` | `complaintService.createComplaint` |
| GET | `/api/complaints/:id` | owner or authority | detail view |
| PATCH | `/api/complaints/:id/status` | authority | `complaintService.updateComplaintStatus` |
| GET | `/api/complaints/:id/image` | owner or authority | `imagePreview` |
| POST | `/api/analysis` | signed in | `analysisService.analyzeComplaint` (duplicate match only for authorities) |
| GET | `/api/health` | public | health check |

### Query parameters for `GET /api/complaints`

`status`, `category`, `priority`, `q` (matches ID and title; also citizen name for authorities),
`limit` and `offset` (optional; without `limit` the full list is returned, as the frontend expects).
The response carries `X-Total-Count`.

## Rules the server enforces

- **Role and ownership.** Citizens see only their own complaints. A citizen who requests someone else's
  complaint gets the same 404 as a missing ID, so IDs cannot be probed.
- **Citizen view.** The response omits `citizenContact`, `analysis`, `riskScore`, and `suggestedDepartment`.
- **Authority accounts.** Each starts `pending`. Login returns 403 with the frontend's message until an
  approval is recorded. Approval is never automatic. Revoking approval ends existing sessions immediately.
- **Status changes.** Same status with no note is rejected. `Denied` needs a reason. Every change is
  appended to the history with the authority's name.
- **Complaint IDs.** `CF-YYYY-NNNN` from a per-year counter. The counter row is locked inside the transaction,
  so concurrent submissions do not collide.
- **Duplicates.** Searched only within the same category and locality. The newest match wins.
- **Login.** Five failed attempts per IP and identifier in 15 minutes return 429. Unknown identifiers take as
  long as wrong passwords.
- **Cross-site writes.** A state-changing request whose `Origin` is not in `CORS_ORIGINS` returns 403.
- **Uploads.** Complaint photos: JPG, PNG, or WEBP, 5 MB max. ID documents: PDF, JPG, or PNG, 5 MB max. The
  ID document is checked and then discarded; only its name is kept. Files are stored under random names.

## Changes needed in the frontend

The backend follows the frontend's contract, but a few frontend pieces assume the demo store. Change these
when you connect:

1. **`src/services/api.js`.** `apiRequest` always sends `Content-Type: application/json` and stringifies the body.
   Multipart uploads need the browser to set the header, so skip both for `FormData`:
   ```js
   export async function apiRequest(path, { method = 'GET', body } = {}) {
     const isForm = body instanceof FormData;
     const res = await fetch(`${API_BASE_URL}${path}`, {
       method,
       headers: isForm ? undefined : { 'Content-Type': 'application/json' },
       credentials: 'include',
       body: isForm ? body : body ? JSON.stringify(body) : undefined,
     });
     const data = await res.json().catch(() => ({}));
     if (!res.ok) throw new Error(data.message || `Request failed (${res.status}).`);
     return data;
   }
   ```
2. **Passwords.** Remove the client-side `sha256` hashing. Send the raw password over HTTPS, and let the
   backend hash it. Otherwise login fails, because the server compares against a scrypt hash of the real password.
3. **Async data.** `listComplaints` is synchronous and `AppContext` reads it through `useMemo`. Make it
   `await apiRequest('/complaints')` and store the result in state. Reload after each login, submission,
   and status change, as `bump()` does now.
4. **Session restore.** `getSessionUser()` reads `sessionStorage`, which is empty in API mode. On mount, call
   `GET /api/auth/me`. A 401 means logged out.
5. **Complaint submission.** Send a `FormData` with the fields plus `image` (the file input). Drop the
   separate `analyzeComplaint` call. The server analyzes on submit.
6. **Authority registration.** Send `FormData` with the fields plus `idDocument`.
7. **Photos.** `imagePreview` is a path such as `/api/complaints/CF-2026-0001/image`. Prefix it with the API
   origin before using it as an `<img src>`.
8. **Profile.** `updateProfile` becomes `PATCH /api/auth/profile`.

## Production notes

- **Use PostgreSQL** and a migration tool such as Flask-Migrate. `db.create_all()` is for development only.
- **Use a shared rate limiter** (Redis) for login. The in-process limiter does not span workers.
- **Store uploads in object storage** (for example S3) and serve them through signed URLs.
- **Add an audit log** of authority actions. Status history already covers complaints.
- **Keep demo seeding off** in production (`DEMO_SEED` unset). Demo passwords are public in this repo.
- **Verify authorities** through a real process before approving them. The `verification` column is the hook.
