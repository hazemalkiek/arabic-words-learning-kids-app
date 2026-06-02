import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSpring,
  withDelay, withSequence, SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MascotCharacter } from '@/components/MascotCharacter';

const ONBOARDED_KEY = '@arabi_onboarded';

export async function markOnboarded() {
  await AsyncStorage.setItem(ONBOARDED_KEY, 'true');
}

export async function hasOnboarded(): Promise<boolean> {
  const v = await AsyncStorage.getItem(ONBOARDED_KEY);
  return v === 'true';
}

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const mascotY = useSharedValue(120);
  const mascotOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.7);
  const taglineOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);
  const btnY = useSharedValue(24);
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    // Mascot bounces up
    mascotY.value = withSpring(0, { damping: 12, stiffness: 80 });
    mascotOpacity.value = withTiming(1, { duration: 500 });

    // Title fades + pops in
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    titleScale.value = withDelay(400, withSpring(1, { damping: 10 }));

    // Tagline slides in
    taglineOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));

    // CTA button
    btnOpacity.value = withDelay(1200, withTiming(1, { duration: 400 }));
    btnY.value = withDelay(1200, withSpring(0, { damping: 14 }));

    // Decorative dots pulse
    const dotPulse = (sv: SharedValue<number>, delay: number) => {
      const loop = () => {
        sv.value = withDelay(delay, withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.3, { duration: 600 }),
        ));
        setTimeout(loop, 1200 + delay);
      };
      setTimeout(loop, 1600 + delay);
    };
    dotPulse(dot1, 0);
    dotPulse(dot2, 200);
    dotPulse(dot3, 400);
  }, []);

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: mascotY.value }],
    opacity: mascotOpacity.value,
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));
  const taglineStyle = useAnimatedStyle(() => ({ opacity: taglineOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
    transform: [{ translateY: btnY.value }],
  }));
  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dot3.value }));

  const handleStart = async () => {
    await markOnboarded();
    router.replace('/');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Decorative background circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.content}>
        {/* Mascot */}
        <Animated.View style={[styles.mascotWrap, mascotStyle]}>
          <MascotCharacter size={160} mood="celebrate" streakCount={5} />
        </Animated.View>

        {/* Title */}
        <Animated.Text style={[styles.title, titleStyle]}>عربي</Animated.Text>

        {/* Tagline */}
        <Animated.View style={[styles.taglineWrap, taglineStyle]}>
          <Text style={styles.tagline}>Arabic for Kids</Text>
          <Text style={styles.taglineSub}>
            Discover 120 Arabic words through games, illustrations, and songs!
          </Text>
        </Animated.View>

        {/* Dots */}
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, { backgroundColor: '#FF6B35' }, dot1Style]} />
          <Animated.View style={[styles.dot, { backgroundColor: '#4ECDC4' }, dot2Style]} />
          <Animated.View style={[styles.dot, { backgroundColor: '#9B5DE5' }, dot3Style]} />
        </View>

        {/* Feature pills */}
        <Animated.View style={[styles.pillsRow, taglineStyle]}>
          {['🎮 3 Game Modes', '📚 120 Words', '🏆 Trophies'].map((pill) => (
            <View key={pill} style={styles.pill}>
              <Text style={styles.pillText}>{pill}</Text>
            </View>
          ))}
        </Animated.View>

        {/* CTA button */}
        <Animated.View style={[styles.btnWrap, btnStyle]}>
          <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.85}>
            <Text style={styles.startBtnText}>Let's Start!</Text>
            <Text style={styles.startBtnArabic}>هيا بنا!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  bgCircle1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: '#FF6B3512', top: -60, right: -80,
  },
  bgCircle2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: '#4ECDC420', bottom: 40, left: -60,
  },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  mascotWrap: { marginBottom: 16 },
  title: {
    fontFamily: 'Nunito_800ExtraBold', fontSize: 72, color: '#FF6B35',
    letterSpacing: 2, writingDirection: 'rtl',
  },
  taglineWrap: { alignItems: 'center', marginTop: 8 },
  tagline: { fontFamily: 'Nunito_700Bold', fontSize: 22, color: '#1A1A2E' },
  taglineSub: {
    fontFamily: 'Nunito_400Regular', fontSize: 15, color: '#8A7E74',
    textAlign: 'center', marginTop: 8, lineHeight: 22,
  },
  dotsRow: { flexDirection: 'row', gap: 10, marginTop: 24 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  pillsRow: { flexDirection: 'row', gap: 10, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' },
  pill: {
    backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  pillText: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: '#1A1A2E' },
  btnWrap: { width: '100%', alignItems: 'center', marginTop: 40 },
  startBtn: {
    backgroundColor: '#FF6B35', borderRadius: 28, paddingVertical: 20, paddingHorizontal: 48,
    alignItems: 'center', shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  startBtnText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 24, color: '#FFFFFF' },
  startBtnArabic: { fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 2, writingDirection: 'rtl' },
});
