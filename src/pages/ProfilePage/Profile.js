import React, { useState, useEffect } from "react";
import "./Profile.css";
import Navbar from "../../components/Navbar/Navbar";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
          method: "GET",  
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser({
            username: data.username,
            balance: data.balance,
            email: data.email,
            f_name: data.f_name,
            l_name: data.l_name,
            phone_num: data.phone_num,
            dob: data.dob,
            bio: data.bio,
            profile_pic: data.profile_pic,
            joined: data.date_created,
          });
        } else {
          console.warn("User not authenticated");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const handlechangepassword = () => {
    alert("Change Password coming soon — contact admin@wannabet.bet for help.");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_pic", file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/upload-profile-pic`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUser((prev) => ({ ...prev, profile_pic: data.profile_pic }));
        setSelectedImage(URL.createObjectURL(file));
      } else {
        console.error("Failed to upload image");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  if (!user) return <div>Loading Profile...</div>;

  return (
    <div className="Profile-container">
      <Navbar username={user.username} balance={user.balance} />

      <main className="Profile-main">
        <h1 className="Profile-title">
          <span className="Home-pink-text">User</span>
          <span className="Home-blue-text"> Profile</span>
        </h1>

        <div className="Profile-card">
          {/* ✅ Profile Picture Display & Upload */}
          <div className="Profile-picture-container">
          {user.profile_pic ? (
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}${user.profile_pic}`}
                alt="Profile"
                className="profile-image"
                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
              />
            ) : (
              <p style={{ color: '#888' }}>No profile picture set</p>
            )}

            <label className="Profile-upload-button">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
              +
            </label>
          </div>

          <h2 className="Profile-username">@{user.username}</h2>
          <p><strong>Full Name:</strong> {user.f_name} {user.l_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone_num}</p>
          <p><strong>Date of Birth:</strong> {user.dob?.split("T")[0]}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
          <p><strong>Joined:</strong> {user.joined?.split("T")[0]}</p>

          <p className="Profile-button">
            <button onClick={handlechangepassword}>Click to Change Password</button>
          </p>
        </div>
      </main>
    </div>
  );
}
