import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { MascotMood } from '@/types';

interface MascotCharacterProps {
  size?: number;
  mood?: MascotMood;
  streakCount?: number;
}

export function MascotCharacter({ size = 120, mood = 'idle', streakCount = 0 }: MascotCharacterProps) {
  const bounceY = useSharedValue(0);
  const scaleVal = useSharedValue(1);
  const rotateVal = useSharedValue(0);

  const starColor = streakCount >= 30 ? '#FF2D00' : streakCount >= 14 ? '#FF4500' : streakCount >= 7 ? '#FFD700' : '#FFB800';

  useEffect(() => {
    if (mood === 'idle') {
      bounceY.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 700, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 700, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else if (mood === 'celebrate') {
      scaleVal.value = withSequence(
        withSpring(1.3),
        withSpring(1.0),
        withSpring(1.2),
        withSpring(1.0)
      );
      rotateVal.value = withSequence(
        withTiming(-15, { duration: 150 }),
        withTiming(15, { duration: 150 }),
        withTiming(-10, { duration: 150 }),
        withTiming(10, { duration: 150 }),
        withTiming(0, { duration: 150 })
      );
      bounceY.value = withSequence(
        withTiming(-30, { duration: 300 }),
        withTiming(0, { duration: 300 }),
        withTiming(-15, { duration: 200 }),
        withTiming(0, { duration: 200 })
      );
    } else if (mood === 'happy') {
      scaleVal.value = withSequence(withSpring(1.15), withSpring(1.0));
      bounceY.value = withSequence(
        withTiming(-15, { duration: 300 }),
        withTiming(0, { duration: 300 })
      );
    }
  }, [mood]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounceY.value },
      { scale: scaleVal.value },
      { rotate: `${rotateVal.value}deg` },
    ],
  }));

  const eyeSize = size * 0.12;
  const eyeOffset = size * 0.16;
  const eyeTop = size * 0.3;

  return (
    <Animated.View style={[styles.wrapper, containerStyle]}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons name="star-four-points" size={size} color={starColor} />
        {/* Eyes */}
        <View style={[styles.eye, { width: eyeSize, height: eyeSize, borderRadius: eyeSize / 2, left: size / 2 - eyeOffset, top: eyeTop, position: 'absolute' }]} />
        <View style={[styles.eye, { width: eyeSize, height: eyeSize, borderRadius: eyeSize / 2, left: size / 2 + eyeOffset - eyeSize, top: eyeTop, position: 'absolute' }]} />
        {/* Blush */}
        <View style={[styles.blush, { width: eyeSize * 1.2, height: eyeSize * 0.7, borderRadius: eyeSize, left: size / 2 - eyeOffset - eyeSize * 0.2, top: eyeTop + eyeSize * 1.4, position: 'absolute' }]} />
        <View style={[styles.blush, { width: eyeSize * 1.2, height: eyeSize * 0.7, borderRadius: eyeSize, left: size / 2 + eyeOffset - eyeSize * 1.0, top: eyeTop + eyeSize * 1.4, position: 'absolute' }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  eye: {
    backgroundColor: '#1A1A2E',
  },
  blush: {
    backgroundColor: '#FFB3C6',
    opacity: 0.6,
  },
});
