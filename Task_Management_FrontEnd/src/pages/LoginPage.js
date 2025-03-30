import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, TextField, Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Lock, Email } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!username) newErrors.username = 'Username is required.';
        if (!password) newErrors.password = 'Password is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);
            await login(username, password);
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom align="center">
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                    InputProps={{ startAdornment: <Email /> }}
                    name="username"
                    error={!!errors.username || !!error}
                    helperText={errors.username || (error && 'Username is required')}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    InputProps={{ startAdornment: <Lock /> }}
                    name="password"
                    error={!!errors.password || !!error}
                    helperText={errors.password || (error && 'Password is required')}
                />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                <Box sx={{ mt: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>

                    {/* Link to register page */}
                    <Link
                        to="/register"
                        style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
                    >
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            sx={{ mt: 3, height: '35px' }} // Margin top applied here
                        >
                            Don't have an account? Register here.
                        </Button>
                    </Link>
                </Box>

            </form>
            <ToastContainer />
        </Container>
    );
};

export default LoginPage;
