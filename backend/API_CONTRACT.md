# SmartScholar Frontend-Compatible API Contract

This contract is extracted from frontend service methods in `frontend/src/services` and DTOs in `frontend/src/types/index.ts`.

## Auth

- `POST /api/auth/login`
  - Request: `{ "email": string, "password": string }`
  - Response success: `{ "success": true, "token": string, "user": User }`
  - Response failure: `{ "success": false, "error": string }`

- `POST /api/auth/signup`
  - Request: `{ "name": string, "email": string, "password": string, "role": "donor"|"student"|"admin"|"institution"|"verifier" }`
  - Response success: `{ "success": true, "token": string, "user": User }`
  - Response failure: `{ "success": false, "error": string }`

- `GET /api/auth/me`
  - Response: `User`

## Donor Service Compatibility

- `GET /api/donors/:donorId/donations` -> `Donation[]`
- `GET /api/donors/:donorId/total-donated` -> `number`
- `GET /api/donors/:donorId/scholarships` -> `Scholarship[]`
- `GET /api/donors/:donorId/students-funded` -> `Student[]`
- `GET /api/donors/:donorId/donations-by-field` -> `{ name: string; value: number }[]`
- `GET /api/donors/:donorId/donations-over-time` -> `{ month: string; amount: number }[]`
- `POST /api/donors/:donorId/donations`
  - Request: `{ "amount": number, "fieldOfStudy": string, "scholarshipId"?: string, "studentId"?: string }`
  - Response: `Donation`

## Student Service Compatibility

- `GET /api/students/:id` -> `Student | null`
- `GET /api/students/:studentId/applications` -> `Application[]`
- `GET /api/students/scholarships/available` -> `Scholarship[]`
- `GET /api/students/:studentId/received-funds` -> `number`
- `POST /api/students/:studentId/applications`
  - Request: `{ "scholarshipId": string }`
  - Response: `Application`
- `POST /api/students/:studentId/documents` (multipart/form-data)
  - Fields: `file`, `type`
  - Response: `Document`

## Admin Service Compatibility

- `GET /api/admin/students` -> `Student[]`
- `GET /api/admin/applications` -> `Application[]`
- `GET /api/admin/funds-distributed` -> `number`
- `GET /api/admin/students-supported` -> `number`
- `GET /api/admin/fund-allocations` -> `FundAllocation[]`
- `PATCH /api/admin/applications/:id/review`
  - Request: `{ "status": "approved" | "rejected" | "under_review" }`
  - Response: `Application`

## Institution Service Compatibility

- `GET /api/institution/enrolled-students` -> `Student[]`
- `POST /api/institution/verify-enrollment`
  - Request: `{ "studentId": string }`
  - Response: `{ "success": true, "studentId": string }`
- `GET /api/institution/total-received-funds` -> `number`

## Verifier Service Compatibility

- `GET /api/verifier/milestones/pending` -> `Milestone[]`
- `GET /api/verifier/milestones` -> `Milestone[]`
- `GET /api/verifier/documents/pending` -> `(Document & { studentName: string })[]`
- `POST /api/verifier/milestones/:id/approve` -> `{ "success": true, "id": string }`
- `POST /api/verifier/milestones/:id/release-funds` -> `{ "success": true, "milestoneId": string, "txHash": string }`

## Transaction Service Compatibility

- `GET /api/transactions` -> `Transaction[]`
- `GET /api/transactions/status/:status` -> `Transaction[]`

## DTO Shapes

`User`, `Student`, `Scholarship`, `Donation`, `Transaction`, `Application`, `Document`, `Milestone`, `FundAllocation` match `frontend/src/types/index.ts` field names exactly.
