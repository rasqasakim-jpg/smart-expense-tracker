import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './ProfileScreen';
import ActivityStackNavigator from '../activity/ActivityStackNavigator';

// Define stack param list
export type ProfileStackParamList = {
  ProfileMain: undefined;
  ActivityLog: undefined;
};

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F8F9FA' },
      }}
      initialRouteName='ProfileMain'
    >
      <Stack.Screen 
      name="ProfileMain" 
      component={ProfileScreen} 
      />
      <Stack.Screen 
      name="ActivityLog" 
      component={ActivityStackNavigator} 
      options={{
        presentation: 'card'
      }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;