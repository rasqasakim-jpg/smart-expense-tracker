import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './ProfileScreen';
import ActivityStackNavigator from '../activity/ActivityStackNavigator';
import BudgetListScreen from '../budget/BudgetListScreen';
import BudgetFormScreen from '../budget/BudgetFormScreen';
import BudgetDetailScreen from '../budget/BudgetDetailScreen';
import LanguageScreen from '../profile/LanguageScreen';
import SecurityScreen from '../profile/SecurityScreen';
import SettingsScreen from '../profile/SettingsScreen'; 
import ChangePasswordScreen from '../profile/ChangePasswordScreen';

// Update param list dengan Settings
export type ProfileStackParamList = {
  ProfileMain: undefined;
  ActivityLog: undefined;
  Budget: undefined;
  BudgetForm: { budget?: any };
  BudgetDetail: { budgetId: number };
  Language: undefined;
  Security: undefined;
  ChangePassword: undefined;
  Settings: undefined;
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
      {/* Main Profile Screen */}
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
      />
      
      {/* Activity Log */}
      <Stack.Screen 
        name="ActivityLog" 
        component={ActivityStackNavigator} 
        options={{
          presentation: 'card'
        }}
      />
      
      {/* Budget Screens */}
      <Stack.Screen 
        name="Budget" 
        component={BudgetListScreen} 
        options={{
          presentation: 'card'
        }}
      />
      
      <Stack.Screen 
        name="BudgetForm" 
        component={BudgetFormScreen} 
        options={{
          presentation: 'modal'
        }}
      />
      
      <Stack.Screen 
        name="BudgetDetail" 
        component={BudgetDetailScreen} 
        options={{
          presentation: 'card'
        }}
      />
      
      {/* Settings Screens */}
      <Stack.Screen 
        name="Language" 
        component={LanguageScreen} 
        options={{
          presentation: 'card'
        }}
      />
      
      <Stack.Screen 
        name="Security" 
        component={SecurityScreen} 
        options={{
          presentation: 'card'
        }}
      />
      
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen} 
        options={{
          presentation: 'card'
        }}
      />
      
      {/* New Settings Screen */}
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          presentation: 'card'
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;