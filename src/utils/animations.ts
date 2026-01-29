import { Animated, Easing } from 'react-native';

// Fade In Animation
export const fadeIn = (value: Animated.Value, duration: number = 300) => {
  return Animated.timing(value, {
    toValue: 1,
    duration,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  });
};

// Fade Out Animation
export const fadeOut = (value: Animated.Value, duration: number = 300) => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    easing: Easing.in(Easing.ease),
    useNativeDriver: true,
  });
};

// Scale Animation
export const scaleIn = (value: Animated.Value, duration: number = 300) => {
  return Animated.spring(value, {
    toValue: 1,
    friction: 8,
    tension: 40,
    useNativeDriver: true,
  });
};

// Slide In from Bottom
export const slideInUp = (value: Animated.Value, duration: number = 400) => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    easing: Easing.out(Easing.back(1)),
    useNativeDriver: true,
  });
};

// Bounce Animation
export const bounce = (value: Animated.Value) => {
  return Animated.sequence([
    Animated.timing(value, {
      toValue: 1.1,
      duration: 150,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }),
  ]);
};

// Shake Animation (for errors)
export const shake = (value: Animated.Value) => {
  return Animated.sequence([
    Animated.timing(value, { toValue: 10, duration: 50, useNativeDriver: true }),
    Animated.timing(value, { toValue: -10, duration: 50, useNativeDriver: true }),
    Animated.timing(value, { toValue: 10, duration: 50, useNativeDriver: true }),
    Animated.timing(value, { toValue: 0, duration: 50, useNativeDriver: true }),
  ]);
};

// Stagger children animations
export const stagger = (
  animatedValues: Animated.Value[],
  delay: number = 100
) => {
  const animations = animatedValues.map((value, index) =>
    Animated.sequence([
        Animated.delay(index * delay),
        fadeIn(value)
    ])
)
  return Animated.stagger(delay, animations);
};