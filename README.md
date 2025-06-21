# Nano-Chat

Nano-Chat is a modern full-stack chat application built with:

* **Frontend**: React (Vite) with TypeScript
* **Backend**: Express + Prisma (MySQL)
* **Real-time**: Socket.IO for WebSocket communication

It features user authentication, protected APIs, chatroom creation/invitation, real-time message delivery, and a component-based frontend interface.

---

## 📁 Project Structure

### Backend (`/backend`)

* `prisma/`: Prisma schema and migrations
* `src/`

  * `middlewares/`: JWT-based authentication logic
  * `routes/`: REST API routes for auth, users, chatrooms, search, and messages
  * `utils/`: Helper utilities like password hashing
  * `socket.ts`: Socket.IO event handling
  * `server.ts`: Express app initialization
* `.env`: Environment variables
* `package.json`, `tsconfig.json`: Backend configs

### Frontend (`/frontend`)

* `public/`: Static public assets
* `src/`

  * `assets/`: Images and static frontend content
  * `components/`: Reusable React components
  * `functions/`: Hooks and utilities (e.g., API fetchers)
  * `pages/`

    * `login/`: Login screen (`Login.tsx`, `Login.css`)
    * `chat/`: Chat interface (`Chat.tsx`, `Chat.css`)
  * `App.tsx`, `main.tsx`: Application entry
* `index.html`: HTML shell
* `vite.config.ts`, `tsconfig.*.json`: Vite and TypeScript configs

---

## 🔐 Backend API Overview

### Authentication

* `POST /api/auth/register` – Register a new user (usernames are stored in lowercase)
* `POST /api/auth/login` – Login with credentials (JWT cookie)
* `POST /api/auth/logout` – Logout and invalidate session

### User & Search

* `GET /api/user/me` – Get logged-in user details
* `GET /api/search/users?q=` – Search users by name
* `GET /api/search/chatroom?q=` – Search chatrooms by name

### Chatroom Management

* `POST /api/chatroom` – Create a new chatroom
* `GET /api/chatroom/my` – List user’s chatrooms
* `GET /api/chatroom/:id` – Get specific chatroom details
* `POST /api/chatroom/invite` – Generate invite link
* `POST /api/chatroom/join/:inviteCode` – Join a chatroom
* `POST /api/chatroom/leave/:id` – Leave a chatroom

### Messaging

* `POST /api/message` – Send message to a room
* `GET /api/message/:roomId` – Fetch messages from a room

---

## 🔌 Real-Time Communication

* Built using **Socket.IO**
* Events handled in `src/socket.ts` include:

  * `joinRoom`
  * `leaveRoom`
  * `chatMessage`
  * `messageReceived`

WebSocket server is bootstrapped in `server.ts`.

---

## 🧠 Database Schema Highlights

Models defined in Prisma:

* `User`: Holds credentials and metadata
* `ChatRoom`: Named conversation spaces
* `ChatRoomUser`: Tracks membership
* `InviteCode`: Unique codes for joining rooms
* `Message`: Stores chat messages

---

## 🚀 Getting Started

### Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

`.env` sample:

```
DATABASE_URL="mysql://user:password@localhost:3306/nanochat"
JWT_SECRET="your-secret"
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173` (default Vite port).

---

## ✅ Status & Roadmap

* ✔ Auth with JWT and cookies
* ✔ REST API for user, chatroom, and messaging
* ✔ WebSocket real-time messaging
* ✔ Vite + React UI with modular components
* ☐ UI/UX enhancements
* ☐ Responsive mobile support
* ☐ Deployment setup (Docker, CI/CD)

---

## 🔍 Testing

Use [Postman](https://www.postman.com/) for API validation. Official collection:

**Postman Collection**:
[Link](https://colarm.postman.co/workspace/Colarm's-Workspace~c7899962-725a-41ed-8c22-e5b24b6bb1cb/collection/46013464-d05d42ee-0ed6-422a-90eb-c8738e8d5bc3)

---

## ℹ️ Notes

* All usernames are lowercase
* Invite codes are URL-safe (generated with `nanoid`)
* Prisma manages all database interaction
* Project is actively maintained
