import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Home from "./App";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import Chat from "./pages/chat/Chat";
import ChatroomList from "./pages/chat/ChatroomList";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/chatroomList" element={<ChatroomList />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
