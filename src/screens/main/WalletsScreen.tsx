import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppContainer from '../../components/layout/AppContainer';
import ScreenHeader from '../../components/layout/ScreenHeader';

const WalletsScreen = () => {
  return (
    <AppContainer>
      <ScreenHeader title="Dompet" />
      <View style={styles.content}>
        <Text>Daftar dompet akan ditampilkan di sini</Text>
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default WalletsScreen;