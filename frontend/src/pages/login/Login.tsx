import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  return (
    <div className="login-container">
      <h2>Log In</h2>
      <hr />
      <form>
        <div className="form-row">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-row">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Log In</button>
      </form>
      <button type="button" className="back" onClick={() => navigate("/")}>
        Back to Home Page
      </button>
    </div>
  );
}

export default Login;
