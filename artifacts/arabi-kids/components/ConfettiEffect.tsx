import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

const COLORS = [
  '#FF6B35', '#FF4D9E', '#FFD700', '#00BBF9',
  '#6BCB77', '#9B5DE5', '#4ECDC4', '#FF6B6B',
  '#FFFFFF', '#FF8B42', '#A8E063', '#F72585',
];

const PARTICLE_COUNT = 60;

interface ParticleProps {
  index: number;
  color: string;
  active: boolean;
  screenW: number;
  screenH: number;
}

function ConfettiParticle({ index, color, active, screenW, screenH }: ParticleProps) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scaleX = useSharedValue(0);
  const scaleY = useSharedValue(0);

  useEffect(() => {
    if (active) {
      const seed = index * 137.508;
      const angle = ((seed % 360) * Math.PI) / 180;
      const spread = 0.6 + (index % 5) * 0.12;
      const hSpeed = Math.cos(angle) * (screenW * spread * 0.5);
      const vLaunch = -(80 + (index % 8) * 30);
      const vFall = screenH * 0.55 + (index % 5) * 40;
      const delay = (index % 12) * 35;
      const upDur = 380 + (index % 4) * 60;
      const fallDur = 700 + (index % 6) * 80;
      const totalDur = upDur + fallDur;

      x.value = withDelay(delay, withTiming(hSpeed, { duration: totalDur, easing: Easing.out(Easing.quad) }));
      y.value = withDelay(delay, withSequence(
        withTiming(vLaunch, { duration: upDur, easing: Easing.out(Easing.cubic) }),
        withTiming(vFall, { duration: fallDur, easing: Easing.in(Easing.quad) })
      ));
      rotate.value = withDelay(delay, withTiming(
        (index % 2 === 0 ? 1 : -1) * (360 + (index % 3) * 180),
        { duration: totalDur, easing: Easing.linear }
      ));
      opacity.value = withDelay(delay, withSequence(
        withTiming(1, { duration: 80 }),
        withDelay(totalDur - 280, withTiming(0, { duration: 280 }))
      ));
      scaleX.value = withDelay(delay, withSpring(0.7 + (index % 4) * 0.25, { damping: 6, stiffness: 120 }));
      scaleY.value = withDelay(delay, withSpring(0.7 + (index % 3) * 0.3, { damping: 6, stiffness: 120 }));
    } else {
      x.value = 0; y.value = 0; opacity.value = 0;
      rotate.value = 0; scaleX.value = 0; scaleY.value = 0;
    }
  }, [active]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scaleX: scaleX.value },
      { scaleY: scaleY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const type = index % 3;
  const baseSize = 7 + (index % 5) * 2;

  return (
    <Animated.View style={[
      styles.particle,
      { backgroundColor: color },
      type === 0
        ? { width: baseSize, height: baseSize, borderRadius: baseSize / 2 }
        : type === 1
        ? { width: baseSize * 0.45, height: baseSize * 2.2, borderRadius: 2 }
        : { width: baseSize, height: baseSize, borderRadius: 2, transform: [{ rotate: '45deg' }] },
      style,
    ]} />
  );
}

export function ConfettiEffect({ active }: { active: boolean }) {
  const { width, height } = useWindowDimensions();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[styles.origin, { top: height * 0.42, left: width / 2 }]}>
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <ConfettiParticle
            key={i}
            index={i}
            color={COLORS[i % COLORS.length]}
            active={active}
            screenW={width}
            screenH={height}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  origin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
  },
});
