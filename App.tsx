import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigation';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

const Root = () => {
  const { userToken, loading, signOut } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // When authenticated, show the main tab navigator and wire logout to AuthContext
  return userToken ? <MainTabNavigator onLogout={signOut} /> : <AuthNavigator />;
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;