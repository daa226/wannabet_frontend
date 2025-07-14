import React from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import LoginForm from "./pages/LoginPage/LoginForm";
import RegisterForm from "./pages/RegisterPage/RegisterForm";
import Home from "./pages/Homepage/Home"; 
import MyBetsForm from "./pages/Mybetspage/MyBetsForm";
import Profile from "./pages/ProfilePage/Profile";
import PlaceBet from "./pages/PlaceBetPage/PlaceBet";
import Balance from "./pages/BalancePage/Balance";
import CreateChallenge from "./pages/ChallengeForm/CreateChallenge";
import ProtectedRoute from "./ProtectedRoute";
import ChallengeDetails from "./pages/ChallengeDetails/ChallengeDetails";
import PlaceBetForm from './pages/PlaceBetForm/PlaceBetForm';
import CreateGroup from "./pages/GroupPage/CreateGroup";
import Friend from "./pages/FriendsPage/FriendsPage";
import Chat from "./pages/ChatPage/ChatPage";
import Leaderboard from "./pages/LeaderboardPage/LeaderboardPage";
import SocketManager from "./components/SocketManager";
import useNotificationStore from "./store/notificationStore";
import NotificationBanner from "./components/NotificationBanner/NotificationBanner";
import GroupDetailsPopup from "./components/GroupDetailsPopup/GroupDetailsPopup";


function SessionExpirationHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  
  React.useEffect(() => {
    const handleSessionExpired = () => {
      
      if (location.pathname !== "/login") {
        navigate('/login', { 
          state: { 
            sessionExpired: true,
            message: 'Session expired. Please log in again.' 
          },
          replace: true
        });
      }
    };
    
    window.addEventListener('session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, [navigate, location.pathname]);
  
  return null; 
}

function App() {

  const { notification, clearNotification } = useNotificationStore();

  return (
    <>
      <SessionExpirationHandler />

      <SocketManager />
        {notification && (
          <NotificationBanner
            message={notification}
            onClose={clearNotification}
          />
        )}

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected routes */}
        <Route path="/Home" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        }/>
        <Route path="/MyBets" element={
          <ProtectedRoute><MyBetsForm /></ProtectedRoute>
        }/>
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        }/>
        <Route path="/PlaceBet" element={
          <ProtectedRoute><PlaceBet /></ProtectedRoute>
        }/>
        <Route path="/Balance" element={
          <ProtectedRoute><Balance /></ProtectedRoute>
        }/>
        <Route path="/CreateChallenge" element={
          <ProtectedRoute><CreateChallenge /></ProtectedRoute>
        }/>
        <Route path="/challenge/:challenge_id" element={
          <ProtectedRoute><ChallengeDetails /></ProtectedRoute>
        }/>

        <Route path ="/CreateGroup" element={
          <ProtectedRoute><CreateGroup/></ProtectedRoute>
        }/>

        <Route path="/bet/:challenge_id/:co_id" element={
          <ProtectedRoute><PlaceBetForm/></ProtectedRoute>
          }/>

        <Route path ="/Friend" element={
          <ProtectedRoute><Friend/></ProtectedRoute>
        }/>

        <Route path ="/Chat" element={
          <ProtectedRoute><Chat/></ProtectedRoute>
        }/>

        <Route path ="/Leaderboard" element={
          <ProtectedRoute><Leaderboard/></ProtectedRoute>
        }/>

        <Route path= "/group/:id" element ={
          <ProtectedRoute><GroupDetailsPopup/></ProtectedRoute>
        }/>

        {/* Default route */}

      {/* Redirecting to login for unknown pages  */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;