# TCS Frontend (SPA) — FYP (Frontend Only)

## What you asked (implemented)
- Single-page feel, but sidebar navigation **does not scroll**; it swaps right-side content using routes.
- Preloader duration set to **1 second**.
- Animated transitions when opening any section on the right.
- Student Auth (Register/Login) + Tickets module with QR generation.
- Admin Login + Admin Dashboard:
  - Events CRUD (create/edit/delete, mark featured)
  - Tickets list + attendance (check-in)
  - Theme editor (change CSS variables / color scheme)

## Run
```bash
cd frontend
npm install
npm run dev
```

## Notes
- Currently uses **localStorage** as mock DB.
- Later, replace `services/*` with real MERN API calls (Axios instance in `services/api.js`).
