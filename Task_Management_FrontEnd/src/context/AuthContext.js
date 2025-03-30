import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate(); // Move useNavigate inside the functional component
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || ''); // Retrieve token from localStorage if available
    const [loading, setLoading] = useState(true);

    // Check if the token exists and validate on initial load
    useEffect(() => {
        if (token) {
            axios.defaults.headers['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false); // Stop loading once the check is done
    }, [token]);

    // Login function
    const login = async (username, password) => {
        try {
            const response = await axios.post('https://localhost:7131/api/Auth/UserLogin', { username, password });
            const { token, user, message } = response.data;

            if (message) {
                // Show specific error messages
                if (message === "Invalid credentials") {
                    toast.warning("Invalid credentials. Please check your username and password.", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                } else if (message === "User not found") {
                    toast.warning("User not found. Please check your username or register.", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                } else if (message === "Incorrect password") {
                    toast.warning("Incorrect password. Please try again.", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                } else {
                    toast.error("Login failed. Please try again.", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
                return; // Early exit if there's an error message from the backend
            }

            // Proceed with successful login if no error message
            localStorage.setItem('token', token); // Store token in localStorage
            setToken(token);
            setUser(user); // Set user data in context
            toast.success('Login successful! Redirecting to tasks...', {
                position: "top-right",
                autoClose: 1500, // Close after 2 seconds
                onClose: () => navigate('/tasks'), // Redirect to task page after toast
            });
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Failed to login. Please try again.', {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        toast.success('Logout successful! Please login.', {
            position: "top-right",
            autoClose: 3000, // Close after 3 seconds
            onClose: () => navigate('/login'), // Redirect to login page after toast
        });
    };

    // Register function
    const register = async (username, email, password) => {
        try {
            const response = await axios.post('https://localhost:7131/api/Auth/UserRegistration', { username, email, password });
            const message = response.data;

            // If registration failed, show error
            if (message && message !== "User registered successfully") {
                toast.error(message, {
                    position: "top-right",
                    autoClose: 3000,
                });
                return; // Early exit if there's an error message from the backend
            }

            // Show success message
            toast.success('Registration successful! Please login.', {
                position: "top-right",
                autoClose: 3000, // Close after 3 seconds
                onClose: () => navigate('/login'), // Redirect to login page after toast
            });
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Failed to register. Please try again.', {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Show a loading message while loading context state
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
