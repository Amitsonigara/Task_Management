import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import { AuthProvider } from '../src/context/AuthContext';
import LoginPage from '../src/pages/LoginPage';
import RegisterPage from '../src/pages/RegisterPage';
import TaskListPage from '../src/pages/TaskListPage';
import UserDetailsPage from '../src/pages/UserDetailsPage';
import HomePage from '../src/pages/HomePage'; // Import HomePage
import Navbar from '../src/components/Navbar'; // Import Navbar

function App() {
  return (
    <Router> {/* Wrap the entire app with Router */}
      <AuthProvider> {/* Then wrap AuthProvider inside Router */}
        {/* Navbar will appear on all pages except login and register */}
        <Navbar />
        
        <Routes>
          {/* HomePage is the default route (loads first when visiting the app) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/user-details" element={<UserDetailsPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
