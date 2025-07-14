import React, { useEffect, useState } from 'react';
import PlaceBetForm from '../../pages/PlaceBetForm/PlaceBetForm';
import './ChallengeInLineCard.css';

const ChallengeInlineCard = ({ challenge_id }) => {
  const [challenge, setChallenge] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/challenge/${challenge_id}/full`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setChallenge(data))
      .catch(err => console.error("Error loading challenge:", err));
  }, [challenge_id]);

  const handleOptionClick = (co_id) => {
    setSelectedOption(co_id);
  };

  if (!challenge) return <div className="challenge-card">Loading...</div>;

  return (
    <div className="challenge-card">
      <p className="challenge-card-title">{challenge.title}</p>
      <p className="challenge-card-description">{challenge.description}</p>
      <p className="challenge-end">
        Ends:{" "}
        {new Date(challenge.end_date).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="challenge-options">
        {challenge.options?.map((opt) => (
          <button
            key={opt.co_id}
            onClick={() => handleOptionClick(opt.co_id)}
            className="challenge-option-button"
          >
            {opt.option_desc}
          </button>
        ))}
      </div>

      {selectedOption && (
        <div className="inline-bet-form">
          <PlaceBetForm
            challenge_id={challenge.challenge_id}
            co_id={selectedOption}
            group_id={challenge.group_id}
            onClose={() => setSelectedOption(null)}
          />
        </div>
      )}
    </div>
  );
};

export default ChallengeInlineCard;
