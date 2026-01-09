import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppContainer from '../../components/layout/AppContainer';
import ScreenHeader from '../../components/layout/ScreenHeader';

const HomeScreen = () => {
  return (
    <AppContainer>
      <ScreenHeader title="Dashboard" />
      <View style={styles.content}>
        <Text style={styles.welcome}>Selamat Datang!</Text>
        <Text style={styles.subtitle}>
          Mulai kelola keuangan Anda dengan mudah
        </Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Saldo Anda</Text>
          <Text style={styles.balance}>Rp 0</Text>
          <Text style={styles.cardSubtitle}>Belum ada transaksi</Text>
        </View>
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#888',
  },
});

export default HomeScreen;