import React from 'react';
import { CategoryProvider } from './src/store/contexts/CategoryContext';
import { WalletProvider } from './src/store/contexts/WalletProvider';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <CategoryProvider>
      <WalletProvider>
        <AppNavigator />
      </WalletProvider>
    </CategoryProvider>
  );
};

export default App;