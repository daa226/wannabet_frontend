import React, { useState, useEffect } from 'react';
import './NotificationsDropdown.css';
import socket from '../../utils/socket';

function NotificationsDropdown({ notifications }) {
  const [localNotifications, setLocalNotifications] = useState(notifications || []); // local copy
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
       const fetchNotifications = async () => {
         try {
           const res = await fetch(`${API_BASE_URL}/api/notifications`, { credentials: 'include' });
           const data = await res.json();
           setLocalNotifications(data || []);
         } catch (err) {
           console.error('NotificationsDropdown.js | useEffect (fetchNotifications) - Error fetching notifications:', err);
         }
       };

       fetchNotifications();

       socket.on('notificationsUpdated', (data) => {
         console.log('NotificationsDropdown.js | useEffect (fetchNotifications) - Notifications updated:', data);
         fetchNotifications(); // refresh live
       });

       return () => {
         socket.off('notificationsUpdated');
       };
     }, [API_BASE_URL]);

  const handleAccept = async (notif) => {
    try {
      await fetch(`${API_BASE_URL}/api/friend/request/accept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ senderId: notif.from_user_id }),
      });
      socket.emit('friendListUpdated');
      setLocalNotifications(prev => prev.filter(n => n.notification_id !== notif.notification_id)); // remove notif
    } catch (err) {
      console.error('NotificationsDropdown.js | handleAccept - Error accepting friend request:', err);
    }
  };

  const handleReject = async (notif) => {
    try {
      await fetch(`${API_BASE_URL}/api/friend/request/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ senderId: notif.from_user_id }),
      });
      setLocalNotifications(prev => prev.filter(n => n.notification_id !== notif.notification_id)); // remove notif
    } catch (err) {
      console.error('NotificationsDropdown.js | handleReject - Error rejecting friend request:', err);
    }
  };

  const acceptGroupResponse = async (notif) => {
    try {
      await fetch(`${API_BASE_URL}/api/group/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          group_id: notif.group_id,
          fromUserId: notif.from_user_id,
        }),
      });
      setLocalNotifications(prev => prev.filter(n => n.notification_id !== notif.notification_id)); // remove notif
    } catch (err) {
      console.error(`NotificationsDropdown.js | acceptGroupResponse - Error ${action}ing group invite:`, err);
    }
  };

  const rejectGroupResponse = async (notif) => {
    try{ 
      await fetch(`${API_BASE_URL}/api/group/reject`,{
        method: 'PUT',
        headers: {'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          group_id: notif.group_id,
          fromUserId: notif.from_user_id,
        }),
      });
      setLocalNotifications(prev => prev.filter(n => n.notification_id !== notif.notification_id)); // remove notif
    }catch(err) {
      console.error('NotificationsDropdown.js | rejectGroupResponse - Error rejecting group invite (NotificationsDropdown.js');
    }
  };

  return (
    <div className="notifications-dropdown">
      {localNotifications.length === 0 ? (
        <div className="no-notifications">No new notifications</div>
      ) : (
        localNotifications.map((notif) => (
          <div key={notif.notification_id} className={`notification-item ${notif.is_read ? '' : 'unread'}`}>
            {notif.type === 'FRIEND_REQUEST' && (
              <>
                <span>{notif.from_username} sent you a friend request</span>
                <div className="notif-buttons">
                  <button className="accept-btn" onClick={() => handleAccept(notif)}>Accept</button>
                  <button className="reject-btn" onClick={() => handleReject(notif)}>Reject</button>
                </div>
              </>
            )}
            {notif.type === 'FRIEND_ACCEPTED' && (
              <span>You are now friends with {notif.from_username}</span>
            )}
            {notif.type === 'GROUP_INVITE' && (
              <>
                <span>{notif.from_username} invited you to join <strong>{notif.group_name}</strong></span>
                <div className="notif-buttons">
                  <button className="accept-btn" onClick={() => acceptGroupResponse(notif, 'accept')}>Accept</button>
                  <button className="reject-btn" onClick={() => rejectGroupResponse(notif, 'reject')}>Reject</button>
                </div>
              </>
            )}
            {notif.type === 'FRIEND_REJECTED' && (
              <span> {notif.from_username} has rejected your friend request</span>
            )}
            {notif.type === 'GROUP_JOINED' && (
              <span>{notif.from_username} has joined <strong>{notif.group_name}</strong></span>
            )}
            {notif.type === 'GROUP_ACCEPTED' && (
              <span>You are now part of group: <strong>{notif.group_name}</strong></span>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default NotificationsDropdown;
