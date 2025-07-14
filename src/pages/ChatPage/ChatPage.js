import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './ChatPage.css';

const conversations = [
  { id: 1, name: 'Leo Antonevich' },
  { id: 2, name: 'David Antonevich' },
  { id: 3, name: 'Group: UFC 300 Bet' },
];

const messagesMock = [
  { id: 1, sender: 'Leo', text: 'Let’s lock in this bet by tonight.' },
  { id: 2, sender: 'Asher', text: 'I’m in. Let’s do it.' },
];

export default function ChatPage() {
  const navigate = useNavigate();

  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [messages, setMessages] = useState(messagesMock);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'You', text: newMessage }]);
    setNewMessage('');
  };

  return (
    <>
    <Navbar />
    <div className="chat-container">
      <div className="chat-sidebar">
        <h2 className="chat-title">Chats</h2>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`chat-conversation ${
              activeConversation.id === conv.id ? 'active' : ''
            }`}
            onClick={() => setActiveConversation(conv)}
          >
            {conv.name}
          </div>
        ))}
      </div>

      <div className="chat-main">
        <h2 className="chat-header">{activeConversation.name}</h2>
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className="chat-message">
              <span className="chat-sender">{msg.sender}:</span>{' '}
              <span>{msg.text}</span>
            </div>
          ))}
        </div>
        <div className="chat-input-area">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="chat-input"
          />
          <button onClick={sendMessage} className="chat-send-button">
            Send
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
