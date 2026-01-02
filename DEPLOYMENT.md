# Deployment Instructions for Audio Shop

This document explains how to deploy the Audio Shop project, including where to change URLs for frontend/backend communication, environment variables, and build/run steps.


this is hardcoted
---

## 1. Backend Setup

### a. Environment Variables
- Create a `.env` file in the `backend/` directory (if not present).
- Common variables to set:
  - `PORT` (e.g., 5000)
  - `MONGO_URI` (MongoDB connection string)
  - `JWT_SECRET` (JWT secret key)
  - `CLIENT_ORIGIN` (Frontend URL, e.g., `https://your-frontend-domain.com`)
  - `EMAIL_USER`, `EMAIL_PASS` (Gmail/App Password for emails)
  - `STRIPE_SECRET_KEY` (Stripe secret)
  - Cloud storage (Cloudinary) for uploads on Vercel:
    - `CLOUDINARY_CLOUD_NAME`
    - `CLOUDINARY_API_KEY`
    - `CLOUDINARY_API_SECRET`
  - `BASE_URL` (public base URL for building links in emails; e.g., `https://<your-app>.vercel.app`)

### b. Changing Frontend URL in Backend
- Check `backend/src/config/db.js`, `backend/src/config/uploads.js`, and any controller that sends links to the frontend.
- Also check for `CLIENT_URL` usage in controllers (e.g., for email links).

### c. Install & Run
```sh
cd backend
npm install
npm run start   # or: npm run dev (for development)
```

---

## 2. Frontend Setup

### a. Environment Variables / API URLs
- If using environment variables, create a `.env` file in the `frontend/` directory.
- Common variables:
  - `VITE_API_URL` or similar (the backend API base URL, e.g., `https://your-backend-domain.com/api`)
- If not using `.env`, search in `frontend/src/` for hardcoded URLs (e.g., `http://localhost:5000` or similar) and update them to the production backend URL.

### b. Changing Backend URL in Frontend

You must update the backend API URLs in the following files (search for `http://localhost` or similar):

- `frontend/src/app/_components/home/PremiumAudios/PremiumAudios.jsx`
- `frontend/src/app/_components/home/SampleCards/SampleCards.jsx`
- `frontend/src/app/pages/user/success/index.jsx`
- `frontend/src/app/backendServices/ApiCalls.js`
- `frontend/src/app/pages/admin/logout/index.jsx`
- `frontend/src/app/pages/admin/ChangePassword/ChangePassword.jsx`

There may be other files with hardcoded URLs. Always search for `http://localhost` or `API_URL` or similar patterns in the codebase and update them to your production backend URL.

For example, change:
```js
const API_URL = "http://localhost:8000/api";
```
to:
```js
const API_URL = "https://your-backend-domain.com/api";
```

Or, if using environment variables, set them in `.env` and update the code to use them.

### c. Install & Build
```sh
cd frontend
npm install
npm run build
```
- To serve the frontend, use a static server or deploy to a platform (Vercel, Netlify, etc.).

---

## 3. General Deployment Steps

1. Set all environment variables as described above.
2. Update all URLs in both frontend and backend as needed.
3. Build the frontend and backend.
4. Deploy backend to your server (Node.js hosting, Docker, etc.).
5. Deploy frontend to your static hosting or server.
6. Test the deployed site and API endpoints.

---

## 4. Vercel Deployment (Monorepo)

- Root `vercel.json` builds the Vite frontend (`frontend/`) and the Express API in `/api/index.js`.
- Set Vercel env vars:
  - Frontend:
    - `VITE_API_BASE_URL` → `https://<your-app>.vercel.app/api`
    - `VITE_AUDIO_BASE_URL` → same origin (used by UI)
    - `VITE_MEDIA_BASE_URL` → optional if media served elsewhere
  - API (serverless):
    - `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`
    - `EMAIL_USER`, `EMAIL_PASS`
    - `STRIPE_SECRET_KEY`
    - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
    - `BASE_URL` → `https://<your-app>.vercel.app`
- Vercel storage is ephemeral; this project now uses Cloudinary for audio uploads. The API stores and returns the Cloudinary `secure_url` instead of local filenames.
- Frontend calls can stay relative (`/api/...`) when API and UI are on the same Vercel domain.

---

## 5. Where to Change URLs (Summary)

- **Frontend → Backend URL:**
  - `.env` in `frontend/` (e.g., `VITE_API_URL`)
  - Hardcoded URLs in `frontend/src/app/backendServices/` or similar
- **Backend → Frontend URL:**
  - `.env` in `backend/` (e.g., `CLIENT_URL`)
  - Any place in backend code that sends links to users (e.g., email controllers)

---

## 6. Additional Notes
- Always restart the server after changing environment variables.
- Make sure CORS settings in the backend allow requests from your frontend domain.
- For file uploads, local disk is no longer used on Vercel. Cloudinary hosts files and the API returns the full URL. Email links now point directly to the Cloudinary URL.

---

## 7. Admin Dashboard Caching

- Frontend now uses SWR caching with a global config to avoid refetching on every navigation.
- Data is refetched explicitly only when you trigger refresh or mutate after changes.
- Settings: `revalidateOnFocus=false`, `revalidateOnReconnect=false`, `dedupingInterval=30000`.

---

For any questions, check the `README.md` files in each folder or contact the developer.
