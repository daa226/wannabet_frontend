import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../../context/AuthContext";
import { fetchWithAuth } from "../../utils/api";
import socket from "../../utils/socket";
import NotificationsBell from "../NotificationsBell/NotificationsBell";
import GlobalSearchBar from "../GlobalSearchbar/GlobalSearchbar";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, refreshUser, setUser } = useContext(AuthContext);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
      });

      if (res.ok) {
        socket.disconnect();
        socket.removeAllListeners();

        setUser(null);
        await refreshUser(true);
        navigate("/login", {
          state: {
            sessionExpired: false,
            message: "You have been logged out.",
          },
          replace: true,
        });
      } else {
        console.error("Navbar.js | handleLogout - Logout failed");
      }
    } catch (err) {
      console.error("Navbar.js | handleLogout - Logout error", err);
    }
  };

  const handleProtectedClick = async (path) => {
    const isValid = await refreshUser();
    if (isValid) {
      navigate(path);
    } else {
      navigate("/login", {
        state: {
          sessionExpired: true,
          message: "Your session has expired. Please log in again.",
        },
        replace: true,
      });
    }
  };

  if (!user) return null;

  return (
    <header className="NavBar-home-header">
      <h1 onClick={() => handleProtectedClick("/Home")} className="NavBar-brand-title">
        <span className="NavBar-pink-text">Wanna</span>
        <span className="NavBar-blue-text">Bet</span>
        <img className="NavBar-logo" src="/Wannabetlogo.png" alt="Logo" />
      </h1>

      <nav className="NavBar-nav-bar">
        <button onClick={() => handleProtectedClick("/Home")}>Home</button>
        <button onClick={() => handleProtectedClick("/CreateChallenge")}>Create Challenge</button>
        <button onClick={() => handleProtectedClick("/CreateGroup")}>Groups</button>
        
        <button onClick={() => handleProtectedClick("/Chat")}>Chat</button>
        <button onClick={() => handleProtectedClick("/Leaderboard")}>Leaderboard</button>
      </nav>

      <div className="NavBar-user-info" ref={dropdownRef}>
        <GlobalSearchBar />
        <NotificationsBell />
        <div className="username-dropdown">
          <button
            className="username-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {user.username} ⌄
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={() => handleProtectedClick("/profile")}>Profile</button>
              <button onClick={() => handleProtectedClick("/balance")}>Wallet</button>
              <button onClick={() => handleProtectedClick("/Friend")}>Friends</button>
              <button onClick ={() => handleProtectedClick("/MyBets")}>My Bets</button>
              <div className="logoutButton"> 
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          )}
        </div>
        <span className="balance">${user.balance?.toFixed(2) || "0.00"}</span>
      </div>
    </header>
  );
}
