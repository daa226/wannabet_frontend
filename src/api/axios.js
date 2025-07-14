import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true, // enables cookies for session-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
