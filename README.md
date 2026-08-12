# El-D7e7

Full-stack e-commerce landing page for El-D7e7 stationery and handcraft supplies.

## Stack

- **Frontend:** React, Vite, CSS Modules, React Router
- **Backend:** Node.js, Express, CORS, dotenv

## Project structure

```
project-root/
├── client/          # React frontend
├── server/          # Express API
└── README.md
```

## Setup

```bash
npm run install:all
```

## Development

Run both frontend and backend:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

Run individually:

```bash
npm run dev:client
npm run dev:server
```

## Environment

Server variables live in `server/.env`:

```
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

The Vite dev server proxies `/api` requests to the backend.
