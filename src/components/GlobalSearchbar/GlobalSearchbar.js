import React, { useState, useEffect, useRef } from 'react';
import './GlobalSearchbar.css';
import { useNavigate } from 'react-router-dom';

const GlobalSearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], bets: [], groups: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const wrapperRef = useRef();

  useEffect(() => {
    const clickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  useEffect(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);

    if (!query.trim()) {
      setResults({ users: [], bets: [], groups: [] });
      setShowDropdown(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/search/global?query=${encodeURIComponent(query)}`, {
          credentials: 'include',
        });
        const data = await res.json();
        setResults({
          users: data.users || [],
          bets: data.bets || [],
          groups: data.groups || [],
        });
        setShowDropdown(true);
      } catch (err) {
        console.error('GlobalSearchBar | Search failed:', err);
      }
    }, 300); // 300ms debounce delay

    setDebounceTimeout(timeout);
  }, [query]);

  const handleNavigate = (type, id) => {
    if (type === 'user') navigate(`/profile/${id}`);
    else if (type === 'bet') navigate(`/Challenge/${id}`);
    else if (type === 'group') navigate(`/group/${id}`);
    setShowDropdown(false);
  };

  return (
    <div className="global-search-wrapper" ref={wrapperRef}>
      <input
        type="text"
        placeholder="Search users, bets, groups..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="global-search-input"
      />

      {showDropdown && (
        <div className="global-search-results">
          {results.users.length > 0 && (
            <div className="search-category">
              <strong>Users</strong>
              {results.users.map((user) => (
                <div key={user.user_id} onClick={() => handleNavigate('user', user.user_id)}>
                  {user.username} {user.isFriend && <span>(Friend)</span>}
                </div>
              ))}
            </div>
          )}

          {results.bets.length > 0 && (
            <div className="search-category">
              <strong>Bets</strong>
              {results.bets.map((bet) => (
                <div key={bet.challenge_id} onClick={() => handleNavigate('bet', bet.challenge_id)}>
                  {bet.title}
                </div>
              ))}
            </div>
          )}

          {results.groups.length > 0 && (
            <div className="search-category">
              <strong>Groups</strong>
              {results.groups.map((group) => (
                <div key={group.group_id} onClick={() => handleNavigate('group', group.group_id)}>
                  {group.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearchBar;
