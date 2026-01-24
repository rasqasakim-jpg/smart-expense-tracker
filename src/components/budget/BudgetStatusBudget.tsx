import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

interface BudgetStatusBadgeProps {
  status: 'HEMAT' | 'NORMAL' | 'BOROS';
  size?: 'small' | 'medium' | 'large';
}

const BudgetStatusBadge: React.FC<BudgetStatusBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  // Konfigurasi untuk setiap status
  const getStatusConfig = () => {
    switch (status) {
      case 'HEMAT':
        return {
          color: '#28a745',
          bgColor: '#d4edda',
          borderColor: '#c3e6cb',
          icon: 'trending-down',
          text: 'HEMAT',
        };
      case 'NORMAL':
        return {
          color: '#ffc107',
          bgColor: '#fff3cd',
          borderColor: '#ffeaa7',
          icon: 'remove-outline',
          text: 'NORMAL',
        };
      case 'BOROS':
        return {
          color: '#dc3545',
          bgColor: '#f8d7da',
          borderColor: '#f5c6cb',
          icon: 'trending-up',
          text: 'BOROS',
        };
      default:
        return {
          color: '#6c757d',
          bgColor: '#e9ecef',
          borderColor: '#dee2e6',
          icon: 'pie-chart-outline',
          text: 'UNKNOWN',
        };
    }
  };

  const config = getStatusConfig();

  // Konfigurasi size
  const sizeConfig = {
    small: { 
      paddingHorizontal: 8, 
      paddingVertical: 4, 
      fontSize: 10, 
      iconSize: 12,
      borderRadius: 10,
    },
    medium: { 
      paddingHorizontal: 12, 
      paddingVertical: 6, 
      fontSize: 12, 
      iconSize: 14,
      borderRadius: 12,
    },
    large: { 
      paddingHorizontal: 16, 
      paddingVertical: 8, 
      fontSize: 14, 
      iconSize: 16,
      borderRadius: 14,
    },
  };

  const { paddingHorizontal, paddingVertical, fontSize, iconSize, borderRadius } = sizeConfig[size];

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
        paddingHorizontal,
        paddingVertical,
        borderRadius,
      }
    ]}>
      <Ionicons 
        name={config.icon as any} 
        size={iconSize} 
        color={config.color} 
        style={styles.icon}
      />
      <Text style={[
        styles.text,
        { 
          color: config.color,
          fontSize: fontSize,
        }
      ]}>
        {config.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '600',
  },
});

export default BudgetStatusBadge;