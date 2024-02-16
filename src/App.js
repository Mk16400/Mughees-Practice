// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import SignIn from './Pages/login';
import Dashboard from './Pages/Dashboard';
import RecipeForm from './Components/RecipeForm';
import { auth } from './firebase';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // Additional admin check can be implemented here if needed
        setUser(user);
        setIsLoading(false);
      } else {
        navigate('/');
      }
    });
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // or any loading spinner
  }

  return user ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/recipeform" element={<ProtectedRoute><RecipeForm /></ProtectedRoute>} /> 
      </Routes>
    </BrowserRouter>
  );
};

export default App;
