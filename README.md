# 💬 NanoChat - Full-Stack React + Node Chat App

**NanoChat** is a lightweight, full-stack chat application built with **React**, **Node.js**, and **MySQL (via Prisma ORM)**. It supports user registration, login, invite-based room joining, and real-time-like chat interactions.

---

## 📁 Project Structure

```
Nano-Chat/
├── frontend/                 # React App (Vite)
│   ├── src/
│   │   ├── assets/           # Static images, icons, etc.
│   │   ├── components/       # Shared reusable components
│   │   ├── functions/        # Utility functions
│   │   ├── pages/            # Route-based views
│   │   │   ├── chat/
│   │   │   └── login/
│   │   ├── App.tsx           # App routes & layout
│   │   ├── main.tsx          # Entry point (ReactDOM)
│   │   ├── index.css         # Global styles
│   │   └── App.css           # App-level styling
│   ├── index.html            # Root HTML
│   ├── package.json          # Frontend dependencies
│   └── vite.config.ts        # Vite config
│
├── backend/                  # Node.js + Prisma API
│   ├── prisma/               # Prisma schema + migrations
│   │   └── schema.prisma
│   ├── src/
│   │   └── server.ts         # Main server entry
│   ├── .env                  # DB config (MySQL)
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
```

---

## 🚀 Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

### Backend (API + DB)

```bash
cd backend
npm install

# setup your .env file
cp .env.example .env
# edit the file and set your MySQL credentials

# Generate DB tables
npx prisma migrate dev --name init

# Start server
npm run dev
```

> Make sure your MySQL container is running.

---

## 🗺️ Route Map (Frontend)

| Path                        | Description                                      |
| --------------------------- | ------------------------------------------------ |
| `/login`                    | Login screen                                     |
| `/register`                 | Registration screen                              |
| `/home`                     | Main user dashboard                              |
| `/chat/:chatId`             | Chat room UI                                     |
| `/invite?room=abc&code=xyz` | Join room via invite                             |
| `*`                         | Fallback → 404                                   |

---

## 🔐 Auth Logic

- Auth state stored in `localStorage`
- Managed via React Context (`AppContext.js`)
- Protected routes auto-redirect to `/login`

---

## 🧪 Tests

```bash
npm test      # frontend
```

---

## 🔧 Backend Tech

- Node.js + Express
- Prisma ORM + MySQL
- TypeScript
- dotenv for config

---

## 🛠️ Frontend Tech

- React 18 + React Router
- Vite (dev/build tooling)
- Context API
- Plain CSS (modular structure)

---

## ✅ Features In Progress

- [ ] Persistent chat history (currently local only)
- [ ] User avatars / status indicators
- [ ] Invite via shareable link
- [ ] Prisma-based message model & saving
- [ ] Chat UX improvements (autoscroll, emoji, etc.)

---

## 📦 Docker Support

You can spin up a MySQL container with:

```bash
docker run -d \
  --name nanochatdb \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=nanochat \
  -p 3306:3306 \
  mysql
```

---

## 📚 Prisma Commands

```bash
npx prisma generate       # generate client
npx prisma studio         # open browser UI
npx prisma migrate dev    # apply schema to DB
npx prisma db pull        # introspect existing DB
```

