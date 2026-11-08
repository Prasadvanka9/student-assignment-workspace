# 🎓 Student Assignment Workspace

> A modern, responsive, full-stack academic productivity dashboard designed for college students to organize coursework, track deadlines, manage subjects, and monitor academic performance in real time.

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%26%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%26%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Security-JWT%20%26%20Bcrypt-black?logo=jsonwebtokens)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Problem Statement](#-problem-statement)
3. [Objectives](#-objectives)
4. [Key Features](#-key-features)
5. [Technology Stack](#-technology-stack)
6. [System Architecture](#-system-architecture)
7. [Database Schema Design](#-database-schema-design)
8. [REST API Documentation](#-rest-api-documentation)
9. [Installation & Setup Guide](#-installation--setup-guide)
10. [Environment Variables](#-environment-variables)
11. [How to Run the Application](#-how-to-run-the-application)
12. [Demo Credentials](#-demo-credentials)
13. [Project Directory Structure](#-project-directory-structure)
14. [Screenshots & UI Walkthrough](#-screenshots--ui-walkthrough)
15. [Future Enhancements](#-future-enhancements)
16. [Academic Submission & Portfolio Details](#-academic-submission--portfolio-details)

---

## 📖 Project Overview

**Student Assignment Workspace** is a full-stack web application tailored specifically for undergraduate and graduate college students. Balancing multiple courses, laboratory exercises, group assignments, and exams often results in missed deadlines and academic stress. 

This platform bridges that gap by offering a clean, SaaS-style workspace where students can:
- Centralize all assignments across various curriculum modules.
- Track impending submission deadlines with real-time dynamic countdowns.
- Categorize assignments by status (Pending, In Progress, Completed, Overdue).
- Prioritize high-weight tasks (High, Medium, Low).
- View dynamic statistics computed directly from the database without any hardcoded mock data.

---

## ❓ Problem Statement

University coursework is inherently distributed across syllabi, email notices, LMS announcements, and classroom discussions. Students frequently experience:
- **Disorganized Deadlines:** Missing important submission dates due to fragmented task management.
- **Cognitive Overload:** Inability to prioritize tasks based on urgency and priority levels.
- **Lack of Progress Visibility:** No clear visual representation of completion ratios across different academic subjects.
- **Cluttered Tooling:** Existing enterprise tools (e.g. Jira, Asana) are overly complex for simple academic tracking, whereas basic note-taking apps lack real-time status automation and deadline alerting.

---

## 🎯 Objectives

1. Deliver an intuitive, user-friendly, responsive single-page web app built with React.js and Vite.
2. Develop a secure, RESTful backend powered by Express.js and Node.js.
3. Establish robust data persistence using MongoDB and Mongoose with user-scoped isolation.
4. Implement secure JSON Web Token (JWT) authentication and Bcrypt password hashing.
5. Provide automatic calculation of academic completion rates, due-today tasks, and overdue flags.
6. Provide an zero-configuration embedded database fallback for effortless grading, local demonstration, and portfolio reviews.

---

## ✨ Key Features

### 1. Modern SaaS-Style Dashboard
- **Personalized Welcome Banner:** Greets the student by name with contextual advice based on current overdue/pending tasks.
- **Live Statistics Cards:**
  - Total Enrolled Assignments
  - Pending Tasks
  - Completed Assignments
  - Overdue Submissions
  - Overall Academic Completion Rate (%) with an animated progress bar.
- **Upcoming Deadlines Widget:** Displays immediate upcoming assignments with color-coded urgency.
- **Recent Activity Feed:** Shows newly created assignments.

### 2. Assignment Management (Full CRUD)
- **Create:** Add new assignments with title, subject, optional description, due date, priority, and initial status.
- **Read:** View assignments in responsive grid cards or categorized views.
- **Update:** Edit any assignment detail via an intuitive modal dialog.
- **Delete:** Safely remove assignments with a confirmation warning modal preventing accidental data loss.
- **Quick Status Toggle:** One-click toggle between `Completed` and `Pending` with instant optimistic UI updates.

### 3. Smart Filtering & Real-Time Search
- **Instant Keyword Search:** Real-time search across titles, subject tags, and detailed notes.
- **Subject Filter:** Dynamic dropdown populated with course subjects.
- **Priority Filter:** Filter by High, Medium, or Low urgency.
- **Status Filter:** Switch between All, Pending, In Progress, Completed, or Overdue.
- **Sorting Options:** Sort by Nearest Deadline (ascending), Furthest Deadline, Newest Created, or Highest Priority.
- **One-Click Filter Reset:** Quickly clear all search queries and filters.

### 4. Deadline Tracking
- **Due Today:** Immediate warning color badge for assignments due before 11:59 PM today.
- **Overdue Indicator:** Prominent red badge and side border highlighting assignments past their due date.
- **Upcoming Schedule:** Clean chronological timeline of upcoming due dates.
- **Friendly Humanized Dates:** e.g., "Due Tomorrow", "Due in 3 days", "Overdue by 2 days".

### 5. Subject Organization
- **Preset Subjects Included:**
  - React.js
  - JavaScript
  - Data Analytics
  - Computer Networks
  - Machine Learning
  - Operating Systems
- **Custom Subjects:** Students can type and add their own curriculum modules on the fly.
- **Subject Analytics:** Interactive cards displaying total tasks, pending/completed counts, and completion progress bars per subject.

### 6. Authentication & Security
- **Student Registration:** Sign up with name, valid university email, and password.
- **Secure Login:** Authenticate with encrypted password verification.
- **JWT Protection:** Authorization headers with bearer tokens validate every API request.
- **Strict Data Isolation:** Students can only view, modify, or delete their own coursework records.

---

## 🛠 Technology Stack

### Frontend
- **Library:** React 18 (Functional Components, Hooks)
- **Build Tool:** Vite (Ultra-fast HMR and bundling)
- **Language:** JavaScript (ES6+ strictly, no TypeScript)
- **Routing:** React Router v6 (`react-router-dom`)
- **HTTP Client:** Axios (Interceptors for Bearer Token injection & 401 handling)
- **Icons:** Lucide React (`lucide-react`)
- **Styling:** Custom CSS3 Design System with CSS variables, responsive flexbox/grid, and modern glassmorphic accents.

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js (REST API, Express Router)
- **Language:** JavaScript
- **Database:** MongoDB & Mongoose ODM
- **Authentication:** JSON Web Tokens (`jsonwebtoken`)
- **Password Security:** `bcryptjs` (Salt rounds = 10)
- **CORS & Environment:** `cors`, `dotenv`

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                      │
│     React 18 + Vite SPA (Components, Context, Hooks)    │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP Requests (Axios)
                             │ [Bearer JWT in Header]
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   Express.js REST API                   │
│   ┌─────────────────────┐       ┌───────────────────┐   │
│   │   Auth Middleware   │ ───►  │ Error Middleware  │   │
│   └──────────┬──────────┘       └───────────────────┘   │
│              ▼                                          │
│   ┌─────────────────────┐       ┌───────────────────┐   │
│   │   Auth Controller   │       │ Assign Controller │   │
│   └──────────┬──────────┘       └─────────┬─────────┘   │
└──────────────┼────────────────────────────┼─────────────┘
               ▼                            ▼
┌─────────────────────────────────────────────────────────┐
│                      Mongoose ODM                       │
│             User Model   &   Assignment Model           │
└────────────────────────────┬────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    MongoDB Database                     │
│    (Local Instance, MongoDB Atlas, or Embedded Engine)  │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄 Database Schema Design

### 1. Users Collection (`User`)

| Field | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto-generated PK | Unique student record identifier |
| `name` | String | Required, Trim, Max: 50 | Student's full name |
| `email` | String | Required, Unique, Trim, Lowercase | University email address |
| `password` | String | Required, Min: 6 | Bcrypt-hashed password |
| `createdAt` | Date | Default: `Date.now` | Account registration timestamp |

### 2. Assignments Collection (`Assignment`)

| Field | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto-generated PK | Unique assignment record identifier |
| `title` | String | Required, Trim, Max: 120 | Descriptive assignment title |
| `subject` | String | Required, Trim, Max: 60 | Subject or course name |
| `description` | String | Trim, Optional | Instructions, reference links, notes |
| `dueDate` | Date | Required | Target submission date |
| `priority` | String | Enum: `['High', 'Medium', 'Low']` | Priority level (Default: `'Medium'`) |
| `status` | String | Enum: `['Pending', 'In Progress', 'Completed']` | Status (Default: `'Pending'`) |
| `userId` | ObjectId | Ref: `'User'`, Required, Indexed | Foreign key link to student owner |
| `createdAt` | Date | Default: `Date.now` | Creation timestamp |
| `updatedAt` | Date | Default: `Date.now` | Last update timestamp |

---

## 📡 REST API Documentation

### Base URL: `http://localhost:5000/api`

### 1. Authentication Endpoints

#### `POST /auth/register`
- **Access:** Public
- **Description:** Registers a new student account.
- **Request Body:**
```json
{
  "name": "Alex Johnson",
  "email": "alex@university.edu",
  "password": "password123"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "6af0419313931905cd5e7b3e",
    "name": "Alex Johnson",
    "email": "alex@university.edu",
    "createdAt": "2026-11-08T09:32:03.396Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Student account registered successfully"
}
```

#### `POST /auth/login`
- **Access:** Public
- **Description:** Authenticates credentials and returns a JWT token.
- **Request Body:**
```json
{
  "email": "alex@university.edu",
  "password": "password123"
}
```

#### `GET /auth/me`
- **Access:** Private (Requires `Bearer <token>`)
- **Description:** Fetches the logged-in student's profile.

---

### 2. Assignment Endpoints (Protected by JWT)

#### `GET /assignments`
- **Access:** Private
- **Query Parameters:**
  - `search` (string): Search query for title, subject, or description
  - `subject` (string): Filter by specific subject
  - `priority` (string): `High` | `Medium` | `Low`
  - `status` (string): `Pending` | `In Progress` | `Completed` | `Overdue`
  - `sort` (string): `deadline-asc` | `deadline-desc` | `newest` | `priority`
- **Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [ ... ]
}
```

#### `GET /assignments/stats/summary`
- **Access:** Private
- **Description:** Calculates real-time database statistics for the student dashboard.
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 6,
    "completed": 2,
    "pending": 3,
    "inProgress": 1,
    "overdue": 1,
    "dueToday": 1,
    "completionRate": 33,
    "upcomingDeadlines": [ ... ],
    "recentAssignments": [ ... ],
    "subjectsDistribution": {
      "React.js": 2,
      "Machine Learning": 1
    }
  }
}
```

#### `POST /assignments`
- **Access:** Private
- **Request Body:**
```json
{
  "title": "Build React Components",
  "subject": "React.js",
  "description": "Implement reusable cards and hooks.",
  "dueDate": "2026-11-15",
  "priority": "High",
  "status": "Pending"
}
```

#### `GET /assignments/:id`
- **Access:** Private
- **Description:** Retrieves a single assignment by ID (scoped to owner).

#### `PUT /assignments/:id`
- **Access:** Private
- **Description:** Updates assignment fields (scoped to owner).

#### `PATCH /assignments/:id/status`
- **Access:** Private
- **Description:** Quick updates the status of an assignment.
- **Request Body:**
```json
{
  "status": "Completed"
}
```

#### `DELETE /assignments/:id`
- **Access:** Private
- **Description:** Permanently deletes an assignment.

---

## 🚀 Installation & Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18.x or later installed)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- Optional: Local MongoDB Server or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (if not using the built-in embedded engine).

### Step 1: Clone or Open the Repository
```bash
git clone https://github.com/your-username/student-assignment-workspace.git
cd student-assignment-workspace
```

### Step 2: Install Dependencies
Install dependencies for both backend and frontend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

Or run the root helper:
```bash
npm run install:all
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` folder (a `.env.example` file is provided):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/student_assignment_workspace
JWT_SECRET=student_workspace_jwt_super_secret_key_2026
NODE_ENV=development
```

> **Note on Zero-Config Database Fallback:**  
> If you do not have a local MongoDB daemon running on port 27017, the application automatically starts an embedded zero-config MongoDB instance on port 27018. This guarantees the application works out-of-the-box without manual database configuration!

---

## 💻 How to Run the Application

### Option A: Run Backend & Frontend Concurrently

Open two terminal windows:

#### Terminal 1: Backend API
```bash
cd backend
npm run dev
```
*Backend runs on: `http://localhost:5000`*

#### Terminal 2: Frontend Client
```bash
cd frontend
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

### Step 3 (Optional): Seed Sample Academic Coursework
To populate the database with realistic sample assignments across subjects:
```bash
cd backend
npm run seed
```

---

## 🔑 Demo Credentials

For quick evaluation and testing, you can use the pre-configured student account or register your own:

- **Email:** `student@university.edu`
- **Password:** `password123`

*(A one-click "Auto-fill Demo Student Credentials" button is also provided on the Login screen!)*

---

## 📁 Project Directory Structure

```
student-assignment-workspace/
├── .gitignore                    # Git ignore file for secrets, dependencies, logs
├── package.json                  # Root npm configuration with helper scripts
├── README.md                     # Comprehensive project documentation
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & embedded server fallback
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Me handlers
│   │   └── assignmentController.js# CRUD, filtering, & stats handlers
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & route protection
│   │   └── errorMiddleware.js    # 404 & error handling middleware
│   ├── models/
│   │   ├── User.js               # User Mongoose schema & bcrypt hooks
│   │   └── Assignment.js         # Assignment Mongoose schema & indexes
│   ├── routes/
│   │   ├── authRoutes.js         # Express router for authentication
│   │   └── assignmentRoutes.js   # Express router for assignments
│   ├── server.js                 # Main Express server entry point
│   ├── seeder.js                 # Database seeder with sample coursework
│   ├── test-api.js               # Automated 10-step API verification suite
│   ├── package.json              # Backend dependencies
│   ├── .env.example              # Environment variables template
│   └── .env                      # Local environment configuration
│
└── frontend/
    ├── index.html                # HTML5 template with Inter/Jakarta fonts
    ├── vite.config.js            # Vite configuration with API proxy
    ├── package.json              # Frontend dependencies
    └── src/
        ├── assets/               # Static assets & icons
        ├── components/
        │   ├── AssignmentCard.jsx # Reusable assignment card with actions
        │   ├── AssignmentForm.jsx # Create & Edit controlled modal form
        │   ├── AssignmentList.jsx # Responsive grid & empty state renderer
        │   ├── DeadlineSection.jsx# Tabbed deadline urgency tracker
        │   ├── DeleteModal.jsx    # Accessible delete confirmation modal
        │   ├── FilterSection.jsx  # Multi-criteria filtering & search bar
        │   ├── Navbar.jsx         # Header with date & quick actions
        │   ├── PriorityBadge.jsx  # Color-coded urgency badge
        │   ├── SearchBar.jsx      # Live search input with clear trigger
        │   ├── Sidebar.jsx        # Responsive navigation with badge counts
        │   ├── StatCard.jsx       # Rounded KPI card with progress bars
        │   └── StatusBadge.jsx    # Status indicators (Pending, Done, Overdue)
        ├── context/
        │   └── AuthContext.jsx    # JWT auth session & toast manager
        ├── hooks/
        │   └── useAssignments.js  # Custom hook for data fetching & mutations
        ├── pages/
        │   ├── DashboardPage.jsx  # Metrics overview, deadlines, & activity
        │   ├── AssignmentsPage.jsx# Complete assignment directory
        │   ├── DeadlinesPage.jsx  # Time-sensitive deadline tracker
        │   ├── SubjectsPage.jsx   # Course module organization & progress
        │   ├── LoginPage.jsx      # Student login with demo credentials
        │   └── RegisterPage.jsx   # Student signup with validation
        ├── services/
        │   ├── api.js             # Axios instance with auth interceptors
        │   ├── authService.js     # Auth API caller functions
        │   └── assignmentService.js# Assignment API caller functions
        ├── App.jsx                # Router & main application shell
        ├── main.jsx               # React DOM entry point
        └── index.css              # Custom SaaS design system stylesheet
```

---

## 🖼 Screenshots & UI Walkthrough

| Screen | Description |
|---|---|
| **Dashboard** | Dynamic KPI cards (Total, Pending, Completed, Overdue, % Progress), upcoming deadlines, and recent assignments. |
| **Assignment Management** | Filterable cards with priority badges, status controls, one-click done toggle, and edit/delete actions. |
| **Deadline Tracker** | Organized tabs for Upcoming Deadlines, Due Today, Overdue, and Completed tasks. |
| **Subject Hub** | Syllabus progress tracking per course module with completion metrics. |
| **Authentication** | Clean student login and registration cards with form validation and feedback alerts. |

---

## 🔮 Future Enhancements

- [ ] **Email & Push Reminders:** Automated notification emails 24 hours prior to deadline submissions using Nodemailer.
- [ ] **File Attachments:** PDF, DOCX, and code snippet upload attachments via Cloudinary or AWS S3.
- [ ] **Grade Tracking:** Record marks/scores received and calculate aggregate semester GPA.
- [ ] **Calendar View:** Monthly and weekly visual calendar view using FullCalendar.
- [ ] **Dark Mode:** System-aware theme toggle between light mode and dark mode.

---

## 🎓 Academic Submission & Portfolio Details

- **Project Name:** Student Assignment Workspace
- **Domain:** Full-Stack Web Development / Educational Productivity Software
- **Target Audience:** College Students, Teaching Assistants, Academic Mentors
- **Primary Methodologies:** REST API Design, Component-Driven Development (CDD), JWT Authentication, Data Normalization, Responsive Design.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - feel free to use it for educational purposes, submissions, and portfolio showcases.

