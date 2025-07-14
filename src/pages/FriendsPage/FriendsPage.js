import React, { useEffect, useState } from 'react';
import FriendSearchBar from '../../components/FriendSearchBar/FriendSearchBar'; 
import './FriendsPage.css'; 
import Navbar from '../../components/Navbar/Navbar'; 
import socket from '../../utils/socket';

function FriendsPage() {
    const [friends, setFriends] = useState([]);
    const [loadingFriends, setLoadingFriends] = useState(true);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchFriends = async () => {
            try {
            const res = await fetch(`${API_BASE_URL}/api/friend/friends`, {
                credentials: 'include',
            });
            const data = await res.json();
            setFriends(data.friends || []);
            } catch (err) {
            console.error('FriendsPage.js | useEffect (fetchFriends) - Error fetching friends:', err);
            }
            setLoadingFriends(false);
        };

        fetchFriends(); // Initial load

        const handleFriendUpdate = () => {
            console.log('FriendsPage.js | useEffect (handleFriendUpdate) - [FriendsPage] friendListUpdated event received — refreshing friends list...');
            fetchFriends();
        };

        socket.on('friendListUpdated', (data) =>{
            console.log('FriendsPage.js | useEffect (handleFriendUpdate) -  [Socket] Friend list update received:', data);
            fetchFriends();
        });

        return () => {
            socket.off('friendListUpdated'); // Clean up socket listener
        };
    }, [API_BASE_URL]);

    const fetchFriends = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/friend/friends`, {
                credentials: 'include',
            });
            const data = await res.json();
            setFriends(data.friends || []);
        } catch (err) {
            console.error('FriendsPage.js | useEffect (fetchFriends) - Error fetching friends:', err);
        }
        setLoadingFriends(false);
    };

    return (
        <> 
        <Navbar />  
          <div className="friends-page-container">
            <h1>Your Friends</h1>

            {loadingFriends ? (
                <p>Loading friends...</p>
            ) : friends.length === 0 ? (
                <p>You have no friends yet. </p>
            ) : (
                <ul className="friends-list">
                    {friends.map(friend => (
                        <li key={friend.friend_id}> {friend.username}</li> 
                      
                    ))}
                </ul>
            )}

            <h2>Find New Friends</h2>
            <FriendSearchBar />
        </div>
    </>
    );
}

export default FriendsPage;
