# PulseClass ⚡

> **Instant Real-Time Classroom Engagement SaaS Platform**  
> Ask the room a question. Get anonymous, real-time responses in seconds. Built for high-velocity teaching environments.

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Socket.io](https://img.shields.io/badge/Socket.io-v4-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6+-47A248?logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-v6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

---

## 🎯 The Problem & Solution

In lectures and workshops, *"Does everyone understand?"* is almost always met with dead silence. Students hesitate to speak up for fear of social exposure, and instructors cannot tell whether the room is engaged or confused.

**PulseClass makes classroom interaction an instantaneous reflex:**
- **Teacher**: Hits `Q` on their keyboard → selects a pre-curated question (e.g., *"Should I move ahead?"*) → presses `Enter`.
- **Student**: The question pops up on their phone or laptop instantly → they tap their response with a single click.
- **Real-Time Insight**: Responses stream anonymously onto the instructor's display with live distribution bars and participation metrics.

---

## ✨ Features

- ⚡ **Sub-200ms Latency**: Built on Socket.io WebSockets for near-instantaneous pulse broadcasting and vote aggregation.
- ⌨️ **Keyboard-First Instructor UX**: Launch pulses in seconds without lifting hands from the keyboard (`Q` to open palette, `1-9` to pick, `Enter` to launch, `C` for custom).
- 📚 **Quick Pulse Library**: 15+ curated pedagogical templates across 5 categories (*Understanding*, *Pace*, *Revision*, *Doubt*, *Feedback*).
- 🔒 **100% Anonymous Voting**: Instructor payloads only ever receive aggregate statistical distributions. Student identity is decoupled from voting data.
- 🛡️ **Duplicate Prevention**: Compound unique indexing on `(poll, student)` guarantees one vote per student per pulse at the database level.
- ⏱️ **Server-Authoritative Timers**: Countdown timers (3s to 30s) are strictly governed by the backend to prevent late or spoofed submissions.
- 📊 **Live Analytics & Post-Session Reports**: Watch bar charts animate live, and access comprehensive post-session engagement reports.
- 📱 **Mobile-First Student UI**: Zero clutter—question appears, single tap to vote, instant confirmation.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (SPA)                       │
│  React 19 · Vite · Tailwind CSS · React Router v7          │
│  Context API (AuthContext, SocketContext, ToastContext)     │
│  Custom Hooks (useKeyboardShortcuts)                        │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               │                               │
        REST API (HTTP)                WebSocket (WSS)
        - Auth & Session CRUD          - Real-Time Events
        - Institute & Classroom        - Live Distribution
        - Analytics Reports            - Timers & Broadcasts
               │                               │
┌──────────────┴───────────────────────────────┴──────────────┐
│                    SERVER LAYER (Node.js)                   │
│  Express 4 · Socket.io 4 · Helmet · CORS · Rate Limiter     │
│  Zod Schema Validation · JWT in httpOnly Cookies            │
│  Role-Based Access Control (RBAC: instructor | student)     │
│  Server-Authoritative Timer Manager (activeTimers map)       │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose ODM
┌──────────────────────────────┴──────────────────────────────┐
│                    DATA LAYER (MongoDB)                     │
│  Collections: Users, Institutes, Classrooms,               │
│               Sessions, Polls, Responses                    │
│  Compound Unique Indexing for Defense-in-Depth Deduplication│
└─────────────────────────────────────────────────────────────┘
```

For complete technical details, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ (v20 recommended)
- **MongoDB** running locally or a MongoDB Atlas connection URI

### 1. Installation

Clone the repository and install dependencies for both client and server:

```bash
git clone https://github.com/naitik-work/PulseClass.git
cd PulseClass

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

In the `server` directory, create a `.env` file (copied from `.env.example`):

```bash
cd ../server
cp .env.example .env
```

Default configuration:
```env
MONGODB_URI=mongodb://localhost:27017/pulseclass
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Database Seeding

Populate the database with realistic demo accounts, an institute, a classroom, and a past completed session:

```bash
npm run seed
```

**Pre-seeded Demo Accounts:**
| Role | Email | Password |
|---|---|---|
| **Instructor** | `instructor@pulseclass.dev` | `Password123!` |
| **Student 1** | `student1@pulseclass.dev` | `Password123!` |
| **Student 2** | `student2@pulseclass.dev` | `Password123!` |
| **Institute** | Apex Institute of Technology | Code: `APEX2026` |
| **Classroom** | CS101: Distributed Systems & Cloud | — |

### 4. Running the Development Servers

Open two terminals:

**Terminal 1 — Backend API & Socket Server:**
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend Application:**
```bash
cd client
npm run dev
# Client starts on http://localhost:5173 (proxies /api and /socket.io to :5000)
```

Visit **`http://localhost:5173`** in your browser!

---

## ⌨️ Keyboard Shortcuts (Instructor View)

| Key | Action |
|---|---|
| <kbd>Q</kbd> | Open Quick Pulse command palette |
| <kbd>1</kbd>–<kbd>9</kbd> | Direct shortcut to launch corresponding template |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Navigate templates in palette |
| <kbd>Enter</kbd> | Launch selected pulse |
| <kbd>C</kbd> | Open Custom Pulse builder |
| <kbd>E</kbd> | Prompt End Session confirmation |
| <kbd>?</kbd> | Toggle Keyboard Shortcuts overlay |
| <kbd>Esc</kbd> | Close active modal or palette |

---

## 🧪 Testing

```bash
# Backend unit & integration test suite
cd server
npm test

# Client production build verification
cd client
npm run build
```

---

## 📁 Repository Structure

```
PulseClass/
├── client/                     # Frontend SPA
│   ├── src/
│   │   ├── components/         # CommandPalette, CustomPulseBuilder, Navbar, UI primitives
│   │   │   └── ui/             # Button, Input, Modal, Card, Badge, Spinner, EmptyState
│   │   ├── context/            # AuthContext, SocketContext, ToastContext
│   │   ├── hooks/              # useKeyboardShortcuts
│   │   ├── layouts/            # AppLayout
│   │   ├── pages/              # LandingPage, Dashboard, SessionPage, Report, etc.
│   │   ├── services/           # REST API client
│   │   ├── App.jsx             # React Router v7 route definitions
│   │   └── index.css           # Tailwind CSS & design tokens
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend API & WebSocket Server
│   ├── src/
│   │   ├── config/             # MongoDB connection, environment config
│   │   ├── controllers/        # Auth, Institute, Classroom, Session controllers
│   │   ├── data/               # pulseTemplates.js (Quick Pulse Library)
│   │   ├── middleware/         # authenticate, authorize, errorHandler, validate
│   │   ├── models/             # User, Institute, Classroom, Session, Poll, Response
│   │   ├── routes/             # REST endpoints
│   │   ├── socket/             # socketHandler.js (WebSocket event handlers & timers)
│   │   ├── utils/              # ApiError, helpers
│   │   ├── validation/         # Zod validation schemas
│   │   ├── seed.js             # Demo database seeder
│   │   └── server.js           # Express app & HTTP/Socket server entry
│   └── package.json
├── docs/                       # In-depth architectural & interview documentation
│   ├── ARCHITECTURE.md         # System design, data flow, scaling
│   ├── PRODUCT.md              # Product requirements & user journeys
│   └── INTERVIEW_GUIDE.md      # Technical interview talking points
└── README.md
```

---

## 📖 Further Documentation

- [Product Documentation](docs/PRODUCT.md)
- [System Architecture](docs/ARCHITECTURE.md)
- [System Design & Interview Guide](docs/INTERVIEW_GUIDE.md)

---

## 📄 License

MIT © [PulseClass](https://github.com/naitik-work/PulseClass)
