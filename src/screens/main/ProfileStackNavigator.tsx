import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './ProfileScreen';
import ActivityStackNavigator from '../activity/ActivityStackNavigator';
import BudgetListScreen from '../budget/BudgetListScreen';
import BudgetFormScreen from '../budget/BudgetFormScreen';
import BudgetDetailScreen from '../budget/BudgetDetailScreen';

// Define stack param list dengan Budget
export type ProfileStackParamList = {
  ProfileMain: undefined;
  ActivityLog: undefined;
  Budget: undefined;
  BudgetForm: { budget?: any };
  BudgetDetail: { budgetId: number };
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
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;