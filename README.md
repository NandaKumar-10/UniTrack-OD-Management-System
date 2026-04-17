# UniTrack

UniTrack is a full-stack student activity tracking system built for academic departments. It helps students submit OD applications and achievements, allows faculty to review and monitor student activity, and gives admins tools to manage faculty, publish events, and generate monthly PDF reports.

## Overview

The project is split into:

- `frontend/`: React + Vite client application
- `backend/`: Express + MongoDB REST API

The system supports three user roles:

- `Student`: register, log in, apply for OD, and log achievements
- `Faculty`: review OD requests and track student activity
- `Admin`: create faculty accounts, manage events, and generate reports

## Features

### Student

- Student self-registration
- Login with JWT-based authentication
- View dashboard stats
- Submit OD applications
- Track OD approval status
- Submit and view achievements
- View recent department events

### Faculty

- Login to faculty portal
- View faculty dashboard summary
- Review pending OD applications
- Approve or reject OD requests
- Track registered students and their activity counts

### Admin

- Create new faculty accounts
- Publish, edit, and delete department events
- View monthly summary statistics
- Export summary report as PDF

## Tech Stack

### Frontend

- React
- React Router DOM
- Vite
- Lucide React
- jsPDF
- jspdf-autotable

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JSON Web Token
- dotenv
- CORS

## Project Structure

```text
IPMiniProject-main/
|-- backend/
|   |-- models.js
|   |-- server.js
|   |-- package.json
|   `-- .env
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |   `-- Layout.jsx
|   |   |-- pages/
|   |   |   |-- admin/
|   |   |   |-- faculty/
|   |   |   `-- student/
|   |   |-- App.jsx
|   |   `-- main.jsx
|   `-- package.json
`-- README.md
```

## Backend Data Models

The backend defines four main collections:

- `User`: stores name, email, password, and role
- `OD`: stores student OD application details and approval status
- `Achievement`: stores student achievement submissions
- `Event`: stores department event announcements

## API Summary

### Authentication

- `POST /api/register`: create student account
- `POST /api/login`: authenticate user and issue JWT

### Student APIs

- `GET /api/student/dashboard`
- `GET /api/student/ods`
- `POST /api/student/ods`
- `GET /api/student/achievements`
- `POST /api/student/achievements`

### Faculty APIs

- `GET /api/faculty/dashboard`
- `GET /api/faculty/ods`
- `PATCH /api/faculty/ods/:id`
- `GET /api/faculty/students`

### Admin APIs

- `POST /api/admin/faculty`
- `GET /api/admin/events`
- `POST /api/admin/events`
- `PUT /api/admin/events/:id`
- `DELETE /api/admin/events/:id`
- `GET /api/admin/summary`

## Setup Instructions

### 1. Extract and open the project

Make sure the project folder contains both `frontend` and `backend`.

### 2. Configure backend environment variables

Create a `.env` file inside `backend/` with:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Start backend server

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start frontend

```bash
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

## Default Credentials

On first backend startup, if the database is empty, the app seeds:

- Admin: `admin@test.com` / `password`
- Faculty: `faculty@test.com` / `password`

Students can create their own account using the registration page.

## Important Notes

- The frontend currently calls the backend at `http://localhost:5000`.
- Authentication is handled using JWT stored in local storage.
- Passwords are stored as plain text in the current implementation and should be hashed before production use.
- MongoDB Atlas is required for the backend to connect successfully.

## Future Improvements

- Add password hashing with `bcrypt`
- Add route guards for unauthorized frontend access
- Move API base URL to environment variables
- Add form validation and error handling improvements
- Add tests for frontend and backend
- Improve role-based security and session handling

## Author

This project appears to be built as a mini project for student activity and department event management using the MERN-style stack.