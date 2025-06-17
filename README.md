# 💬 NanoChat - React Chat Room App

**NanoChat** is a lightweight chat application built with React. It supports user registration, login, chat room invitations, and real-time message display.

---

## 📁 Project Structure

```

src/
├── components/           # Shared components & context
│   └── AppContext.js     # Global auth context
│
├── function/             # Utility functions (API calls, helpers, etc.)
│
├── icons/                # Icons and graphic assets
│
├── pages/
│   ├── Chat/             # Chat Room UI
│   │   ├── Chat.jsx
│   │   └── Chat.css
│
│   ├── Main/             # Post-login Home Page
│   │   ├── Main.jsx
│   │   └── Main.css
│
│   └── NotFound/         # Fallback 404 Page
│       ├── NotFound.jsx
│       └── NotFound.css
│
├── App.jsx               # App entry point (routing)
├── index.js              # Renders the app
├── index.css             # Global styles
├── App.css               # App-wide CSS

```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗺️ Route Map

| Path                        | Description                                      |
| --------------------------- | ------------------------------------------------ |
| `/login`                    | Login screen (username/password)                 |
| `/register`                 | Register page (optional invite code)             |
| `/home`                     | Welcome screen after login (continue/start chat) |
| `/chat/:chatId`             | Main chat room view                              |
| `/invite?room=xyz&code=abc` | Invite landing page (join room by code)          |
| `*`                         | Any unknown route → 404 Not Found                |

---

## 🔐 Auth & Access

* Unauthorized access to `/home`, `/chat/:id`, or `/invite` is redirected to `/login`
* Login state is stored in `localStorage` and provided via React Context (`AppContext.js`)

---

## 🧪 Running Tests

```bash
npm test
```

---

## ✅ Features Planned

* [ ] Persistent chat messages (with backend or Firebase)
* [ ] Online users indicator
* [ ] Infinite scroll or pagination for chat history
* [ ] Enhanced invite sharing experience

---

## 🛠️ Tech Stack

* React 18
* React Router
* Context API (for global state)
* Plain CSS / CSS Modules
