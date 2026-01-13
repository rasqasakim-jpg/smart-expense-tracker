import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

interface AppContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

const AppContainer: React.FC<AppContainerProps> = ({
  children,
  backgroundColor = '#f8f9fa',
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={backgroundColor}
      />
      <View style={styles.container}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
});

export default AppContainer;