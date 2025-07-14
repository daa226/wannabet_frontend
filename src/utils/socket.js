import { io } from 'socket.io-client';

const URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

const socket = io(URL, {
  withCredentials: true,
  transports: ['websocket'],
  autoConnect: false,
  reconnection: true,
});

export default socket;
