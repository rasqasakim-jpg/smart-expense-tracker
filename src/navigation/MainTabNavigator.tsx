import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';

// Import screens yang sebenarnya
import HomeScreen from '../screens/main/HomeScreen';
// import TransactionsScreen from '../screens/main/TransactionsScreen';
// import AddTransactionScreen from '../screens/main/AddTransactionScreen';
// import WalletsScreen from '../screens/main/WalletsScreen';
// import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Transactions') iconName = 'list';
          else if (route.name === 'Add') iconName = 'add-circle';
          else if (route.name === 'Wallets') iconName = 'account-balance-wallet';
          else if (route.name === 'Profile') iconName = 'person';
          
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#6c757d',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      {/* <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen 
        name="Add" 
        component={AddTransactionScreen}
        options={{
          tabBarLabel: 'Tambah',
        }}
      />
      <Tab.Screen name="Wallets" component={WalletsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
};

export default MainTabNavigator;