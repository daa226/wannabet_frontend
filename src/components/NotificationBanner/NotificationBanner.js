import React, { useEffect } from "react";
import "./NotificationBanner.css";

const NotificationBanner = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="notification-banner">
      {message}
    </div>
  );
};

export default NotificationBanner;
