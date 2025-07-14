import React, { useState, useEffect } from 'react';
import './FriendSearchBar.css';

function FriendSearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sentRequests, setSentRequests] = useState(new Set());
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            const fetchResults = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`${API_BASE_URL}/api/user/search?query=${query}`, {
                        credentials: 'include',
                    });
                    const data = await res.json();
                    setResults(data.users);
                } catch (err) {
                    console.error('FriendSearchBar.js | useEffect - Search failed:', err);
                }
                setLoading(false);
            };

            fetchResults();
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounce); // Cancel previous request on new keystroke
    }, [query, API_BASE_URL]);

    const handleSendRequest = async (userId) => {
        try {
            await fetch(`${API_BASE_URL}/api/friend/request/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ receiverId: userId }),
            });
            setSentRequests(prev => new Set(prev).add(userId));
        } catch (err) {
            console.error('FriendSearchBar.js | handleSendRequest - Failed to send friend request:', err);
        }
    };

    return (
        <div className="friend-search-bar">
            <input
                type="text"
                placeholder="Search for users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {loading && <p>Loading...</p>}

            <ul>
                {results.map(user => (
                    <li key={user.user_id}>
                        {user.username}
                        {user.status === 'friend' ? (
                            <span style={{ marginLeft: '1rem', color: 'green' }}>Already Friends</span>
                        ) : user.status === 'requested' || sentRequests.has(user.user_id) ? (
                            <button disabled>Request Sent</button>
                        ) : (
                            <button onClick={() => handleSendRequest(user.user_id)}>
                                Send Friend Request
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FriendSearchBar;
