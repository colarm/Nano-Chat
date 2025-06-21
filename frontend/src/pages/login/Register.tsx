import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username: username.toLowerCase(), password }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        {success && (
          <p className="success">Registered successfully! Redirecting...</p>
        )}
        <button type="submit">Register</button>
      </form>
      <button
        type="button"
        className="sub-button"
        onClick={() => navigate("/login")}
      >
        Already have an account? Log In
      </button>
      <button
        type="button"
        className="sub-button"
        onClick={() => navigate("/")}
      >
        Back to Home Page
      </button>
    </div>
  );
}

export default Register;
