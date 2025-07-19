// PlaceBet.js
import React, { useState, useContext, useEffect } from "react";
import "./PlaceBet.css";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

export default function PlaceBet() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [userChallenges, setUserChallenges] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    date: "",
    isPublic: true,
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/challenge/group`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setUserChallenges(data);
      })
      .catch(err => {
        console.error("PlaceBet.js | useEffect - Error fetching group challenges:", err);
      });
  }, []);  
  
  
  // const groupBets = [
  //   { id: 1, question: "Will the Dolphins win this Sunday?", group: "NFL Squad" },
  //   { id: 2, question: "Will the Heat make the playoffs?", group: "NBA Fans" },
  //   { id: 3, question: "Will the Yankees win the World Series?", group: "Baseball Lovers" },
  //   { id: 4, question: "Will Messi score in the next match?", group: "Soccer Fans" },
  //   { id: 5, question: "Will the Warriors win the championship?", group: "NBA Squad" },
   
    
  // ];

  const popularBets = [
    { id: 1, question: "Will AI replace coders by 2030?" },
    { id: 2, question: "Is ETH going to break $4k?" },
    { id: 3, question: "Will the Lakers win the championship?" },
  ];

  const handleplacebet = async (path) => {
    navigate(path);
  }
    // alert(" Create a bet function is coming soon! Contact admin@wannabet.bet for help");
    // Open some page to place bet
  

  // Function to determine card color class based on index (alternating pattern)
  const getCardColorClass = (index) => {
    return index % 2 === 0 ? "PlaceBet-card-blue" : "PlaceBet-card-pink";
  };

  return (
    <div className="PlaceBet-container">
      <Navbar/>

      <main className="PlaceBet-main">
        <h1 className="PlaceBet-title">
          <span className="Home-pink-text">Place</span>
          <span className="Home-blue-text"> Your</span>
          <span className="Home-pink-text"> Bet</span>
        </h1>
{/* 
        <button className="PlaceBet-create-button" onClick={() => handleplacebet("/CreateChallenge")}>
          ➕ Create New Challenge
        </button> */}

        <section className="PlaceBet-section">
          <h2>Group Challenges</h2>
          <div className="PlaceBet-grid">
            {userChallenges.map((challenge, index) => (
              <div 
                className={`PlaceBet-card ${getCardColorClass(index)}`} 
                key={challenge.id}
              >
                <p className="PlaceBet-Challenge-title">Wager: {challenge.title}</p>
                {/* <p className="PlaceBet-Challange-GroupName">Group Associated: </p> */}
              </div>
            ))}
          </div>
        </section>

        <section className="PlaceBet-section">
          <h2>Popular Challenges</h2>
          <div className="PlaceBet-grid">
            {popularBets.map((bet, index) => (
              <div 
                className={`PlaceBet-card ${getCardColorClass(index)}`} 
                key={bet.id}
              >
                <p className="PlaceBet-question">{bet.question}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}