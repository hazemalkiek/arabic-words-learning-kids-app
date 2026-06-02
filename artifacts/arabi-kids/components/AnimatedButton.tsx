import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface AnimatedButtonProps {
  onPress: () => void;
  label: string;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
  size?: 'small' | 'normal' | 'large';
}

export function AnimatedButton({
  onPress,
  label,
  color = '#FF6B35',
  textColor = '#FFFFFF',
  style,
  labelStyle,
  disabled,
  size = 'normal',
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.93, { duration: 80 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 14, stiffness: 180 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View style={[animStyle, style]}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
        style={[
          styles.button,
          { backgroundColor: disabled ? '#CCCCCC' : color },
          size === 'large' && styles.large,
          size === 'small' && styles.small,
        ]}
      >
        <Text style={[styles.label, { color: disabled ? '#888' : textColor }, size === 'large' && styles.labelLarge, size === 'small' && styles.labelSmall, labelStyle]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 28,
  },
  small: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 0.3,
  },
  labelLarge: {
    fontSize: 22,
  },
  labelSmall: {
    fontSize: 14,
  },
});
