import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './UserProfile.css'; // Assuming you have a CSS file for styling
import Navbar from '../Navbar/Navbar';

export default function UserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/profile/${id}`, {
          credentials: 'include'
        });
        const data = await res.json();
  
        // Then check if friend request is already sent
        const checkRes = await fetch(`${API_BASE_URL}/api/friend/request/sent/${id}`, {
          credentials: 'include'
        });
        const checkData = await checkRes.json();
  
        setProfile({ ...data, friendRequestSent: checkData.requestExists });
      } catch (err) {
        console.error('UserProfile.js | fetchProfile - Error:', err);
      }
    };
  
    fetchProfile();
  }, [id]);
  
  
  const sendFriendRequest = async (targetUserId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/friend/request/send`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiverId: targetUserId }), // ✅ match what your controller expects
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert('Friend request sent!');
        setProfile(prev => ({ ...prev, friendRequestSent: true }));
      } else {
        alert(data.message || 'Failed to send friend request.');
      }
    } catch (err) {
      console.error('Error sending friend request:', err);
      alert('Error sending friend request.');
    }
  };
  
  
  
  
  if (!profile) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
  
      <div className="user-profile-page">
        <img
          src={
            profile.profile_pic
              ? `${process.env.REACT_APP_API_BASE_URL}${profile.profile_pic}`
              : '/default-avatar.png'
          }
          alt="Profile"
          className="profile-pic"
        />
  
        <h2>{profile.username}</h2>
        <p>Joined WannaBet: {new Date(profile.date_created).toLocaleDateString()}</p>
        <p>{profile.bio}</p>
  
        {profile.isFriend ? (
            <button>Message</button>
            ) : profile.friendRequestSent ? (
            <button disabled>Friend Request Sent</button>
            ) : (
            <button onClick={() => sendFriendRequest(profile.user_id)}>
                Send Friend Request
            </button>
            )}

      </div>
    </>
  );
  
}
