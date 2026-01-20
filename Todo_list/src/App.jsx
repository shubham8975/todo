import { useEffect, useState } from "react";
import Todo from "./Component/Todo";
import Login from "./Component/Login";
import Register from "./Component/Register";

// Helper function to decode JWT and extract user data
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    // Extract userId from 'sub' (subject) field
    return {
      userId: decoded.sub,
      username: decoded.username || 'User'
    };
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);

  // Restore login on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        setIsAuthenticated(true);
        setUser(decodedUser);
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  }

  function handleLogin(token) {
    localStorage.setItem("token", token);
    const decodedUser = decodeToken(token);
    if (decodedUser) {
      setIsAuthenticated(true);
      setUser(decodedUser);
    }
  }

  if (!isAuthenticated) {
    return showRegister ? (
      <Register 
        onRegister={handleLogin}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login 
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return <Todo user={user} onLogout={handleLogout} />;
}

export default App;
