import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBetsFrom.css";
import Navbar from "../../components/Navbar/Navbar";
import socket from '../../utils/socket';

export default function MyBets() {
  const [myBets, setMyBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBet, setSelectedBet] = useState(null); 
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  

  useEffect(() => {
    const fetchBets = () => {
      fetch(`${API_BASE_URL}/api/user/bets`, { credentials: "include" })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((text) => {
              throw new Error(`Server responded with ${res.status}: ${text}`);
            });
          }
          return res.json();
        })
        .then((data) => {
          setMyBets(data);
          console.log("MyBetsForm.js | useEffect - ✅ Fetched My Bets:", data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("MyBetsForm.js | useEffect - Error fetching bets:", err);
          setLoading(false);
        });
    };

    fetchBets(); // initial load

    // 👂 Listen for betPlaced event
    const handleBetPlaced = () => {
      console.log('MyBetsForm.js | handleBetPlaced - ⚡ [MyBetsForm] Received betPlaced event — refreshing My Bets...');
      fetchBets(); // Re-fetch when a bet is placed
    };

    socket.on('betsUpdated', handleBetPlaced);

    // Clean up
    return () => {
      socket.off('betsUpdated', handleBetPlaced); // Remove the listener when component unmounts
    };
  }, [API_BASE_URL]);

  const getCardColorClass = (index) =>
    index % 2 === 0 ? "MyBets-bet-card-blue" : "MyBets-bet-card-pink";

  if (loading) return <p>Loading...</p>;

  return (
    <div className="my-bets-container">
      <Navbar />
      <h1 className="MyBets-page-title">
        <span className="MyBets-Pink">My</span>
        <span className="MyBets-Blue">Bets</span>
      </h1>

      {myBets.length > 0 ? (
        <div className="MyBets-bet-list">
          {myBets.map((bet, index) => (
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setModalPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
                setSelectedBet(bet);
                setShowChallengeModal(true);
              }}
              className={`MyBets-bet-card ${getCardColorClass(index)}`}
              key={bet.id || index}
            >
              <h2 className="MyBets-bet-match">{bet.title}</h2>
              <p className="MyBets-bet-amount">Wagered: ${bet.amount}</p>
              <p className="MyBets-bet-description">{bet.option_desc}</p>
              <p className="MyBets-bet-status">
                Status:{" "}
                {new Date(bet.end_date) > new Date()
                  ? "In Progress"
                  : "Completed"}
              </p>
              <p className="MyBets-bet-matched">
                {bet.matched_amount !== undefined &&
                bet.amount !== undefined ? (
                  <>
                    Matched: ${parseFloat(bet.matched_amount).toFixed(2)} of $
                    {parseFloat(bet.amount).toFixed(2)}
                  </>
                ) : (
                  <>Matched data not available</>
                )}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="MyBets-no-bets">
          <p>You haven't placed any bets yet.</p>
          <button className="Place-Bet" onClick={() => navigate("/placebet")}>
            Place Your First Bet!
          </button>
        </div>
      )}

      {showChallengeModal && selectedBet && (
        <div className="mybets-modal-backdrop" onClick={() => setShowChallengeModal(false)}>
          <div className="mybets-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="mybets-close-button" onClick={() => setShowChallengeModal(false)}>×</button>
            <div className="ChallengeDetailsForm">
              <h2 className="ChallengeTitle">{selectedBet.title}</h2>
              <p className="ChallengeDescription">{selectedBet.description}</p>
              <p><strong>Your Wager:</strong> ${parseFloat(selectedBet.amount).toFixed(2)}</p>
              <p><strong>Matched:</strong> {selectedBet.matched_amount
                ? `$${parseFloat(selectedBet.matched_amount).toFixed(2)}`
                : "Not yet matched"}</p>
              <p className="ChallengeEndDate">
                <span>Ends: </span>
                <span className="EndDateBackend">{new Date(selectedBet.end_date).toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}
