import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar'; 
import './CreateGroup.css';
import socket from '../../utils/socket';

const GroupPage = () => {
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [groupmembers, setgroupmembers] = useState([]); 
  const [invites, setInvites] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [showModal, setShowModal] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {

    const fetchGroups = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/group/get`, {
          credentials: 'include',
        });
        const data = await res.json();

        // For each group, fetch member count
        const groupsWithCounts = await Promise.all(
          data.map(async (group) => {
            try {
              const res = await fetch(`${API_BASE_URL}/api/group/${group.group_id}/members`, {
                credentials: 'include',
              });
              const members = await res.json();
              return {
                ...group,
                member_count: members.length,
              };
            } catch (err) {
              console.error(`CreateGroup.js | useEffect (fetchGroups) - Error fetching members for group ${group.name}:`, err);
              return {
                ...group,
                member_count: '?',
              };
            }
          })
        );

        setGroups(groupsWithCounts);
      } catch (error) {
        console.error('CreateGroup.js | useEffect (fetchGroups) - Error fetching groups:', error);
      }
    };

    // const fetchGroups = async () => {
    //   try {
    //     const res = await fetch(`${API_BASE_URL}/api/group/get`, {
    //       credentials: 'include',
    //     });
    //     const data = await res.json();
    //     setGroups(data);
    //   } catch (error) {
    //     console.error('Error fetching groups:', error);
    //   }
    // };

    fetchGroups(); // Initial load

    const handleGroupUpdate = () => {
      console.log('CreateGroup.js | useEffect (fetchGroups) - [GroupPage] groupListUpdated event received — refreshing groups list...');
      fetchGroups();
    };

    socket.on('groupListUpdated', (data) => {
      console.log('CreateGroup.js | useEffect (fetchGroups) - [Socket] Group list update received:', data);
      fetchGroups();
    });

    return () => {
      socket.off('groupListUpdated'); // Clean up socket listener
    };
  }, [API_BASE_URL]);

  const fetchGroups = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/group/get`, {
        credentials: 'include',
      });
      const data = await res.json();
      setGroups(data);
    } catch (error) {
      console.error('CreateGroup.js | fetchGroups - Error fetching groups:', error);
    }
  };
  
  const fetchmembers = async () => {
    try{
      const members = await fetch(`${API_BASE_URL}/api/group/${group.group_id}/members`,{
         credentials: 'include'
      });
      const memberdata = await members.json();
      setgroupmembers(memberdata);
    }catch(err){
      console.log("CreateGroup.js | fetchmembers - Error getting group members (CreateGroup.js",err);
    }

  }
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setMessage('Group name cannot be empty.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/group/create`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: groupName }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Group created!');
        setGroupName('');
        fetchGroups();
      } else {
        setMessage(data.error || 'Failed to create group.');
      }
    } catch (error) {
      console.error('CreateGroup.js | handleCreateGroup - Error creating group:', error);
      setMessage('Server error.');
    }
  };

  const handleSelectGroup = async (group) => {
    setSelectedGroup(group);

    try {
      const membersRes = await fetch(`${API_BASE_URL}/api/group/${group.group_id}/members`, { credentials: 'include' });
      const membersData = await membersRes.json();
      setMembers(membersData);

      const invitesRes = await fetch(`${API_BASE_URL}/api/group/${group.group_id}/invites`, { credentials: 'include' });
      const invitesData = await invitesRes.json();
      setInvites(invitesData);

      const ownerRes = await fetch(`${API_BASE_URL}/api/group/${group.group_id}/isOwner`, { credentials: 'include' });
      const { isOwner } = await ownerRes.json();
      setIsOwner(isOwner);
    } catch (error) {
      console.error('CreateGroup.js| handleSelectGroup - Error loading group details:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/search?query=${encodeURIComponent(query)}&groupId=${selectedGroup.group_id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      setResults(data.users);
    } catch (err) {
      console.error('CreateGroup.js | handleSearch - Search failed:', err);
    }
    setLoading(false);
  };

  const handleInviteSelectedUser = async (user) => {
    try {
      await fetch(`${API_BASE_URL}/api/group/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ group_id: selectedGroup.group_id, username: user.username }),
      });
      handleSelectGroup(selectedGroup); // Refresh members/invites
    } catch (err) {
      console.error('CreateGroup.js | handleInviteSelectedUser - Failed to send group invite:', err);
    }
  };

  

  return (
    <>
      <Navbar />
      <div className="group-page-container">
        <div className="group-main">
          <div className="group-topbar">
            <input
              type="text"
              placeholder="Search your groups..."
              className="group-searchbar"
            />
            <button className="group-add-button"
             onClick={() => setShowModal(true)}>
              +
            </button>

          </div>

          <div className="group-grid">
            {groups
              .filter((group) => group.name.toLowerCase() !== "public")
              .map((group) => (
                <div
                  key={group.group_id}
                  className="group-card"
                  onClick={() => navigate(`/group/${group.group_id}`)}
                >
                  <h3>{group.name}</h3>
                  <p>Members: {group.member_count|| "?"}</p>
                </div>
              ))}
          </div>
            {showModal && (
              <div className="modal-overlay" onClick={() => setShowModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h2>Create a New Group</h2>
                  <form onSubmit={(e) => {
                    handleCreateGroup(e);
                    setShowModal(false); // Close modal on submit
                  }}>
                    <input
                      type="text"
                      placeholder="Group Name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="group-input"
                    />
                    <button type="submit" className="create-button">Create Group</button>
                  </form>
                  <button className="modal-close" onClick={() => setShowModal(false)}>X</button>
                </div>
              </div>
            )}

          {selectedGroup && (
            <div className="group-details">
              <h3>Group: {selectedGroup.name}</h3>

              <h4>Members:</h4>
              <ul>
                {members.map((member) => (
                  <li key={member.user_id}>{member.username}</li>
                ))}
              </ul>

              <h4>Pending Invites:</h4>
              <ul>
                {invites.map((invite) => (
                  <li key={invite.user_id}>{invite.username}</li>
                ))}
              </ul>

              {isOwner && (
                <div className="invite-section">
                  <h4>Invite User by Searching Username</h4>
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder="Search for users..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="group-input"
                    />
                    <button type="submit" className="create-button" style={{ marginTop: '1rem' }}>Search</button>
                  </form>

                  {loading && <p>Loading...</p>}

                  <ul>
                    {results.map((user) => (
                      <li key={user.user_id} style={{ marginBottom: '0.5rem' }}>
                        {user.username}
                        {(user.status === 'none' || user.status === 'friend' || user.status === 'requested') && (
                          <button
                            onClick={() => handleInviteSelectedUser(user)}
                            className="create-button"
                            style={{ marginLeft: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          >
                            Invite
                          </button>
                        )}
                        {user.status === 'group' && (
                          <span style={{ marginLeft: '1rem', color: 'green' }}>Already in Group</span>
                        )}
                        {user.status === 'invited' && (
                          <span style={{ marginLeft: '1rem', color: 'orange' }}>Invite Sent</span>
                        )}
                        {user.status === 'friend' && (
                          <span style={{ marginLeft: '1rem', color: 'blue' }}>Already Friends</span>
                        )}
                        {user.status === 'requested' && (
                          <span style={{ marginLeft: '1rem', color: 'gray' }}>Friend Request Sent</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {message && <p>{message}</p>}
        </div>
      </div>
    </>
  );
};

export default GroupPage;






//   return (
//     <>
//       <Navbar />
//       <div className="group-page-container">
//         <div className="group-sidebar">
//           <h2>Create a New Group</h2>
//           <form onSubmit={handleCreateGroup}>
//             <input
//               type="text"
//               placeholder="Group Name"
//               value={groupName}
//               onChange={(e) => setGroupName(e.target.value)}
//               className="group-input"
//             />
//             <button type="submit" className="create-button">Create Group</button>
//           </form>
//         </div>

//         <div className="group-main">
//           <h2>Your Groups</h2> 
//           <ul>
//             {groups
//             .filter(group => group.name.toLowerCase() !== "public")
//             .map((group) => (
//               <li key={group.group_id} onClick={() => handleSelectGroup(group)}>
//                 {group.name}
//               </li>
//             ))}
//           </ul>

//           {selectedGroup && (
//             <div className="group-details">
//               <h3>Group: {selectedGroup.name}</h3>

//               <h4>Members:</h4>
//               <ul>
//                 {members.map((member) => (
//                   <li key={member.user_id}>{member.username}</li>
//                 ))}
//               </ul>

//               <h4>Pending Invites:</h4>
//               <ul>
//                 {invites.map((invite) => (
//                   <li key={invite.user_id}>{invite.username}</li>
//                 ))}
//               </ul>

//               {isOwner && (
//                 <div className="invite-section">
//                   <h4>Invite User by Searching Username</h4>
//                   <form onSubmit={handleSearch}>
//                     <input
//                       type="text"
//                       placeholder="Search for users..."
//                       value={query}
//                       onChange={(e) => setQuery(e.target.value)}
//                       className="group-input"
//                     />
//                     <button type="submit" className="create-button" style={{ marginTop: '1rem' }}>Search</button>
//                   </form>

//                   {loading && <p>Loading...</p>}

//                   <ul>
//                     {results.map(user => (
//                       <li key={user.user_id} style={{ marginBottom: '0.5rem' }}>
//                         {user.username}
//                         {(user.status === 'none' || user.status === 'friend' || user.status === 'requested') && (
//                           <button
//                             onClick={() => handleInviteSelectedUser(user)}
//                             className="create-button"
//                             style={{ marginLeft: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
//                           >
//                             Invite
//                           </button>
//                         )}
//                         {user.status === 'group' && (
//                           <span style={{ marginLeft: '1rem', color: 'green' }}>Already in Group</span>
//                         )}
//                         {user.status === 'invited' && (
//                           <span style={{ marginLeft: '1rem', color: 'orange' }}>Invite Sent</span>
//                         )}
//                         {user.status === 'friend' && (
//                           <span style={{ marginLeft: '1rem', color: 'blue' }}>Already Friends</span>
//                         )}
//                         {user.status === 'requested' && (
//                           <span style={{ marginLeft: '1rem', color: 'gray' }}>Friend Request Sent</span>
//                         )}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           )}

//           {message && <p>{message}</p>}
//         </div>
//       </div>
//     </>
//   );
// };
