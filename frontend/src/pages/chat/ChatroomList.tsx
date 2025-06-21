import "./Chat.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ChatRoom {
  id: number;
  name: string;
  createdAt: string;
}

function ChatroomList() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/chatroom/my", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.rooms)) {
          setRooms(data.rooms);
        } else {
          console.error("Expected array at data.rooms, got:", data);
          setRooms([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load chatrooms", err);
        setRooms([]);
      });
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        navigate("/login");
      } else {
        alert("Logout failed.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Network error.");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-title">
        <h2>📋 My Chatrooms</h2>
        <div>
          <button type="button" onClick={() => handleLogout()}>
            Log Out
          </button>
        </div>
      </div>
      <hr />

      <div className="message-list">
        {rooms.length === 0 ? (
          <div>No chatrooms yet.</div>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="chatroom-card">
              <img
                className="chatroom-avatar"
                src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${room.id}`}
                alt="Room Avatar"
              />
              <div className="chatroom-info">
                <div className="chatroom-name">{room.name}</div>
                <div className="chatroom-meta">
                  Created at: {new Date(room.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                className="chatroom-join-btn"
                onClick={() => navigate(`/chat/${room.id}`)}
              >
                Join
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChatroomList;
