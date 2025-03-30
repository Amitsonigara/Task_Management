import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';  // Assuming useAuth provides user and token
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { toast } from 'react-toastify';  // For displaying toast notifications
import { useNavigate } from 'react-router-dom'; // For redirecting after success
import axios from 'axios';

const UserProfilePage = () => {
    const { user, token } = useAuth(); 
    const navigate = useNavigate(); 
    const [profile, setProfile] = useState({ username: '', email: '', id: '' });
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loadingProfile, setLoadingProfile] = useState(false); 
    const [loadingPassword, setLoadingPassword] = useState(false);  
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({}); 


    useEffect(() => {
        if (user) {
            setProfile({ username: user.username, email: user.email, id: user.id });
        }
    }, [user]);

    
    const validateProfile = () => {
        const newErrors = {};
        if (!profile.username) newErrors.username = 'Username is required.';
        if (!profile.email) newErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(profile.email)) newErrors.email = 'Email is not valid.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = () => {
        const newErrors = {};
        if (!password) newErrors.password = 'Current password is required.';
        if (!newPassword) newErrors.newPassword = 'New password is required.';
        else if (newPassword.length < 6) newErrors.newPassword = 'New password should be at least 6 characters long.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleUpdateProfile = async () => {
        if (!validateProfile()) return;
    
        setLoadingProfile(true);
        setError('');  
        try {
            const updateData = {
                UserId: user.id,  
                Username: profile.username,
                Email: profile.email,
            };
    
        
            const response = await axios.put('https://localhost:7131/api/Auth/UpdateProfile', updateData, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log(response.data); 
            
            if (response.data === "User profile updated successfully.") {
                toast.success('Profile updated successfully!', {
                    position: "top-right",
                    autoClose: 1500, 
                    onClose: () => navigate('/tasks'), 
                });
            } else if (response.data) {
                toast.warning(response.data, {
                    position: "top-right",
                    autoClose: 3000, 
                });
            } else {
                toast.error('Unknown response from server', {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (err) {
            console.error(err); 
            setError('Error updating profile.');
            toast.error('Error updating profile', {
                position: "top-right",
                autoClose: 3000, 
            });
        } finally {
            setLoadingProfile(false);
        }
    };
    
    const handleChangePassword = async () => {
        if (!validatePassword()) return; 
    
        setLoadingPassword(true);
        setError('');  
        try {
            const passwordData = {
                UserId: user.id,  
                CurrentPassword: password,
                NewPassword: newPassword,
            };
    
            // Change password via API
            const response = await axios.put('https://localhost:7131/api/Auth/UpdatePassword', passwordData, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log(response.data);
            if (response.data === "Password updated successfully.") {
                toast.success('Password updated successfully!', {
                    position: "top-right",
                    autoClose: 1500, 
                    onClose: () => navigate('/tasks'), 
                });
            } else if (response.data.includes("Current password is incorrect") || response.data.includes("New password cannot be the same")) {
                toast.warning(response.data, {
                    position: "top-right",
                    autoClose: 3000, 
                });
            } else {
                toast.error(response.data, {
                    position: "top-right",
                    autoClose: 3000, 
                });
            }
        } catch (err) {
            console.error(err); 
            setError('Error changing password.');
            toast.error('Error changing password', {
                position: "top-right",
                autoClose: 3000, 
            });
        } finally {
            setLoadingPassword(false);
        }
    };
    

    return (
        <Container maxWidth="xs" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom align="center">
                User Profile
            </Typography>

            {/* Display error alert */}
            {error && <Alert severity="error">{error}</Alert>}

            {/* Profile fields */}
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                margin="normal"
                error={!!errors.username}
                helperText={errors.username}
            />
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                margin="normal"
                error={!!errors.email}
                helperText={errors.email}
            />

            <Box sx={{ mt: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleUpdateProfile}
                    disabled={loadingProfile}
                >
                    {loadingProfile ? <CircularProgress size={24} /> : 'Update Profile'}
                </Button>
            </Box>

            <Typography variant="h5" sx={{ mt: 3 }}>
                Change Password
            </Typography>

            {/* Password fields */}
            <TextField
                label="Current Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                error={!!errors.password}
                helperText={errors.password}
            />
            <TextField
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="normal"
                error={!!errors.newPassword}
                helperText={errors.newPassword}
            />

            <Box sx={{ mt: 3 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={handleChangePassword}
                    disabled={loadingPassword}
                >
                    {loadingPassword ? <CircularProgress size={24} /> : 'Change Password'}
                </Button>
            </Box>
        </Container>
    );
};

export default UserProfilePage;
