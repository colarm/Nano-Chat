import "./Chat.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Chat() {
  const { id } = useParams();
  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/chatroom/${id}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setRoom(data.room);
        } else {
          setRoom(null);
        }
      } catch (err) {
        console.error("Failed to fetch chatroom:", err);
        setRoom(null);
      }
    };

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/message/${id}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessages([]);
      }
    };

    if (id) {
      fetchRoom();
      fetchMessages();
    }
  }, [id]);

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
        <h2>{room ? room.name : `Chat Room ${id}`}</h2>
        <div>
          <button type="button" onClick={() => navigate("/chatroomList")}>
            Back
          </button>
          <button type="button" onClick={() => handleLogout()}>
            Log Out
          </button>
        </div>
      </div>
      <hr />
      <div className="message-list">
        {messages.map((msg, i) => (
          <div className="message" key={i}>
            <img
              src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${msg.user.username}`}
              alt={msg.user.username}
            />
            <div className="message-content">
              <div className="username">{msg.user.username}</div>
              <div className="text">{msg.content}</div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="chat-loading">No messages yet.</p>
        )}
      </div>
      <hr />
      <div className="input-bar">
        <input type="text" placeholder="Type your message..." />
        <button type="button">Send</button>
      </div>
    </div>
  );
}

export default Chat;
