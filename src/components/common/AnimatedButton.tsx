import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../styles/designSystem';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  // Get button styles based on type
  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.md,
    };

    switch (type) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.secondaryLight : colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.secondaryLight : colors.secondary,
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.secondaryLight : colors.success,
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.secondaryLight : colors.danger,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? colors.secondary : colors.primary,
        };
      default:
        return baseStyle;
    }
  };

  // Get text color based on type
  const getTextColor = () => {
    if (type === 'outline') {
      return disabled ? colors.secondary : colors.primary;
    }
    return colors.textLight;
  };

  // Get size styles
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm };
      case 'large':
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
      default:
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
    }
  };

  // Get font size
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return typography.small;
      case 'large':
        return typography.h5;
      default:
        return typography.body;
    }
  };

  const handlePressIn = () => {
    if (disabled || loading) return;
    
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (disabled || loading) return;
    
    // Button press animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress();
  };

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: disabled ? 0.6 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [disabled]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled || loading}
      style={{ width: fullWidth ? '100%' : 'auto' }}
    >
      <Animated.View
        style={[
          styles.button,
          getButtonStyle(),
          getSizeStyle(),
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={type === 'outline' ? colors.primary : colors.textLight} 
          />
        ) : (
          <>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text
              style={[
                styles.text,
                {
                  color: getTextColor(),
                  fontSize: getFontSize(),
                  fontWeight: typography.semiBold,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    textAlign: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
});

export default AnimatedButton;