import "./Chat.css";
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate();
  const groupName = "Group Chat Room";

  return (
    <div className="chat-container">
      <div className="chat-title">
        <h2>💬 {groupName}</h2>
        <button type="button" className="back" onClick={() => navigate("/")}>
          Home
        </button>
      </div>
      <hr />

      <div className="message-list">
        <div className="message">
          <img src="https://i.pravatar.cc/40?img=1" alt="User" />
          <div className="message-content">
            <div className="username">Alice</div>
            <div className="text">Hi everyone!</div>
          </div>
        </div>
        <div className="message">
          <img src="https://i.pravatar.cc/40?img=2" alt="User" />
          <div className="message-content">
            <div className="username">Bob</div>
            <div className="text">Hello Alice 👋</div>
          </div>
        </div>
        <div className="message">
          <img src="https://i.pravatar.cc/40?img=1" alt="User" />
          <div className="message-content">
            <div className="username">Alice</div>
            <div className="text">You are welcome!</div>
          </div>
        </div>
        <div className="message">
          <img src="https://i.pravatar.cc/40?img=2" alt="User" />
          <div className="message-content">
            <div className="username">Bob</div>
            <div className="text">You are right</div>
          </div>
        </div>{" "}
        <div className="message">
          <img src="https://i.pravatar.cc/40?img=1" alt="User" />
          <div className="message-content">
            <div className="username">Alice</div>
            <div className="text">Hi everyone!</div>
          </div>
        </div>
        <div className="message">
          <img src="https://i.pravatar.cc/40?img=2" alt="User" />
          <div className="message-content">
            <div className="username">Bob</div>
            <div className="text">Hello Alice 👋</div>
          </div>
        </div>
        <div className="message">
          <img src="https://i.pravatar.cc/40?img=1" alt="User" />
          <div className="message-content">
            <div className="username">Alice</div>
            <div className="text">You are welcome!</div>
          </div>
        </div>
        <div className="message">
          <img src="https://i.pravatar.cc/40?img=2" alt="User" />
          <div className="message-content">
            <div className="username">Bob</div>
            <div className="text">You are right</div>
          </div>
        </div>{" "}
        <div className="message">
          <img src="https://i.pravatar.cc/40?img=1" alt="User" />
          <div className="message-content">
            <div className="username">Alice</div>
            <div className="text">Hi everyone!</div>
          </div>
        </div>
        <div className="message">
          <img src="https://i.pravatar.cc/40?img=2" alt="User" />
          <div className="message-content">
            <div className="username">Bob</div>
            <div className="text">Hello Alice 👋</div>
          </div>
        </div>
        <div className="message">
          <img src="https://i.pravatar.cc/40?img=1" alt="User" />
          <div className="message-content">
            <div className="username">Alice</div>
            <div className="text">You are welcome!</div>
          </div>
        </div>
        <div className="message">
          <img src="https://i.pravatar.cc/40?img=2" alt="User" />
          <div className="message-content">
            <div className="username">Bob</div>
            <div className="text">You are right</div>
          </div>
        </div>{" "}
        <div className="message">
          <img src="https://i.pravatar.cc/40?img=1" alt="User" />
          <div className="message-content">
            <div className="username">Alice</div>
            <div className="text">Hi everyone!</div>
          </div>
        </div>
        <div className="message">
          <img src="https://i.pravatar.cc/40?img=2" alt="User" />
          <div className="message-content">
            <div className="username">Bob</div>
            <div className="text">Hello Alice 👋</div>
          </div>
        </div>
        <div className="message">
          <img src="https://i.pravatar.cc/40?img=1" alt="User" />
          <div className="message-content">
            <div className="username">Alice</div>
            <div className="text">You are welcome!</div>
          </div>
        </div>
        <div className="message">
          <img src="https://i.pravatar.cc/40?img=2" alt="User" />
          <div className="message-content">
            <div className="username">Bob</div>
            <div className="text">You are right</div>
          </div>
        </div>
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
