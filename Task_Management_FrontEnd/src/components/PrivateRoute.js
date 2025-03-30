// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom'; // Use Navigate for redirection
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element: Element, ...rest }) => {
    const { token } = useAuth();

    // If the user is authenticated, render the component, else redirect to login
    return token ? <Element {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
