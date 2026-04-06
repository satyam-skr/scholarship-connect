# SmartScholar Test Credentials

Seeded credentials for local testing:

1. Donor
- Email: `donor@smartscholar.io`
- Password: `Donor@123`
- Role: `donor`
- User ID: `d1`

2. Student
- Email: `student@smartscholar.io`
- Password: `Student@123`
- Role: `student`
- User ID: `s1`

3. Admin
- Email: `admin@smartscholar.io`
- Password: `Admin@123`
- Role: `admin`
- User ID: `admin1`

4. Institution
- Email: `institution@smartscholar.io`
- Password: `Institution@123`
- Role: `institution`
- User ID: `inst1`

5. Verifier
- Email: `verifier@smartscholar.io`
- Password: `Verifier@123`
- Role: `verifier`
- User ID: `v1`

## Quick test flow

1. Login with donor credentials.
2. Open donor dashboard and verify donations/charts load from API.
3. Login with student credentials and verify applications/funds load.
4. Visit `http://localhost:3001/api/docs` and run API calls in Swagger UI with bearer token.
