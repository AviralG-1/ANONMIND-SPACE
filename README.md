<div align="center">

```
░█████╗░███╗░░██╗░█████╗░███╗░░██╗███╗░░░███╗██╗███╗░░██╗██████╗░
██╔══██╗████╗░██║██╔══██╗████╗░██║████╗░████║██║████╗░██║██╔══██╗
███████║██╔██╗██║██║░░██║██╔██╗██║██╔████╔██║██║██╔██╗██║██║░░██║
██╔══██║██║╚████║██║░░██║██║╚████║██║╚██╔╝██║██║██║╚████║██║░░██║
██║░░██║██║░╚███║╚█████╔╝██║░╚███║██║░╚═╝░██║██║██║░╚███║██████╔╝
╚═╝░░╚═╝╚═╝░░╚══╝░╚════╝░╚═╝░░╚══╝╚═╝░░░░╚═╝╚═╝╚═╝░░╚══╝╚═════╝░
░░░░░░░░░░░░░░░░░░░░░░░░░ S P A C E ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

**A safe, anonymous space to talk. No accounts. No judgment. Just people.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)

</div>

---

## What is AnonMind Space?

AnonMind Space is a mental health anonymous chat platform built for people who need to talk — but aren't ready to be seen doing it. There are no accounts to create, no names required, and no history saved to your profile. Just pick a username, walk in, and speak freely.

Whether you're venting about a rough week, going through something heavy, or just want to know someone out there is listening — this is your space.

---

## Features

- **Truly anonymous** — no sign-up, no email, no data tied to you
- **Live group chat** — talk with others in real time in the shared room
- **Private DMs** — message someone one-on-one if you'd rather keep it between you two
- **Crisis detection** — urgent keywords are flagged with a gentle support banner and helpline info
- **Online users list** — see who else is in the room right now
- **Message history** — group chat is persisted so you don't walk into a blank room
- **Duplicate username handling** — if someone's already using your name, you automatically get a unique variation
- **Mental health blog** — a built-in reading space with articles on wellness, coping, and self-care
- **Helplines directory** — quick access to crisis lines and support numbers

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Realtime | Socket.io (WebSockets) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas via Mongoose |
| Icons | Lucide React |

---

## Project Structure

```
anonmind-space/
├── src/
│   ├── pages/
│   │   ├── ChatRooms.tsx        # Main chat UI — group + DM tabs, online users
│   │   ├── Blog.tsx             # Mental health blog listing
│   │   ├── BlogArticle.tsx      # Individual article view
│   │   └── Helplines.tsx        # Crisis lines and support directory
│   ├── data/
│   │   ├── blog.ts              # Blog article content
│   │   └── helplines.ts         # Helpline data
│   ├── services/
│   │   └── WebSocketChatService.ts  # Socket.io client wrapper
│   └── App.tsx                  # Root app + routing
├── backend/
│   ├── server.js                # Express + Socket.io + MongoDB server
│   ├── models/
│   │   └── Message.js           # Mongoose schema for group messages
│   ├── .env                     # Environment variables (not committed)
│   └── .env.example             # Template for required env vars
├── vite.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [MongoDB Atlas](https://mongodb.com/atlas) account (free tier works fine)

### 1. Clone the repo

```bash
git clone https://github.com/AviralG-1/anonmind-space.git
cd anonmind-space
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
FRONTEND_URL=http://localhost:8080
```

Start the backend server:

```bash
npm start
```

### 3. Set up the frontend

In the project root:

```bash
npm install
```

Create a `.env` file in the root:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) and you're in.

---

## Deployment

The recommended setup is **Railway** for the backend and **Vercel** for the frontend.

### Backend → Railway

1. Go to [railway.app](https://railway.app) and create a new project from your GitHub repo
2. Set the root directory to `backend`
3. Add these environment variables in Railway's dashboard:
   ```
   MONGO_URI=your_atlas_uri
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
4. Railway will auto-run `npm start` — grab your generated domain

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) and import your repo
2. Add this environment variable:
   ```
   VITE_BACKEND_URL=https://your-railway-app.up.railway.app
   ```
3. Deploy — Vercel auto-detects Vite

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `PORT` | Port the server listens on (default: 5000) |
| `FRONTEND_URL` | Your deployed frontend URL (for CORS) |

### Frontend (`.env`)

| Variable | Description |
|---|---|
| `VITE_BACKEND_URL` | Your deployed backend URL |

---

## A Note on Privacy

AnonMind Space is built with the intent of being a low-barrier, stigma-free place to talk. No personally identifiable information is required or stored. DMs are not persisted to the database — they exist only for the duration of the session. Group messages are stored to keep the room alive between visits, but contain no user account data.

---

## Contributing

This is a personal project, but suggestions and ideas are welcome. Open an issue if you spot a bug or have a feature in mind.

---

## Made with care by [AviralG-1](https://github.com/AviralG-1)

*Because sometimes you just need somewhere to go.*
