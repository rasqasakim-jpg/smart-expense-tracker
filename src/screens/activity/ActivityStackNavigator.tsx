import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ActivityLogScreen from './ActivityLogScreen';
import ActivityDetailScreen from './ActivityDetailScreen';

// Define stack param list secara lokal
export type ActivityStackParamList = {
  ActivityLog: undefined;
  ActivityDetail: { activityId: number };
};

const Stack = createStackNavigator<ActivityStackParamList>();

const ActivityStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f8f9fa' },
      }}
    >
      <Stack.Screen 
        name="ActivityLog" 
        component={ActivityLogScreen} 
      />
      <Stack.Screen 
        name="ActivityDetail" 
        component={ActivityDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default ActivityStackNavigator;