import "./App.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/user/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          navigate("/chatroomList");
        }
      })
      .catch(() => {
        // Not logged in or network issue — do nothing
      });
  }, [navigate]);

  return (
    <div className="start-card">
      <h1>Nano Chat</h1>
      <hr />
      <div className="buttonList">
        <button
          type="button"
          className="start"
          onClick={() => navigate("/login")}
        >
          Log In
        </button>
        <button
          type="button"
          className="start"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default App;
