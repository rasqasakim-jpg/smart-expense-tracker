import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './DashboardScreen';
import TransactionListScreen from '../transaction/TransactionListScreen';
import TransactionDetailScreen from '../transaction/TransactionDetailScreen';
import { DashboardStackParamList } from './DashboardScreen';

const Stack = createStackNavigator<DashboardStackParamList>();

const DashboardScreenWrapper = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f8f9fa' },
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="TransactionList" component={TransactionListScreen} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
    </Stack.Navigator>
  );
};

export default DashboardScreenWrapper;