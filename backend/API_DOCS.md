# SmartScholar API Docs

This document provides practical API usage details for frontend and manual testing.

## Base URL

- Local: `http://localhost:3001/api`

## Auth

### POST /auth/login

Request:

```json
{
  "email": "donor@smartscholar.io",
  "password": "Donor@123"
}
```

Response:

```json
{
  "success": true,
  "token": "<jwt>",
  "user": {
    "id": "d1",
    "name": "Global Ed Foundation",
    "email": "donor@smartscholar.io",
    "role": "donor"
  }
}
```

### POST /auth/signup

Request:

```json
{
  "name": "New Student",
  "email": "newstudent@example.com",
  "password": "Student@123",
  "role": "student"
}
```

### GET /auth/me

Headers:

- `Authorization: Bearer <jwt>`

## Donor APIs

- `GET /donors/:donorId/donations`
- `GET /donors/:donorId/total-donated`
- `GET /donors/:donorId/scholarships`
- `GET /donors/:donorId/students-funded`
- `GET /donors/:donorId/donations-by-field`
- `GET /donors/:donorId/donations-over-time`
- `POST /donors/:donorId/donations`

Create donation body:

```json
{
  "amount": 1200,
  "fieldOfStudy": "Computer Science",
  "studentId": "s1",
  "scholarshipId": "sch1"
}
```

## Student APIs

- `GET /students/:id`
- `GET /students/:studentId/applications`
- `GET /students/scholarships/available`
- `GET /students/:studentId/received-funds`
- `POST /students/:studentId/applications`

Create application body:

```json
{
  "scholarshipId": "sch2"
}
```

- `POST /students/:studentId/documents` multipart form-data:
- field `file`: binary file
- field `type`: one of `transcript`, `admission_letter`, `id_proof`, `recommendation`

## Admin APIs

- `GET /admin/students`
- `GET /admin/applications`
- `GET /admin/funds-distributed`
- `GET /admin/students-supported`
- `GET /admin/fund-allocations`
- `PATCH /admin/applications/:id/review`

Review body:

```json
{
  "status": "approved"
}
```

## Institution APIs

- `GET /institution/enrolled-students`
- `POST /institution/verify-enrollment`
- `GET /institution/total-received-funds`

Verify enrollment body:

```json
{
  "studentId": "s1"
}
```

## Verifier APIs

- `GET /verifier/milestones/pending`
- `GET /verifier/milestones`
- `GET /verifier/documents/pending`
- `POST /verifier/milestones/:id/approve`
- `POST /verifier/milestones/:id/release-funds`

## Transactions APIs

- `GET /transactions`
- `GET /transactions/status/:status`

Status values: `pending`, `confirmed`, `completed`, `failed`

## Swagger UI

- UI: `http://localhost:3001/api/docs`
- JSON: `http://localhost:3001/api/openapi.json`
