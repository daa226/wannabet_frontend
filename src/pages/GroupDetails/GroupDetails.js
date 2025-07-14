
import React, { useEffect, useState } from 'react';
import ChallengeDetails from '../ChallengeDetails/ChallengeDetails'; 
import Modal from '../../components/modal/Modal'; 
import './GroupDetails.css';

function GroupDetails({ groupId }) {
    const [groupInfo, setGroupInfo] = useState([]);
    const [groupChallenges, setGroupChallenges] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [selectedChallengeId, setSelectedChallengeId] = useState(null);
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const membersRes = await fetch(`${API_BASE_URL}/api/group/${groupId}/members`, { credentials: 'include' });
                const membersData = await membersRes.json();
        
                const challengesRes = await fetch(`${API_BASE_URL}/api/group/${groupId}/challenges`, { credentials: 'include' });
                const challengesData = await challengesRes.json();
        
                setGroupInfo(Array.isArray(membersData) ? membersData : []);
                setGroupChallenges(Array.isArray(challengesData) ? challengesData : []);
                setLoading(false);
            } catch (err) {
                console.error('GroupDetails.js | useEffect (fetchGroupData) - Error fetching group details:', err);
                setLoading(false);
            }
        };
    
        fetchGroupData();
    }, [groupId]);

    if (loading) return <div>Loading group info...</div>;

    return (
      <div>
        <h2 className = "GroupDetails-GroupMemebersTitle">Group Members</h2>
        <div>
          {groupInfo.map((member) => (
            <div className="GroupDetails-members" key={member.user_id}>{member.username}</div>
          ))}
        </div>

        <h2 className="GroupDetails-ChallengesTitle">Challenges in Group</h2>
        <div>
          {Array.isArray(groupChallenges) && groupChallenges.map((challenge) => (
            <div className ="GroupDetails-challenges" key={challenge.challenge_id}>
              <button
                className="challenge-link"
                onClick={() => {
                  setSelectedChallengeId(challenge.challenge_id);
                  setShowChallengeModal(true);
                }}
              >
                {challenge.title}
              </button>
            </div>
          ))}
        </div>

        {showChallengeModal && selectedChallengeId && (
          <Modal onClose={() => setShowChallengeModal(false)}>
            <ChallengeDetails challenge_id={selectedChallengeId} />
          </Modal>
        )}
      </div>
    );
}

export default GroupDetails;
