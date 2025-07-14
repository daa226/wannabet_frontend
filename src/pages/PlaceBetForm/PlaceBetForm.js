import React, { useState } from 'react';
import './PlaceBetForm.css';
import socket from '../../utils/socket';
import API from '../../api/axios';


const PlaceBetForm = ({ challenge_id, co_id, group_id, onClose }) => {
  const [amount, setAmount] = useState('');
  const [matchedAmount, setMatchedAmount] = useState(null);
  const [status, setStatus] = useState(null);   
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  const payload = { challenge_id, co_id, amount, group_id };

  try {
    const response = await API.post('/api/bet/place', payload);

    const data = response.data;

    console.log("PlaceBetForm.js | handleSubmit - Bet Response:", data);

    setMatchedAmount(data.bet.matched_amount);
    setStatus(data.bet.status);

    socket.emit('betsUpdated');

    setTimeout(() => {
      onClose();
    }, 2500);
  } catch (err) {
    if (err.response) {
      alert(`Error: ${err.response.data.error}`);
    } else {
      alert("Something went wrong placing your bet.");
    }
  }
};



  return (
    <div className="ModalOverlay">
      <div className="ModalContent">
        <button className="CloseButton" onClick={onClose}>×</button>
        <form onSubmit={handleSubmit}>
          <h3>Enter your bet amount</h3>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in USD"
          />
          <button className = "ConfirmBet" type="submit">Confirm Bet</button>
        </form>
        {matchedAmount !== null && (
        <div className="BetMatchResult">
          <p><strong>Matched:</strong> ${Number(matchedAmount).toFixed(2)}</p>
          <p><strong>Status:</strong> {status}</p>
          {status !== 'matched' && (
            <p style={{ color: 'orange' }}>
              Your bet has been placed but is waiting to be mathced by someone bets the opposite side.
            </p>
          )}
        </div>
)}
      </div>
    </div>
  );
};

export default PlaceBetForm;




