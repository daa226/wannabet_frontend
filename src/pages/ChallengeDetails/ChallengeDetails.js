import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ChallengeDetails.css'; 
import Navbar from "../../components/Navbar/Navbar";
import PlaceBetForm from '../PlaceBetForm/PlaceBetForm'; 

const ChallengeDetails = (props) => {
  const params = useParams();
  const challenge_id = props.challenge_id || params.challenge_id; 

  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState(null);
  const [showBetForm, setShowBetForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (!challenge_id) {
      setError("Missing challenge ID");
      return;
    }

    fetch(`${API_BASE_URL}/api/challenge/${challenge_id}/full`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (!data.options) throw new Error("No options found");
        setChallenge(data);
      })
      .catch(err => {
        console.error("ChallengeDetails.js | useEffect - Failed to fetch challenge:", err);
        setError("Failed to load challenge");
      });
  }, [challenge_id]);

  const handleOptionClick = (co_id) => {
    setSelectedOption(co_id);
    setShowBetForm(true);
  };

  if (error) return <div className="ChallengeError">{error}</div>;
  if (!challenge || !Array.isArray(challenge.options)) return <div>Loading...</div>;

  return ( 
    <> 
      {!props.challenge_id && <Navbar />} 

      <div className="ChallengeDetailsForm">
        <h2 className="ChallengeTitleContainer">
          <span className="ChallengeTitle">Challenge Title:</span> 
          <span className="ChallengeTitleBackend">{challenge.title}</span>
        </h2>

        <p className="ChallengeDescriptionContainer">
          <span className="ChallengeDescription">Challenge Description: </span>
          <span className="ChallengeDescriptionBackend">{challenge.description}</span>
        </p>

        <p className="ChallengeEndDateContainer">
          <span className="ChallengeEndDate">Ends On:</span>
          <span className="EndDateBackend">
            {new Date(challenge.end_date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </p>

        <div className="ChallengeOptionsContainer">
          {challenge.options.map(opt => (
            <button
              key={opt.co_id}
              className="ChallengeOptionButton"
              onClick={() => handleOptionClick(opt.co_id)}
            >
              {opt.option_desc}
            </button>
          ))}
        </div>
      </div>

      {showBetForm && (
        <PlaceBetForm
          challenge_id={challenge_id}
          co_id={selectedOption}
          group_id={challenge.group_id}
          onClose={() => setShowBetForm(false)}
        />
      )}
    </>
  );
};

export default ChallengeDetails;




