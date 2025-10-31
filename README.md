# Inventro

Inventro is a full-stack inventory management application built with React (frontend) and Express.js (backend), using MongoDB for data storage. It supports user authentication, product management, and provides a modern UI for managing inventory.

## Features
- User registration, login, and authentication (JWT, cookies)
- Product CRUD: add, edit, delete, view products
- Dashboard with inventory stats
- Low stock and out-of-stock alerts
- Category and status filtering
- Responsive design with Tailwind CSS

## Project Structure
```
Inventro/
├── backend/         # Express.js API server
│   ├── app.js
│   ├── package.json
│   ├── .env         # Backend environment variables (not committed)
│   └── ...
├── frontend/        # React + Vite frontend
│   ├── src/
│   ├── package.json
│   ├── .env         # Frontend environment variables (not committed)
│   └── ...
└── README.md        # Project documentation
```

## Deployment
### Backend (Render Web Service)
- Deploy the `backend` folder as a Web Service on Render.
- Set environment variables in Render:
  - `MONGODB_URI` (MongoDB Atlas connection string)
  - `JWT_SECRET` (secure random string)
  - `CLIENT_URL` (your deployed frontend URL)
- Build command: `npm install`
- Start command: `npm start`

### Frontend (Render Static Site)
- Deploy the `frontend` folder as a Static Site on Render.
- Set Root Directory to `frontend`.
- Build command: `npm run build`
- Publish directory: `dist`
- Set environment variable in Render:
  - `VITE_API_URL` (your deployed backend API URL, e.g. `https://inventro-pp47.onrender.com/api`)

## Environment Variables
### Backend (`backend/.env`)
```
MONGODB_URI=your-mongodb-atlas-uri
NODE_ENV=production
JWT_SECRET=your-secure-jwt-secret
CLIENT_URL=https://your-frontend.onrender.com
```
### Frontend (`frontend/.env`)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## Usage
- Register and log in as a user.
- Add, edit, and delete products.
- View dashboard for inventory stats.
- Filter products by category and status.

## Development
- Backend: Express.js, Mongoose, JWT, CORS
- Frontend: React, Vite, Axios, Tailwind CSS

## Security
- Sensitive environment variables are stored in `.env` files and are **not committed** to GitHub (see `.gitignore`).
- Authentication uses JWT and cookies.
- CORS is configured for secure frontend-backend communication.

## License
MIT
