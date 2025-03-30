// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // Import AuthContext to get user data
import { AccountCircle } from '@mui/icons-material';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login page after logout
        handleProfileClose();
    };

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Task Manager
                </Typography>
                
                {/* Show login/register if user is not logged in */}
                {!user ? (
                    <>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/register">Register</Button>
                    </>
                ) : (
                        <>
                                 <Button color="inherit" component={Link} to="/tasks">Tasks</Button>
           
                        {/* Show profile icon if user is logged in */}
                        <IconButton color="inherit" onClick={handleProfileClick}>
                            <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleProfileClose}
                        >
                            <MenuItem onClick={() => navigate('/user-details')}>User Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
