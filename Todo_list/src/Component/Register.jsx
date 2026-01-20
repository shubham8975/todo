import { useState } from "react";

const API_URL = "http://localhost:8080/auth/register";

function Register({ onRegister, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleRegister() {
    setError("");
    setSuccess("");

    if (!username || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    setLoading(true);

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(async res => {
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Registration failed");
          return;
        }

        setSuccess("✓ Registration successful! Redirecting to login...");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      })
      .catch(() => setError("Server error"))
      .finally(() => setLoading(false));
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join us today</p>
        </div>

        <div className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              placeholder="Choose your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button 
            onClick={handleRegister}
            disabled={loading}
            className="btn-register"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </div>

        <div className="form-footer">
          <p>Already have an account? 
            <button 
              type="button"
              onClick={onSwitchToLogin}
              className="switch-link"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
