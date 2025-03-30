import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Box, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Person, Lock, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // For redirecting to login page
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import styles for react-toastify

const RegisterPage = () => {
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        
        // Validation rules
        if (!username.trim()) newErrors.username = 'Username is required';
        if (!email.trim()) newErrors.email = 'Email is required';
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) newErrors.email = 'Invalid email address';
        if (!password.trim()) newErrors.password = 'Password is required';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!confirmPassword.trim()) newErrors.confirmPassword = 'Confirm Password is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // If validation fails, do not proceed with registration

        try {
            setLoading(true);
            await register(username, email, password);
        } catch (err) {
            toast.error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // On blur handler to trigger validation for each field individually
    const handleBlur = (field) => {
        switch (field) {
            case 'username':
                if (!username.trim()) setErrors((prev) => ({ ...prev, username: 'Username is required' }));
                else setErrors((prev) => ({ ...prev, username: null }));
                break;
            case 'email':
                if (!email.trim()) setErrors((prev) => ({ ...prev, email: 'Email is required' }));
                else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) setErrors((prev) => ({ ...prev, email: 'Invalid email address' }));
                else setErrors((prev) => ({ ...prev, email: null }));
                break;
            case 'password':
                if (!password.trim()) setErrors((prev) => ({ ...prev, password: 'Password is required' }));
                else setErrors((prev) => ({ ...prev, password: null }));
                break;
            case 'confirmPassword':
                if (!confirmPassword.trim()) setErrors((prev) => ({ ...prev, confirmPassword: 'Confirm Password is required' }));
                else if (password !== confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
                else setErrors((prev) => ({ ...prev, confirmPassword: null }));
                break;
            default:
                break;
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom align="center">
                Create an Account
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                    InputProps={{
                        startAdornment: <Person />,
                    }}
                    error={!!errors.username}
                    helperText={errors.username}
                    onBlur={() => handleBlur('username')}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    InputProps={{
                        startAdornment: <Email />,
                    }}
                    error={!!errors.email}
                    helperText={errors.email}
                    onBlur={() => handleBlur('email')}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    InputProps={{
                        startAdornment: <Lock />,
                    }}
                    error={!!errors.password}
                    helperText={errors.password}
                    onBlur={() => handleBlur('password')}
                />
                <TextField
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    margin="normal"
                    InputProps={{
                        startAdornment: <Lock />,
                    }}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    onBlur={() => handleBlur('confirmPassword')}
                />

                <Box sx={{ mt: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        sx={{ mb: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Register'}
                    </Button>
                    <Link to="/login" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}sx={{ mt: 3 }}>
                        <Button variant="outlined" color="secondary" fullWidth>
                            Already have an account? Login here.
                        </Button>
                    </Link>
                </Box>
            </form>

            {/* ToastContainer to display the toast messages */}
            <ToastContainer />
        </Container>
    );
};

export default RegisterPage;
