import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WalletListScreen from '../wallet/WalletListScreen';
import WalletDetailScreen from '../wallet/WalletDetailScreen';
import WalletFormScreen from '../wallet/WalletFormScreen';

export type WalletStackParamList = {
  WalletList: undefined;
  WalletDetail: { wallet: any };
  WalletForm: { wallet?: any };
};

const Stack = createStackNavigator<WalletStackParamList>();

const WalletsScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f8f9fa' },
      }}
    >
      <Stack.Screen name="WalletList" component={WalletListScreen} />
      <Stack.Screen name="WalletDetail" component={WalletDetailScreen} />
      <Stack.Screen name="WalletForm" component={WalletFormScreen} />
    </Stack.Navigator>
  );
};

export default WalletsScreen;