import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BudgetListScreen from '../budget/BudgetListScreen';
import BudgetFormScreen from '../budget/BudgetFormScreen';
import BudgetDetailScreen from '../budget/BudgetDetailScreen';
import { BudgetStackParamList } from '../../types/budget';

const Stack = createStackNavigator<BudgetStackParamList>();

const BudgetScreenWrapper = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f8f9fa' },
      }}
    >
      <Stack.Screen name="BudgetList" component={BudgetListScreen} />
      <Stack.Screen name="BudgetForm" component={BudgetFormScreen} />
      <Stack.Screen name="BudgetDetail" component={BudgetDetailScreen} />
    </Stack.Navigator>
  );
};

export default BudgetScreenWrapper;