import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddTransactionScreen from '../transaction/AddTransactionScreen';

export type AddTransactionStackParamList = {
  AddTransaction: undefined;
};

const Stack = createStackNavigator<AddTransactionStackParamList>();

const AddTransactionStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
    </Stack.Navigator>
  );
};

export default AddTransactionStack;