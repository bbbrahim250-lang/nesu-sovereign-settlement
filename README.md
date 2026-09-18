# NESU — NUR Energy Settlement Unit

Trilingual (EN / FR / AR with full RTL) Expo mobile app for the NESU initiative by Digital-UNI AI Labs,
with a FastAPI + MongoDB backend.

## Structure
- `frontend/` — Expo SDK 57 / expo-router app (Home, Model, Corridors, Compare, Membership, Docs; `/team` console)
- `backend/` — FastAPI API (`/api/memberships`, `/api/memberships/{id}/status`, `/api/admin/*`) + email templates

## Run locally
```bash
# backend
cd backend && cp .env.example .env   # fill values
pip install -r requirements.txt && uvicorn server:app --host 0.0.0.0 --port 8001

# frontend
cd frontend && cp .env.example .env  # set EXPO_PUBLIC_BACKEND_URL
yarn install && yarn expo start
```

## Notes
- `.env` files are intentionally not committed; see the `.env.example` files.
- Email sending uses the Emergent managed email integration (`EMERGENT_EMAIL_KEY`), which only works when
  deployed on Emergent. Off-platform, replace `backend/emailer.send_email` with your own provider.
- The team console is protected by `ADMIN_KEY` (sent as the `X-Admin-Key` header).
