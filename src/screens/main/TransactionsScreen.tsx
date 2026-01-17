import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TransactionListScreen from '../transaction/TransactionListScreen';
import TransactionDetailScreen from '../transaction/TransactionDetailScreen';
import TransactionFormScreen from '../transaction/TransactionFormScreen';
import { TransactionStackParamList } from '../../types/transaction';

const Stack = createStackNavigator<TransactionStackParamList>();

const TransactionsScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f8f9fa' },
      }}
    >
      <Stack.Screen name="TransactionList" component={TransactionListScreen} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      <Stack.Screen name="TransactionForm" component={TransactionFormScreen} />
    </Stack.Navigator>
  );
};

export default TransactionsScreen;