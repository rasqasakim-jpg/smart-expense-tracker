// COLOR PALETTE - Konsisten di semua screen
export const colors = {
  // Primary
  primary: '#007bff',
  primaryLight: '#cfe2ff',
  primaryDark: '#0056b3',
  
  // Secondary
  secondary: '#6c757d',
  secondaryLight: '#e9ecef',
  secondaryDark: '#495057',
  
  // Semantic
  success: '#28a745',
  successLight: '#d4edda',
  danger: '#dc3545',
  dangerLight: '#f8d7da',
  warning: '#ffc107',
  warningLight: '#fff3cd',
  info: '#17a2b8',
  infoLight: '#d1ecf1',
  
  // Neutral
  white: '#ffffff',
  light: '#f8f9fa',
  gray: '#e9ecef',
  darkGray: '#6c757d',
  dark: '#343a40',
  black: '#1a1a1a',
  
  // Backgrounds
  background: '#f8f9fa',
  cardBackground: '#ffffff',
  
  // Text
  textPrimary: '#1a1a1a',
  textSecondary: '#6c757d',
  textLight: '#ffffff',
  
  // Borders
  border: '#dee2e6',
  borderLight: '#eaeaea',
};

// TYPOGRAPHY - Font sizes yang konsisten
export const typography = {
  // Font Sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  body: 14,
  small: 12,
  tiny: 10,
  
  // Font Weights
  regular: 400 as const,
  medium: 500 as const,
  semiBold: 600 as const,
  bold: 700 as const,
  
  // Line Heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightLoose: 1.8,
};

// SPACING - 8px grid system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// BORDER RADIUS - Konsisten
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

// SHADOWS - Elevation konsisten
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
};

// ANIMATION TIMINGS
export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
};