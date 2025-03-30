import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProfilePage = () => {
  const { user, token, updateUser } = useAuth();
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!user) {
      // Redirect to login if user is not logged in
      window.location.href = "/login";
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = { username: newUsername, email: newEmail };
      await axios.put('https://localhost:7131/api/Auth/UpdateProfile', updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      updateUser(updatedUser);  // Update user info in context
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const updatedPassword = { oldPassword: user.passwordHash, newPassword };
      await axios.put('https://localhost:7131/api/Auth/UpdatePassword', updatedPassword, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
      </div>
      <button onClick={handleUpdateProfile}>Update Profile</button>

      <h2>Change Password</h2>
      <div>
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <button onClick={handleUpdatePassword}>Update Password</button>
    </div>
  );
};

export default ProfilePage;
