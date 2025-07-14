// Home.js
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";
import ChallengeDetails from "../ChallengeDetails/ChallengeDetails";
import Modal from "../../components/modal/Modal";
import GroupDetails from "../GroupDetails/GroupDetails";
import socket from '../../utils/socket';

console.log("🚀 Socket imported:", socket);


export default function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [challenge, setChallenge] = useState({ public: [], private: [] });
  const [loading, setLoading] = useState(true);
  const [myBets, setMyBets] = useState([])
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);
  const [myGroups, setMyGroups] = useState([])
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


  // useEffect(() => {
  //   socket.connect();
    
  //   console.log("🧍 Current user:", user);

  //   if (user && user.user_id) {
  //     socket.emit('register', user.user_id);
  //     console.log(`🔐 Registered socket for user: ${user.user_id}`);
  //   }

  //   const onConnect = () => {
  //     console.log('🟢 Socket.IO connected with ID:', socket.id);
  //   };

  //   const onConnectError = (err) => {
  //     console.error('🔴 Socket.IO connection error:', err.message);
  //   };

  //   socket.on('connect', onConnect);
  //   socket.on('connect_error', onConnectError);

  //   return () => {
  //     socket.off('connect', onConnect);
  //     socket.off('connect_error', onConnectError);
  //   };
  // }, [user]);

  // useEffect(() => {
  //   const handlePersonalMessage = (data) => {
  //     console.log("📩 [Socket] Personal room message:", data.message);
  //   };

  //   const handleGroupMessage = (data) => {
  //     console.log("👥 [Socket] Group room message:", data.message);
  //   };

  //   socket.on('personal_message', handlePersonalMessage);
  //   socket.on('group_message', handleGroupMessage);

  //   return () => {
  //     socket.off('personal_message', handlePersonalMessage);
  //     socket.off('group_message', handleGroupMessage);
  //   };
  // }, []);

  // const [notification, setNotification] = useState(null);

  // useEffect(() => {
  //   console.log("👋 Home component mounted");

  //   socket.on('connect', () => {
  //     console.log("✅ Connected to socket:", socket.id);
  //   });

  //   socket.on('disconnect', () => {
  //     console.log("⚠️ Disconnected from socket");
  //   });

  //   socket.on('test_event', (data) => {
  //     console.log("📡 test_event received:", data.message);
  //   });

  //   socket.on('friend_request_received', (data) => {
  //     setNotification(data.message);
  //   });

  //   socket.onAny((event, ...args) => {
  //   console.log("🔍 Any event received:", event, args);
  //   });


  //   return () => {
  //     socket.off('test_event');
  //   };
  // }, []);



  useEffect(() => {

    const fetchChallenges = () => {
      fetch(`${API_BASE_URL}/api/challenge/get`, { credentials: "include" })
        .then(res => res.json())
        .then(data => {
          setChallenge(data);  // silently update challenges
          setLoading(false);   // no animation or spinner triggered
        })
        .catch(err => {
          console.error("Home.js | useEffect (fethcChellenges) - Error fetching challenges:", err);
          setLoading(false);
        });
    };

    fetchChallenges(); // Initial load

    socket.on('challengesUpdated', () => {
      console.log('Home.js | useEffect (fethcChellenges) - [Socket] Challenges updated — refetching...');
      fetchChallenges(); // Refetch challenges when the socket event is received
    });

    return () => {
      socket.off('challengesUpdated'); // Clean up socket listener
    }

  }, [API_BASE_URL]);


    
  useEffect(() => {
    const fetchBets = () => {
      fetch(`${API_BASE_URL}/api/user/bets`, { credentials: 'include' })
        .then(res => {
          if (!res.ok) {
            return res.text().then(text => {
              throw new Error(`Server responded with ${res.status}: ${text}`);
            });
          }
          return res.json();
        })
        .then(data => {
          setMyBets(data); 
          setLoading(false);
        })
        .catch(err => {
          console.error("Home.js | useEffect (fetchBets) - Error fetching bets:", err);
          setLoading(false);
        });
    };

    fetchBets(); // Initial fetch

   socket.on('betsUpdated', (data) => {
      console.log('Home.js | useEffect (fetchBets) - [Socket] Bets updated — refetching...');
      fetchBets(); // Refetch bets when the socket event is received
   });

    return () => {
     socket.off('betsUpdated'); // Clean up socket listener
    };
  }, [API_BASE_URL]);


 

  useEffect(() => {
    const fetchGroups = () => {
      fetch(`${API_BASE_URL}/api/group/get`, { credentials: 'include' })
        .then(res => {
          if (!res.ok) {
            return res.text().then(text => {
              throw new Error(`Server responded with ${res.status}: ${text}`);
            });
          }
          return res.json();
        })
        .then(data => {
          setMyGroups(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Home.js | useEffect (fetchGroups) -Error fetching groups:", err);
          setLoading(false);
        });
    };

    fetchGroups(); // Initial load

    socket.on('groupListUpdated', (data) => {
      console.log('Home.js | useEffect (fetchGroups) [Socket] Group list update received:', data);
      fetchGroups();
    });

    return () => {
      socket.off('groupListUpdated'); // Clean up socket listener
    };
  }, [API_BASE_URL]);



  const sampleData = {
    // myBets: [
    //   { id: 1, amount: 30, win: 27.27, match: "Best Pong Player" },
    //   { id: 2, amount: 25, win: 27.27, match: "How Many Gators Will We See At Shark Valley" },
    //   { id: 3, amount: 20, win: 18.18, match: "Cowboys vs Eagles" },
    //   { id: 4, amount: 15, win: 13.64, match: "Packers vs Bears" },
    //   { id: 5, amount: 10, win: 9.09, match: "Will the Dolphins make the playoffs?" },
    //   { id: 6, amount: 5, win: 4.55, match: "Will the Heat make the playoffs?" },
    // ],
    groups: [
      { id: 1, name: "Public Group" },
      { id: 2, name: "Fantasy League" },
      { id: 3, name: "Dolphins Fans" },
    ],
  };

  const getCardColorClass = (index) => {
    return index % 2 === 0 ? "Home-bet-card-blue" : "Home-bet-card-pink";
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="Home-container">
      <Navbar />
      <main className="Home-main">
        <h1 className="Home-main-title">
          <span className="Home-pink-text">Welcome</span>
          <span className="Home-blue-text"> {user.f_name}!</span>
        </h1>

        
        <div className="Home-top-section">
          {/* Left: Active Bets */}
          <div className="Home-left-panel">
            <h2>Active Bets</h2>
            <div className="Home-bet-grid Home-grid-1">
              {myBets
                .filter(bet => {
                  const betDate = new Date(bet.end_date);
                  const today = new Date();
                  betDate.setHours(0, 0, 0, 0);
                  today.setHours(0, 0, 0, 0);
                  return betDate >= today;
                })
                .filter(myBets => new Date(myBets.end_date) >= new Date())
                .map((bet, index) => (
                  <div 
                    key={bet.id} 
                    className={`Home-bet-card ${getCardColorClass(index)}`}
                  >
                    <p className ="Home-bet-title"> {bet.title}</p>
                    <p className="Home-bet-amount">Wagered ${bet.amount}</p>
                    <p className ="Home-bet-description">Your Take: {bet.option_desc}</p>
                  </div>
              ))}
            </div>
          </div>

          {/* Right: Groups */}
          <div className="Home-right-panel">
            <h2>Your Groups</h2>
            <div className="Home-bet-grid Home-grid-1">
              {myGroups.filter(group => group.name.toLowerCase() !== "public").length === 0 ? (
                <div className="Home-no-data">
                  No groups joined yet!
                </div>
              ) : (
                myGroups
                  .filter(group => group.name.toLowerCase() !== "public")
                  .map((group, index) => (
                    <div 
                    key={group.group_id}
                    className={`Home-bet-card ${getCardColorClass(index)}`}
                    onClick={() => {
                      setSelectedGroupId(group.group_id);
                      setShowGroupModal(true);
                    }}
                  >
                    <p className="Home-bet-question">{group.name}</p>
                  </div>
                  
                  ))
              )}
            </div>

          </div>
        </div>

        {/* Bottom: Popular Challenges */}
        <section className="Home-bottom-section">
          <h2>Popular Challenges</h2>
          <div className={`Home-bet-grid Home-grid-${challenge.public.length > 0 ? challenge.public.length : 1}`}>
            {challenge.public
              .filter(challenge => new Date(challenge.end_date) >= new Date()) // Only show future or today's challenges
              .map((challenge, index) => (
                <div 
                  key={challenge.challenge_id}
                  className={`Home-bet-card ${getCardColorClass(index)}`}
                  onClick={() => {
                    setSelectedChallengeId(challenge.challenge_id);
                    setShowChallengeModal(true);
                  }}
                >
                  <p className="Home-bet-question">{challenge.title}</p>
                  <p className="Home-bet-to-win">{challenge.description}</p>
                  <p className="Home-bet-amount">
                    Ends: {new Date(challenge.end_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
          </div>
        </section>


        {showChallengeModal && (
          <Modal onClose={() => setShowChallengeModal(false)}>
            <ChallengeDetails challenge_id={selectedChallengeId} />
          </Modal>
        )}

        {showGroupModal && (
          <Modal onClose = {() => setShowGroupModal(false)}>
            <GroupDetails groupId = {selectedGroupId} /> 
          </Modal>

        )}
      </main>

      {/* {notification && (
        <NotificationBanner
          message={notification}
          onClose={() => setNotification(null)}
        />
      )} */}

    </div> 
  );
}


