import React, { useState, useEffect } from 'react';
import NotificationsDropdown from '../NotificationsDropdown/NotificationsDropdown';
import './NotificationsBell.css';
import socket from '../../utils/socket';

function NotificationsBell() {
    const [notifications, setNotifications] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        fetchNotifications();
        socket.on('notificationsUpdated', (data) => {
            console.log('NotificationsBell.js | useEffect (fetchNotifications) -  Notifications updated — refetching...');
            fetchNotifications();
        });

        return () => {
            socket.off('notificationsUpdated'); // Clean up socket listener
        }
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/notifications`,{
                credentials: 'include'});
            const data = await res.json();
            console.log('NotificationsBell.js | fetchNotifications - Fetched notifications:', data);
            setNotifications(data || []);
        }catch (err){
            console.error('NotificationsBell.js | fetchNotifications - Error fetching notifications:', err);
        }
    }

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const handleBellClick = async () => {
        const willOpen = !dropdownOpen; 
        setDropdownOpen(willOpen);
    
        if (willOpen && unreadCount > 0) { 
            try {
                await fetch(`${API_BASE_URL}/api/notifications/mark-read`, {
                    method: 'PUT',
                    credentials: 'include',
                });
                setNotifications(notifications.map(n => ({ ...n, is_read: true })));
            } catch (err) {
                console.error('NotificationsBell.js | fhandleBellClick - Error marking notifications as read:', err);
            }
        }
    };

    return( 
        <div className ="notifications-bell-container">
           <div className="bell-icon" onClick={handleBellClick}>
                🔔
                {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
                )}
            </div>

            {dropdownOpen && (
                <NotificationsDropdown notifications={notifications} />
            )}
        </div>
    );

}


export default NotificationsBell;