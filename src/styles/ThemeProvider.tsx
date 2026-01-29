import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './designSysttem';

interface Theme {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  isDark: boolean;
}

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Dark mode colors (optional untuk masa depan)
  const themeColors = isDark ? {
    ...colors,
    background: '#121212',
    cardBackground: '#1e1e1e',
    textPrimary: '#ffffff',
    textSecondary: '#b0b0b0',
  } : colors;
  
  const theme: Theme = {
    colors: themeColors,
    typography,
    spacing,
    borderRadius,
    shadows,
    isDark,
  };
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};