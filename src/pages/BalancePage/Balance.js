// Balance.js
import React, { useContext, useState, useEffect } from "react";
import "./Balance.css";
import Navbar from "../../components/Navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { fetchWithAuth } from "../../utils/api";

export default function Balance() {
  const { user: authUser, loading: authLoading, sessionExpired } = useContext(AuthContext);
  const [balanceInfo, setBalanceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    
    if (sessionExpired || (authUser === null && !authLoading)) {
      setLoading(false);
      return;
    }

    
    if (authLoading) {
      return;
    }

    const fetchBalanceDetails = async () => {
      try {
        
        setBalanceInfo({
          username: authUser.username,
          balance: authUser.balance,
          totalWon: authUser.total_won || 0,
          totalLost: authUser.total_lost || 0,
        });
      } catch (err) {
        console.error("Balance.js | useEffect (fetchBalanceDetails) - Error setting balance info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceDetails();
  }, [authUser, authLoading, sessionExpired]);

  if (loading || authLoading) return <div>Loading Account Details...</div>;
  
  if (!balanceInfo || !authUser) return <div>Unable to load account details</div>;

  const handleAddFunds = async () => {
    try {
      
      const res = await fetchWithAuth(`${API_BASE_URL}/api/some/endpoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ someData: 'value' }),
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          
          return;
        }
        alert("🛠 Adding funds will come soon! Contact admin@wannabet.bet for help");
        return;
      }
      
      alert("🛠 Adding funds will come soon! Contact admin@wannabet.bet for help");
    } catch (err) {
      console.error("Balance.js | handleAddFunds - Error:", err);
      alert("🛠 Adding funds will come soon! Contact admin@wannabet.bet for help");
    }
  };

  return (
    <div className="Balance-container">
      <Navbar username={balanceInfo.username} balance={balanceInfo.balance} />

      <main className="Balance-main">
        <h1 className="Balance-title">
          <span className="Balance-Pink-Title">Your</span> 
          <span className="Balance-Blue-Title">Account</span>
        </h1>

        <div className="Balance-card">
          <h2>Current Balance</h2>
          <p className="Balance-amount">${balanceInfo.balance.toFixed(2)}</p>
          <button onClick={handleAddFunds}>➕ Add Funds</button>
        </div>

        <div className="Balance-summary">
          
        </div>
      </main>
    </div>
  );
}