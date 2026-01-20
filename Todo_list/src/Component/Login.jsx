import { useState } from "react";

const API_URL = "http://localhost:8080/auth/login";

function Login({ onLogin, onSwitchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setError("");
    
    if (!username || !password) {
      setError("Please enter username and password");
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
    setError(data.message || "Login failed");
    return;
  }

  onLogin(data.token); // Pass token to App.jsx
})

      
     




      .catch(() => setError("Server error"))
      .finally(() => setLoading(false));
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Login to your account</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            onClick={handleLogin}
            disabled={loading}
            className="btn-login"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="form-footer">
          <p>Don't have an account? 
            <button 
              type="button"
              onClick={onSwitchToRegister}
              className="switch-link"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
