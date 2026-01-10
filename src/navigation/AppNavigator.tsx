import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigation';
import MainTabNavigator from './MainTabNavigator';
import LoadingSpinner from '../components/common/LoadingScreen';

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulasi cek auth status
  useEffect(() => {
    // Untuk testing, set false agar tetap di login screen
    const timer = setTimeout(() => {
      setIsAuthenticated(false); // SET FALSE untuk testing
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Simple login function
  const handleLoginSuccess = () => {
    console.log('Login success! Navigating to main...');
    setIsAuthenticated(true);
  };

  // Simple logout function  
  const handleLogout = () => {
    console.log('Logging out...');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  console.log('Current auth state:', isAuthenticated ? 'AUTHENTICATED' : 'NOT AUTHENTICATED');

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <MainTabNavigator onLogout={handleLogout} />
      ) : (
        <AuthNavigator onLoginSuccess={handleLoginSuccess} />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;