import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './GroupDetailsPopup.css';
import ChallengeInLineCard from '../ChallengeInLineCard/ChallengeInLineCard';

const GroupDetailPage = () => {
  const { id } = useParams();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('challenges');

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const resGroup = await fetch(`${API_BASE_URL}/api/group/${id}/name`, { credentials: 'include' });
        const groupData = await resGroup.json();
        setGroup(groupData.groupName);

        const resMembers = await fetch(`${API_BASE_URL}/api/group/${id}/members`, { credentials: 'include' });
        setMembers(await resMembers.json());

        const resInvites = await fetch(`${API_BASE_URL}/api/group/${id}/invites`, { credentials: 'include' });
        setInvites(await resInvites.json());

        const resOwner = await fetch(`${API_BASE_URL}/api/group/${id}/isOwner`, { credentials: 'include' });
        const { isOwner } = await resOwner.json();
        setIsOwner(isOwner);

        const resChallenges = await fetch(`${API_BASE_URL}/api/group/${id}/challenges`, { credentials: 'include' });
        setChallenges(await resChallenges.json());
      } catch (err) {
        console.error('Failed to load group details', err);
      }
    };

    fetchGroupDetails();
  }, [id, API_BASE_URL]);

  const handleInvite = async (username) => {
    await fetch(`${API_BASE_URL}/api/group/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ group_id: id, username }),
    });

    // Refresh data
    const resInvites = await fetch(`${API_BASE_URL}/api/group/${id}/invites`, { credentials: 'include' });
    setInvites(await resInvites.json());
    setQuery('');
    setSearchResults([]);
  };

  const handleLeaveGroup = async () => {
    await fetch(`${API_BASE_URL}/api/group/${id}/leave`, {
      method: 'PUT',
      credentials: 'include',
    });
    window.location.href = '/home';
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/search?query=${encodeURIComponent(value)}&groupId=${id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      setSearchResults(data.users);
    } catch (err) {
      console.error('User search failed:', err);
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <h1 className="group-title">{group?.name}</h1>

      <div className="group-subnav">
        <button onClick={() => setActiveTab('challenges')} className={activeTab === 'challenges' ? 'active' : ''}>Challenges</button>
        <button onClick={() => setActiveTab('leaderboard')} className={activeTab === 'leaderboard' ? 'active' : ''}>Leaderboard</button>
        <button onClick={() => setActiveTab('members')} className={activeTab === 'members' ? 'active' : ''}>Members</button>
      </div>

      <div className="group-wrapper">
        <div className="group-page-container">
          {group && (
            <div className="group-content">
              {activeTab === 'challenges' && (
                <div className="section-card">
                  <p className="section-card-challenge-title">Challenges</p>
                  {challenges.length > 0 ? (
                    <div className="challenge-grid">
                      {challenges.map((c) => (
                        <ChallengeInLineCard key={c.challenge_id} challenge_id={c.challenge_id} />
                      ))}
                    </div>
                  ) : (
                    <p style={{ textAlign: 'center', color: '#888' }}>No active challenges in your group.</p>
                  )}
                </div>
              )}

              {activeTab === 'leaderboard' && (
                <div className="section-card">
                  <p>(Leaderboard coming soon)</p>
                </div>
              )}

              {activeTab === 'members' && (
                <>
                  <div className="section-card">
                    <p className="section-card-challenge-members">Members</p>
                    <ul>
                      {members.map((m) => <li key={m.user_id}>{m.username}</li>)}
                    </ul>
                  </div>

                  {isOwner && (
                    <div className="section-card invite-section">
                      <h3>Invite Users</h3>
                      <input
                        className="group-input"
                        placeholder="Search for users..."
                        value={query}
                        onChange={handleSearchChange}
                      />

                      {loading}

                      <ul className="search-suggestions">
                        {searchResults.map(user => (
                          <li key={user.user_id} style={{ marginBottom: '0.5rem' }}>
                            {user.username}
                            {(user.status === 'none' || user.status === 'friend' || user.status === 'requested') && (
                              <button
                                onClick={() => handleInvite(user.username)}
                                className="create-button"
                                style={{ marginLeft: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                              >
                                Invite
                              </button>
                            )}
                            {user.status === 'group' && (
                              <span style={{ marginLeft: '1rem', color: 'green' }}>Already in Group</span>
                            )}
                            {user.status === 'invited' && (
                              <span style={{ marginLeft: '1rem', color: 'orange' }}>Invite Sent</span>
                            )}
                            {user.status === 'friend' && (
                              <span style={{ marginLeft: '1rem', color: 'blue' }}>Already Friends</span>
                            )}
                            {user.status === 'requested' && (
                              <span style={{ marginLeft: '1rem', color: 'gray' }}>Friend Request Sent</span>
                            )}
                          </li>
                        ))}
                      </ul>

                      <h4 style={{ marginTop: '1rem' }}>Pending Invites:</h4>
                      <ul>
                        {invites.map((inv) => <li key={inv.user_id}>{inv.username}</li>)}
                      </ul>
                    </div>
                  )}

                  <div className="section-card" style={{ textAlign: 'center' }}>
                    <button onClick={handleLeaveGroup} className="create-button leave-button">
                      Leave Group
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GroupDetailPage;


