import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css'; 
import { AuthContext } from '../../context/AuthContext';

function RegisterForm() {
  const { refreshUser } = useContext(AuthContext);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [form, setForm] = useState({
    username: '', 
    f_name: '',
    l_name: '',
    dob: '',
    email: '',
    phone_num: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    //Logic to hek if the user is underage fo rhte registration
    const today = new Date();
    const dob = new Date(form.dob);
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();
  
    const isUnder21 =
      age < 21 ||
      (age === 21 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));
  
    if (isUnder21) {
      setMessage("You are too young to register. Must be 21+.");
      return;
    }
  
    try {
      setMessage('Registering your account...');
  
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setMessage('Registration successful!');
        setTimeout(async () => {
          await refreshUser();
          navigate('/Home');
        }, 500);
      } else {
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error("RegisterForm.js| handleSubmit - " ,err);
      setMessage('Server error. Please try again later.');
    }
  };
  

  return (
    <div className="register-background">
      <div className="register-container">
        <h2>Register For WannaBet</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="f_name"
            placeholder="First Name"
            value={form.f_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="l_name"
            placeholder="Last Name"
            value={form.l_name}
            onChange={handleChange}
            required
          />
          <div className="DOB">Date of Birth</div>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone_num"
            placeholder="Phone"
            value={form.phone_num}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
          {message && <p className="message">{message}</p>}
          <p className="switch-form">
            Already have an account?{" "}
            <span onClick={() => navigate('/Home')} className="link">
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;



