import { useEffect, useContext } from "react";
import socket from "../utils/socket";
import useNotificationStore from "../store/notificationStore";
import { AuthContext } from "../context/AuthContext";

const SocketManager = () => {
  const { setNotification } = useNotificationStore();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.user_id) return;

    console.log("🚀 SocketManager mounted for user:", user.user_id);

    const handleConnect = () => {
      console.log("🟢 Socket connected:", socket.id);
      socket.emit("register", user.user_id);
      console.log("✅ Emitted register for user:", user.user_id);
    };

    const handleReconnect = () => {
      console.log("🔁 Reconnected:", socket.id);
      socket.emit("register", user.user_id);
      console.log("✅ Re-emitted register after reconnect");
    };

    const handleFriendRequest = (data) => {
      console.log("📩 Friend request received:", data);
      setNotification(data.message);
    };

    const handleFriendAccepted = (data) => {
      console.log("🤝 Friend request accepted:", data);
      setNotification(data.message);
    };

    const handleFriendReject = (data) => {
      console.log("Friend Request has been rejected by", data);
      setNotification(data.message);
    }

    const handleGroupRequest = (data) => {
      console.log("👥 Group request received:", data);
      setNotification(data.message);
    };

    const handleGroupAccept = (data) => {
      console.log("Group invite accepted: ", data);
      setNotification(data.message);
    }


    const handleNewBet = (data) => {
      console.log("New Bet Placed");
      setNotification(data.message);
    }

    if (!socket.connected) {
      console.log("⚡ Connecting socket...");
      socket.connect();
    }

    socket.on("connect", handleConnect);
    socket.on("reconnect", handleReconnect);
    socket.on("friend_request_received", handleFriendRequest);
    socket.on("friend_request_accepted", handleFriendAccepted);
    socket.on("friend_request_rejected", handleFriendReject);
    socket.on("group_request_received", handleGroupRequest);
    socket.on("group_invite_accepted", handleGroupAccept);
    socket.on("new_bet_placed", handleNewBet);
    
    

    return () => {
      console.log("🔌 Cleaning up socket listeners...");
      socket.off("connect", handleConnect);
      socket.off("reconnect", handleReconnect);
      socket.off("friend_request_received", handleFriendRequest);
      socket.off("friend_request_accepted", handleFriendAccepted);
      socket.off("friend_request_rejected", handleFriendReject);
      socket.off("group_request_received", handleGroupRequest);
      socket.off("group_invite_accepted", handleGroupAccept);
      socket.off("new_bet_placed", handleNewBet);
 
    };
  }, [user?.user_id]);

  return null;
};

export default SocketManager;
