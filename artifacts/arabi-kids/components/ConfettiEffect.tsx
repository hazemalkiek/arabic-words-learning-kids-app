import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

const COLORS = ['#FF6B35', '#FF4D9E', '#FFD700', '#00BBF9', '#6BCB77', '#9B5DE5', '#4ECDC4', '#FF6B6B'];
const PARTICLE_COUNT = 24;

interface ParticleProps {
  index: number;
  color: string;
  active: boolean;
}

function ConfettiParticle({ index, color, active }: ParticleProps) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    if (active) {
      const angle = (index / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
      const distance = 80 + (index % 4) * 35;
      const delay = (index % 6) * 40;
      x.value = withDelay(delay, withTiming(Math.cos(angle) * distance, { duration: 900 }));
      y.value = withDelay(delay, withTiming(Math.sin(angle) * distance + 20, { duration: 900 }));
      opacity.value = withDelay(delay, withSequence(
        withTiming(1, { duration: 80 }),
        withDelay(500, withTiming(0, { duration: 400 }))
      ));
      scale.value = withDelay(delay, withSpring(1 + (index % 3) * 0.3, { damping: 10 }));
    } else {
      x.value = 0;
      y.value = 0;
      opacity.value = 0;
      scale.value = 0;
    }
  }, [active]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
      { rotate: `${(index * 37) % 360}deg` },
    ],
    opacity: opacity.value,
  }));

  const isSquare = index % 3 === 0;
  const size = 8 + (index % 3) * 3;

  return (
    <Animated.View
      style={[
        { position: 'absolute', backgroundColor: color, width: size, height: size },
        isSquare ? { borderRadius: 2 } : { borderRadius: size / 2 },
        style,
      ]}
    />
  );
}

export function ConfettiEffect({ active }: { active: boolean }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.center}>
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <ConfettiParticle key={i} index={i} color={COLORS[i % COLORS.length]} active={active} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
