# CivicFix — Backend Integration & API Specification

This document details the API contracts, schemas, and endpoints expected by the CivicFix frontend for backend teammates implementing the **Python Flask** backend with **SQLite (Flask-SQLAlchemy)**.

---

## 1. Architectural Mode Switch

The frontend includes an explicit environment toggle in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK_API=true
```

- When `VITE_USE_MOCK_API=true` (default):
  The frontend executes deterministic client-side mock services with local persistence (`localStorage`) without firing repeated failing network calls.
- When `VITE_USE_MOCK_API=false`:
  The frontend dispatches requests via `src/services/api.js` (Axios) directly to `http://localhost:5000/api` with authorization Bearer headers.

---

## 2. Authentication API Endpoints

### 2.1 Citizen Registration
- **Endpoint**: `POST /api/auth/citizen/register`
- **Request Body**:
  ```json
  {
    "name": "Ramesh Kulkarni",
    "email": "ramesh.k@example.com",
    "phone": "+91 98765 43210",
    "password": "securepassword123"
  }
  ```
- **Response `(201 Created)`**:
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": "citizen-102",
      "role": "citizen",
      "name": "Ramesh Kulkarni",
      "email": "ramesh.k@example.com",
      "phone": "+91 98765 43210",
      "registeredAt": "2026-10-23T16:00:00Z"
    }
  }
  ```

### 2.2 Citizen Login
- **Endpoint**: `POST /api/auth/citizen/login`
- **Request Body**:
  ```json
  {
    "email": "aarav.sharma@example.com",
    "password": "userpassword"
  }
  ```
- **Response `(200 OK)`**: Returns token and user profile object.

### 2.3 Authority Registration / Onboarding
- **Endpoint**: `POST /api/auth/authority/register`
- **Request Body**:
  ```json
  {
    "name": "Vikram Desai",
    "email": "vikram.d@civic.gov",
    "department": "Public Works & Road Maintenance",
    "designation": "Assistant Municipal Engineer",
    "employeeId": "PMC-ENG-2024-88",
    "phone": "+91 98765 11223",
    "password": "securepassword123",
    "idProof": "data:image/png;base64,..."
  }
  ```
- **Response `(201 Created)`**:
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": "authority-102",
      "role": "authority",
      "name": "Vikram Desai",
      "email": "vikram.d@civic.gov",
      "department": "Public Works & Road Maintenance",
      "designation": "Assistant Municipal Engineer",
      "employeeId": "PMC-ENG-2024-88",
      "verificationStatus": "pending_review"
    }
  }
  ```

### 2.4 Authority Login
- **Endpoint**: `POST /api/auth/authority/login`
- **Request Body**:
  ```json
  {
    "email": "priya.nair@civic.gov",
    "password": "authoritypassword"
  }
  ```
- **Response `(200 OK)`**:
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": "authority-1",
      "role": "authority",
      "name": "Commissioner Priya Nair",
      "email": "priya.nair@civic.gov",
      "department": "Central Civic Operations Command",
      "designation": "Senior Municipal Commissioner",
      "employeeId": "BBMP-COMM-001"
    }
  }
  ```

---

## 3. Complaint Management API Endpoints

### 3.1 Fetch Complaints
- **Endpoint**: `GET /api/complaints`
- **Query Params**: `status`, `category`, `priority`, `search`, `citizenId`
- **Headers**: `Authorization: Bearer <token>`
- **Response `(200 OK)`**: Array of complaint objects (see Schema below).

### 3.2 Get Complaint by ID
- **Endpoint**: `GET /api/complaints/:id`
- **Security Rule**:
  - If requester is an `authority`: access granted for any ID.
  - If requester is a `citizen`: access granted **only** if `complaint.citizenId == current_user.id`. Otherwise return `403 Forbidden`.

### 3.3 Create Complaint
- **Endpoint**: `POST /api/complaints`
- **Request Body**:
  ```json
  {
    "title": "Broken drinking water main pipeline leaking on 5th Cross",
    "description": "Potable water pipeline has ruptured beneath sidewalk...",
    "category": "Water Supply",
    "location": "5th Cross Road, Ward 12, Indiranagar",
    "landmark": "Near City Water Overhead Tank",
    "durationDays": 3,
    "latitude": 12.9784,
    "longitude": 77.6408,
    "imagePreview": "base64_or_storage_url"
  }
  ```
- **Backend Responsibility**:
  1. Generate ID in format `CF-YYYY-XXXX` (e.g. `CF-2026-0009`).
  2. Invoke AI / Rule assessment service for risk score (0-100), duplicate check, priority, and department mapping.
  3. Set initial status to `"Registered"`.
  4. Create initial statusHistory record with status `"Registered"`.
  5. Return created complaint object `(201 Created)`.

### 3.4 Update Complaint Status
- **Endpoint**: `PATCH /api/complaints/:id/status`
- **Authorization**: Authority role only (`403 Forbidden` if citizen attempts).
- **5 Valid Statuses**: `Registered`, `Ongoing`, `Waiting List`, `Resolved`, `Denied`
- **Request Body**:
  ```json
  {
    "status": "Ongoing" | "Waiting List" | "Resolved" | "Denied",
    "note": "Crew dispatched to site with excavation equipment.",
    "resolutionNote": "Pipeline replaced, pressure tested, and surface restored."
  }
  ```
  *Note:* When `status` is `"Resolved"` or `"Denied"`, the `resolutionNote` field is mandatory.
- **Response `(200 OK)`**: Updated complaint with appended statusHistory entry.

---

## 4. Intelligent Analysis API Endpoints (AI Module Integration)

### 4.1 Perform Triage Assessment
- **Endpoint**: `POST /api/analysis/assess`
- **Request Body**:
  ```json
  {
    "title": "Uncovered electrical junction box near park",
    "description": "Live wiring exposed at knee height near playground...",
    "category": "Public Safety",
    "location": "Rose Garden Community Park",
    "latitude": 12.9512,
    "longitude": 77.5899
  }
  ```
- **Response `(200 OK)`**:
  ```json
  {
    "priority": "Critical",
    "riskScore": 97,
    "suggestedDepartment": "Public Safety & Municipal Power Inspection",
    "duplicateResult": {
      "isDuplicate": false,
      "candidateId": null,
      "similarityScore": null,
      "note": "No potential duplicate found in local jurisdiction."
    },
    "analysisDetails": {
      "urgencyKeywords": ["live wiring", "exposed", "playground"],
      "confidenceScore": 0.98
    }
  }
  ```

---

## 5. Complaint Schema Definition (SQLite / SQLAlchemy Model)

```python
class Complaint(db.Model):
    __tablename__ = 'complaints'

    id = db.Column(db.String(32), primary_key=True) # e.g. CF-2026-0001
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(64), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    landmark = db.Column(db.String(255), default='Nil')
    duration_days = db.Column(db.Integer, default=1)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    citizen_id = db.Column(db.String(64), nullable=False)
    citizen_name = db.Column(db.String(128), nullable=False)
    citizen_email = db.Column(db.String(128), nullable=False)
    citizen_phone = db.Column(db.String(32), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(32), default='Registered') # Registered | Ongoing | Waiting List | Resolved | Denied
    priority = db.Column(db.String(32), default='Medium') # Low | Medium | High | Critical
    risk_score = db.Column(db.Integer, default=50) # 0 - 100
    suggested_department = db.Column(db.String(128), nullable=False)
    resolution_note = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.Text, nullable=True)
    status_history = db.Column(db.JSON, nullable=False) # List of audit event objects
```
