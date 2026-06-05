# Personal Task Manager

A full-stack task management web application built with React and Node.js. Users can create, edit, delete, and complete tasks — with drag-and-drop reordering, due date tracking, overdue highlighting, real-time search, and active/completed filtering. All data is persisted in MongoDB Atlas, so tasks survive page refreshes.

---

## Live Demo

| App | URL |
|-----|-----|
| Frontend (Vercel) | https://personal-task-manager-teal.vercel.app |
| Backend API (Vercel) | https://personal-task-manager-419r.vercel.app/api |

---

## Tech Stack

### Frontend
| Tool | Version | Why |
|------|---------|-----|
| React | 19 | Component-based UI, minimal boilerplate |
| Vite | 8 | Instant HMR dev server, fast builds |
| Tailwind CSS | 4 | Utility-first styling without context switching |
| react-icons | 5 | Consistent icon set (Feather icons) with zero config |

### Backend
| Tool | Version | Why |
|------|---------|-----|
| Node.js + Express | 5 | Minimal, unopinionated REST API |
| Mongoose | 9 | Schema validation and clean query API for MongoDB |
| MongoDB Atlas | — | Fully managed cloud database, free tier available |
| dotenv | 17 | Keeps secrets out of source code |
| nodemon | 3 | Auto-restarts server on file changes in development |
| cors | 2 | Allows the Vite dev server to call the Express API |

---

## How to Run Locally

> **Prerequisite:** Node.js ≥ 18 installed. That's it.

### 1. Clone the repo

```bash
git clone https://github.com/arshlankhann/Personal-Task-Manager.git
cd "Personal Task Manager"
```

### 2. Set up the Server

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
MONGODB_URI=<your_mongodb_atlas_connection_string>
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> Don't have a MongoDB URI? Create a free cluster at https://mongodb.com/atlas, then copy the connection string.

Start the server:

```bash
npm run dev
```

Server runs at → `http://localhost:5000`

### 3. Set up the Client

Open a **new terminal**:

```bash
cd client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## API Documentation

Base URL: `http://localhost:5000/api`

All request bodies are JSON. All responses are JSON.

---

### GET `/tasks`

Returns all tasks, sorted by creation date (newest first).

**Query params (optional)**

| Param | Values | Description |
|-------|--------|-------------|
| `status` | `active` \| `completed` | Filter by completion state |
| `search` | any string | Case-insensitive title search |

**Response `200`**
```json
[
  {
    "id": "665f1a2b3c4d5e6f7a8b9c0d",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "dueDate": "2026-06-10",
    "completed": false,
    "order": 1717600000000,
    "createdAt": "2026-06-05T05:00:00.000Z",
    "updatedAt": "2026-06-05T05:00:00.000Z"
  }
]
```

---

### GET `/tasks/:id`

Returns a single task by ID.

**Response `200`** — same shape as a single item above.  
**Response `404`** — `{ "error": "Task not found" }`

---

### POST `/tasks`

Creates a new task.

**Request body**
```json
{
  "title": "Buy groceries",
  "description": "Optional description",
  "dueDate": "2026-06-10"
}
```

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `title` | ✅ | string | Cannot be empty |
| `description` | ❌ | string | Defaults to `""` |
| `dueDate` | ❌ | string `YYYY-MM-DD` | Defaults to `null` |

**Response `201`** — the created task object.  
**Response `400`** — `{ "error": "Title is required" }`

---

### PUT `/tasks/:id`

Updates one or more fields of an existing task.

**Request body** *(all fields optional)*
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "dueDate": "2026-06-15"
}
```

**Response `200`** — the updated task object.  
**Response `400`** — `{ "error": "Title cannot be empty" }`  
**Response `404`** — `{ "error": "Task not found" }`

---

### DELETE `/tasks/:id`

Permanently deletes a task.

**Response `200`**
```json
{ "message": "Task deleted successfully" }
```
**Response `404`** — `{ "error": "Task not found" }`

---

### PATCH `/tasks/:id/toggle`

Flips a task's `completed` status (true → false or false → true).

**Response `200`** — the updated task object.  
**Response `404`** — `{ "error": "Task not found" }`

---

### PATCH `/tasks/reorder`

Bulk-updates task display order for drag-and-drop.

**Request body**
```json
{
  "orderedIds": ["id1", "id2", "id3"]
}
```

**Response `200`**
```json
{ "message": "Tasks reordered successfully" }
```
**Response `400`** — `{ "error": "orderedIds must be an array" }`

---

### GET `/health`

Simple health check.

**Response `200`**
```json
{ "status": "OK", "message": "Task Manager API is running" }
```

---

## Project Structure

```
Personal Task Manager/
├── client/                        # React frontend (Vite)
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx   # Delete confirmation dialog
│   │   │   ├── EmptyState.jsx     # Shown when task list is empty
│   │   │   ├── FilterTabs.jsx     # All / Active / Completed tabs
│   │   │   ├── Header.jsx         # Title, progress bar, active/completed counts
│   │   │   ├── TaskCreationForm.jsx  # Form to add a new task
│   │   │   ├── TaskForm.jsx       # Simple inline quick-add form
│   │   │   ├── TaskItem.jsx       # Single task row (edit, delete, toggle, overdue)
│   │   │   ├── TaskList.jsx       # Renders list + handles drag-and-drop
│   │   │   └── TaskSearch.jsx     # Search input + "New Task" button
│   │   ├── App.jsx                # Root component, state, API calls
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles + modal animation
│   ├── .env                       # VITE_API_BASE_URL
│   └── package.json
│
└── server/                        # Express REST API
    ├── src/
    │   ├── controllers/
    │   │   └── tasks/
    │   │       ├── queries.js     # GET handlers (read operations)
    │   │       ├── mutations.js   # POST / PUT / DELETE handlers
    │   │       ├── actions.js     # PATCH toggle + reorder
    │   │       ├── helpers.js     # Shared response helpers (notFound, badRequest)
    │   │       └── index.js       # Barrel re-export for routes
    │   ├── models/
    │   │   └── Task.js            # Mongoose schema + transform
    │   ├── routes/
    │   │   └── taskRoutes.js      # Express router — maps URLs to controllers
    │   └── utils/
    │       └── db.js              # MongoDB connection (singleton pattern)
    ├── index.js                   # Express app setup, middleware, server start
    ├── .env                       # MONGODB_URI, PORT, CLIENT_URL
    └── package.json
```
