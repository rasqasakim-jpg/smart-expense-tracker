import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        backgroundColor="#007AFF" 
        barStyle="light-content" 
      />
      
      <View style={styles.content}>
        {/* Icon Wallet */}
        <Ionicons 
          name="wallet" 
          size={80} 
          color="#fff" 
          style={styles.icon}
        />
        
        {/* Text "Smart Expense" */}
        <Text style={styles.title}>Smart Expense</Text>
        
        {/* Text "Tracker" di bawah */}
        <Text style={styles.subtitle}>Tracker</Text>
      </View>
      
      {/* Loading indicator di bawah */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingDot} />
        <View style={styles.loadingDot} />
        <View style={styles.loadingDot} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: 50,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#fff',
    marginTop: -5,
    letterSpacing: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 60,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    opacity: 0.6,
  },
});

export default SplashScreen;