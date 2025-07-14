import React, {useState, useEffect} from 'react';


function FriendButton({ targetUserId }){
    const [relationship, setRelationship] = useState('loading');
    
    useEffect(() => {
        checkRelationship();
    }, [targetUserId]);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


    const checkRelationship = async () => {
        try {
            const [freindRes, requestRest] = await Promise.all([
                fetch(`${API_BASE_URL}/api/friends`,{ credentials: 'include'}),
                fetch(`${API_BASE_URL}/api/friend/requests`,{ credentials: 'include'})
            ]);
            const friendData = await friendsRes.json();
            const requestsData = await requestsRes.json();

            const isFriend = friendsData.friends.includes(targetUserId);
            const sentRequest = requestsData.outgoing.some(req => req.to_user_id === targetUserId);

            if(isFriend){
                setRelationship('friends');
            }else if(sentRequest){
                setRelationship('sent');
            }else{
                setRelationship('none');
            }
        }catch(err){
            console.error('FriendButton.js | checkRelationship - Error checking relationship:', err);
            setRelationship('none');
        }
    };

    const handleAddFriend = async () => {
        try {
            await fetch(`${API_BASE_URL}/api/friend/request`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({receiverId: targetUserId})
            });
            setRelationship('sent');
        }catch (err){
            console.error('FriendButton.js | handleAddFriend - Error sending friend request:', err);
        }
    };

    const handleCancelRequest = async () => {
        try {
            await fetch(`${API_BASE_URL}/api/friend/request`,{
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({receiverId: targetUserId})
            });
            setRelationship('none');
        }catch (err){
            console.error('FriendButton.js | handleCancelRequest - Error cancelling friend request:', err);
        }
    };

    return (
        <div>
          {relationship === 'loading' && <button disabled>Loading...</button>}
          {relationship === 'none' && <button onClick={handleAddFriend}>Add Friend</button>}
          {relationship === 'sent' && <button onClick={handleCancelRequest}>Cancel Request</button>}
          {relationship === 'friends' && <button disabled>✔ Friends</button>}
        </div>
      );

}

export default FriendButton;