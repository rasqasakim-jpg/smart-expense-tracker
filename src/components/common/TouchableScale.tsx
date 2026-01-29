import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleProp,
  ViewStyle,
  TouchableOpacityProps,
  GestureResponderEvent,
} from 'react-native';

interface TouchableScaleProps extends TouchableOpacityProps {
  scaleTo?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const TouchableScale: React.FC<TouchableScaleProps> = ({
  scaleTo = 0.97,
  children,
  style,
  onPressIn,
  onPressOut,
  disabled,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (event: GestureResponderEvent) => {
    Animated.spring(scaleAnim, {
      toValue: scaleTo,
      useNativeDriver: true,
      speed: 50,
    }).start();
    
    if (onPressIn) onPressIn(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
    
    if (onPressOut) onPressOut(event);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      {...props}
    >
      <Animated.View
        style={[
          style,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default TouchableScale;