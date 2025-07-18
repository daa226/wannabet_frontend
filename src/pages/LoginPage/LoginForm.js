import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import './LoginForm.css'; 
import { AuthContext } from '../../context/AuthContext';
import { fetchWithAuth } from '../../utils/api';

function LoginForm() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [wasSessionExpired, setWasSessionExpired] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, refreshUser } = useContext(AuthContext);

  const sessionExpired = location.state?.sessionExpired;
  const sessionMessage = location.state?.message;

  
  useEffect(() => {
    if (sessionMessage !== undefined) {
      setMessage(sessionMessage);
      setWasSessionExpired(sessionExpired === true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [sessionMessage, sessionExpired, navigate, location.pathname]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage('Logging in...');
  
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });
  
      // Get raw response for debugging
      const raw = await res.text();
      console.log("Login response raw:", raw);
  
      let data;
      try {
        data = JSON.parse(raw); // try parsing as JSON
      } catch (parseError) {
        console.error("LoginForm.js | handleSumbit - Failed to parse JSON response:", parseError);
        throw new Error("LoginForm.js | handleSumbit - Server returned a non-JSON response");
      }
  
      // Check for HTTP error
      if (!res.ok) {
        console.warn("LoginForm.js | handleSumbit - Login failed:", data.message || res.statusText);
        setMessage(data.message || 'Login failed.');
        setWasSessionExpired(false);
        return;
      }
  
      // Success!
      setMessage('Login successful!');
      if (data.user && data.user.user_id) {
        localStorage.setItem('userId', data.user.user_id);
      }
  
      setTimeout(async () => {
        await refreshUser();
        navigate('/Home');
      }, 500);
  
    } catch (err) {
      console.error("LoginForm.js | handleSubmit -", err);
      setMessage('Server error. Please try again later.');
      setWasSessionExpired(false);
    }
  };
  
  

  return (
    <div className="login-background">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
          {message && (
            <p className={`message ${wasSessionExpired ? 'error-message' : ''}`}>
              {message}
            </p>
          )}
          <p className="switch-form">
            Don't have an account?{" "}
            <span onClick={() => navigate('/register')} className="link">
              Register here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
