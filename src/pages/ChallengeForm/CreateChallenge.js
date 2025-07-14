import React, { useState, useEffect } from 'react';
import './CreateChallange.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

export default function ChallengeForm() {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [formData, setFormData] = useState({
    group_id: '',
    title: '',
    description: '',
    end_date: '',
  });

  const [options, setOptions] = useState(['', '']); 
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/group/mygroups`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setGroups(data);
        } else {
          console.error('CreateChallenge.js | useEffect - Failed to fetch groups:', data.error || 'Unknown error');
        }
      } catch (err) {
        console.error('CreateChallenge.js | useEffect - Error fetching groups:', err);
      }
    }

    fetchGroups();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (indexToRemove) => {
    if (options.length <= 2) return; 
    const newOptions = options.filter((_, index) => index !== indexToRemove);
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      options: options.filter((opt) => opt.trim() !== ''),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/challenge/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('Content-Type');

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error("CreateChallenge.js | handleSubmit - Response not JSON:", text);
        alert("Unexpected response from server. Check the console.");
        return;
      }

      const data = await response.json();
      console.log("CreateChallenge.js | handleSubmit - JSON Response:", data);

      if (response.ok) {
        navigate('/Home');
      } else {
        alert(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("CreateChallenge.js | handleSubmit - Fetch failed:", err);
      alert("Server error occurred. Try again.");
    }
  };

  return (
    <div className="CreateChallenge-container">
      <Navbar />
      <form className="challenge-form" onSubmit={handleSubmit}>
        <h2 className="ChallengeTitle">
          <div className="Pinktext">Create</div>
          <div className="Bluetext">A</div>
          <div className="Pinktext">Challenge</div>
        </h2>
        <div className="explanation">
          If you want this to be a public challenge, select "Public", otherwise choose your group.
        </div>

      
        <select
          className ="Select-Group"
          name="group_id"
          value={formData.group_id}
          onChange={handleChange}
          required
        >
          <option value="">Select a Group</option>
          
          {groups.map((group) => (
            <option className = "Private-Group" key={group.group_id} value={group.group_id}>
              {group.group_name}
            </option>
          ))}
        </select>

        <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        
        <div className="EndDate">Challenge End Date</div>
        <input type="date" name="end_date" onChange={handleChange} required />

        <div className="OptionsSection">
          <h4 className="Bluetext">Challenge Options</h4>
          {options.map((option, index) => (
            <div key={index} className="OptionRow">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="OptionInput"
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  className="RemoveOptionButton"
                  onClick={() => removeOption(index)}
                  title="Remove this option"
                >
                  ❌
                </button>
              )}
            </div>
          ))}
          {options.length < 4 && (
            <button
              type="button"
              className="AddOptionButton"
              onClick={addOption}
            >
              ➕ Add Option
            </button>
          )}
        </div>

        <button type="submit">Create Challenge</button>
      </form>
    </div>
  );
}
