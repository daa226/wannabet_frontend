import React, { useEffect, useState } from 'react';
import './LeaderboardPage.css';
import Navbar from '../../components/Navbar/Navbar';

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [yourRank, setYourRank] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/leaderboard`, {
      credentials: 'include', // include this if you use cookies/session
    })
      .then(res => res.json())
      .then(data => {
        setLeaderboardData(data.topUsers); // make sure your backend sends this
        setYourRank(data.currentUser); 
        console.log("LeaderboardPage.js | useEffect - current user rank", data.currentUser);    // and this for current user
      })
      .catch(err => {
        console.error('LeaderboardPage.js | useEffect - Failed to fetch leaderboard:', err);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="leaderboard-container">
      {yourRank && (
          <div className="your-rank">
            <span>You: {yourRank.username}</span>
            <span>Rank: {yourRank.rank}</span>
            <span>Win %: {yourRank.winRate}%</span>
            <span>Bets Won: {yourRank.wins}/{yourRank.totalBets}</span>
          </div>
        )}
        <h1 className="leaderboard-title">🏆 Platform Leaderboard</h1>
        <div className="leaderboard-header">
          <span>#</span>
          <span>User</span>
          <span>Win %</span>
          <span>Bets Won</span>
          <span>Avatar</span>
        </div>

        {leaderboardData.map((user, index) => (
          <div className="leaderboard-row" key={user.username}>
            <span>{index + 1}</span>
            <span className="username">{user.username}</span>
            <span>{user.winRate}%</span>
            <span>{user.wins}/{user.totalBets}</span>
            <span>{user.avatar}</span>
          </div>
        ))}
      </div>
    </>
  );
}
