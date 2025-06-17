import "./App.css";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div className="start-card">
      <h1>Nano Chat</h1>
      <hr />
      <div className="buttonList">
        <button type="button" className="start" onClick={() => navigate('/chat')}>Start Chat</button>
        <button type="button" className="start" onClick={() => navigate('/login')}>Log In</button>
      </div>
    </div>
  );
}

export default App;
