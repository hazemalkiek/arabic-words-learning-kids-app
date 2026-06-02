import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform, Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { ConfettiEffect } from '@/components/ConfettiEffect';
import { getWordsByLevel } from '@/constants/words';
import { TROPHIES } from '@/constants/trophies';
import { STICKERS } from '@/constants/stickers';
import { Difficulty, Theme } from '@/types';
import { THEME_IMAGES } from '@/constants/images';
import { playLevelComplete, playUnlock } from '@/utils/soundEffects';

function StarDisplay({ stars }: { stars: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[1, 2, 3].map((s) => (
        <MaterialCommunityIcons key={s} name={s <= stars ? 'star' : 'star-outline'} size={40} color={s <= stars ? '#FFD700' : '#DDD'} />
      ))}
    </View>
  );
}

export default function LearnGameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { markWordSeen, completeLevel, addTimeSpent } = useApp();
  const sessionStartRef = React.useRef(Date.now());

  const parts = (id ?? '').split('-');
  const difficulty = parts[parts.length - 1] as Difficulty;
  const theme = parts.slice(0, -1).join('-') as Theme;
  const words = getWordsByLevel(theme, difficulty);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newTrophies, setNewTrophies] = useState<string[]>([]);
  const [newStickers, setNewStickers] = useState<string[]>([]);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const progressAnim = useSharedValue(0);
  const cardScale = useSharedValue(0.9);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    return () => { Speech.stop(); };
  }, []);

  const showWord = useCallback((index: number) => {
    if (index >= words.length) return;
    cardScale.value = withSpring(1, { damping: 14 });
    cardOpacity.value = withTiming(1, { duration: 300 });
    progressAnim.value = withTiming((index + 1) / words.length, { duration: 400 });
    const word = words[index];
    setTimeout(() => {
      Speech.stop();
      Speech.speak(word.arabic, { language: 'ar', rate: 0.75 });
    }, 400);
  }, [words]);

  useEffect(() => {
    if (words.length > 0) showWord(0);
  }, []);

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const word = words[currentIndex];
    await markWordSeen(word.id);

    cardScale.value = withTiming(0.85, { duration: 200 });
    cardOpacity.value = withTiming(0, { duration: 200 });

    setTimeout(async () => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= words.length) {
        const elapsedMinutes = (Date.now() - sessionStartRef.current) / 60000;
        await addTimeSpent(Math.round(elapsedMinutes));
        const rewards = await completeLevel(id!, 3);
        setNewTrophies(rewards.trophies);
        setNewStickers(rewards.stickers);
        setIsCompleted(true);
        setShowConfetti(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (rewards.trophies.length > 0 || rewards.stickers.length > 0) {
          playUnlock();
        } else {
          playLevelComplete();
        }
      } else {
        setCurrentIndex(nextIndex);
        showWord(nextIndex);
      }
    }, 220);
  };

  const handleSpeak = () => {
    const word = words[currentIndex];
    Speech.stop();
    Speech.speak(word.arabic, { language: 'ar', rate: 0.75 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  if (words.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: topPad, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={styles.errorText}>No words found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.nextLabel}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isCompleted) {
    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <ConfettiEffect active={showConfetti} />
        <View style={styles.completedContainer}>
          <MaterialCommunityIcons name="trophy" size={80} color="#FFD700" />
          <Text style={styles.completedTitle}>رائع!</Text>
          <Text style={styles.completedSub}>Excellent! Level Complete!</Text>
          <StarDisplay stars={3} />
          {(newTrophies.length > 0 || newStickers.length > 0) && (
            <View style={styles.newTrophySection}>
              {newTrophies.length > 0 && (
                <>
                  <Text style={styles.newTrophyLabel}>🏆 New Trophies!</Text>
                  {newTrophies.map((tid) => {
                    const t = TROPHIES.find(tr => tr.id === tid);
                    return t ? (
                      <View key={tid} style={styles.newTrophyRow}>
                        <MaterialCommunityIcons name={t.icon as any} size={22} color={t.color} />
                        <Text style={styles.newTrophyTitle}>{t.title}</Text>
                      </View>
                    ) : null;
                  })}
                </>
              )}
              {newStickers.length > 0 && (
                <>
                  <Text style={[styles.newTrophyLabel, { color: '#FF4D9E' }]}>✨ New Stickers!</Text>
                  {newStickers.map((sid) => {
                    const s = STICKERS.find(st => st.id === sid);
                    return s ? (
                      <View key={sid} style={styles.newTrophyRow}>
                        <MaterialCommunityIcons name={s.icon as any} size={22} color={s.color} />
                        <Text style={styles.newTrophyTitle}>{s.name}</Text>
                      </View>
                    ) : null;
                  })}
                </>
              )}
            </View>
          )}
          <View style={styles.completedBtns}>
            <TouchableOpacity style={styles.homeBtn} onPress={() => router.push('/home')}>
              <Text style={styles.homeBtnText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextLevelBtn} onPress={() => router.back()}>
              <Text style={styles.nextLevelBtnText}>More Levels</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => { Speech.stop(); router.back(); }} style={styles.closeBtn}>
          <MaterialCommunityIcons name="close" size={26} color="#8A7E74" />
        </TouchableOpacity>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
        <Text style={styles.counter}>{currentIndex + 1}/{words.length}</Text>
      </View>

      {/* Word Card */}
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.wordCard, cardStyle]}>
          {/* Illustration */}
          <View style={[styles.iconCircle, { backgroundColor: currentWord.color + '22' }]}>
            {currentWord.theme === 'colors' ? (
              <View style={[styles.colorCircle, { backgroundColor: currentWord.color }]} />
            ) : (
              <>
                <Image
                  source={THEME_IMAGES[currentWord.theme]}
                  style={styles.themeImage}
                  resizeMode="contain"
                />
                <View style={styles.iconBadge}>
                  <MaterialCommunityIcons name={currentWord.icon as any} size={22} color={currentWord.color} />
                </View>
              </>
            )}
          </View>

          {/* English */}
          <Text style={styles.englishWord}>{currentWord.english}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Arabic */}
          <Text style={styles.arabicWord}>{currentWord.arabic}</Text>
          <Text style={styles.translitText}>{currentWord.transliteration}</Text>

          {/* Speaker */}
          <TouchableOpacity style={styles.speakerBtn} onPress={handleSpeak}>
            <MaterialCommunityIcons name="volume-high" size={28} color="#FF6B35" />
            <Text style={styles.speakerLabel}>Tap to hear</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Next Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextLabel}>{currentIndex === words.length - 1 ? 'Finish!' : 'Next'}</Text>
          <MaterialCommunityIcons name="arrow-right" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 12 },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { flex: 1, height: 10, backgroundColor: '#F0E8DC', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: 10, backgroundColor: '#FF6B35', borderRadius: 5 },
  counter: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#8A7E74', minWidth: 36, textAlign: 'right' },
  cardContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  wordCard: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 32, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 8 },
  iconCircle: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  colorCircle: { width: 90, height: 90, borderRadius: 45 },
  themeImage: { width: 120, height: 120, borderRadius: 12 },
  iconBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: '#FFF', borderRadius: 16, padding: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 3 },
  englishWord: { fontFamily: 'Nunito_700Bold', fontSize: 28, color: '#1A1A2E', textAlign: 'center' },
  divider: { width: 60, height: 2, backgroundColor: '#F0E8DC', borderRadius: 1, marginVertical: 16 },
  arabicWord: { fontFamily: 'Nunito_800ExtraBold', fontSize: 42, color: '#FF6B35', textAlign: 'center', writingDirection: 'rtl' },
  translitText: { fontFamily: 'Nunito_400Regular', fontSize: 18, color: '#8A7E74', marginTop: 6, fontStyle: 'italic' },
  speakerBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#FFF0E8', borderRadius: 16 },
  speakerLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: '#FF6B35' },
  bottomBar: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16 },
  nextBtn: { backgroundColor: '#FF6B35', borderRadius: 24, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  nextLabel: { fontFamily: 'Nunito_800ExtraBold', fontSize: 20, color: '#FFFFFF' },
  completedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  completedTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 48, color: '#FF6B35', marginTop: 16, writingDirection: 'rtl' },
  completedSub: { fontFamily: 'Nunito_700Bold', fontSize: 22, color: '#1A1A2E', marginBottom: 20 },
  newTrophySection: { marginTop: 20, alignItems: 'center' },
  newTrophyLabel: { fontFamily: 'Nunito_700Bold', fontSize: 16, color: '#FFD700', marginBottom: 8 },
  newTrophyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 4 },
  newTrophyTitle: { fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: '#1A1A2E' },
  completedBtns: { flexDirection: 'row', gap: 16, marginTop: 32 },
  homeBtn: { flex: 1, backgroundColor: '#F5EEE6', borderRadius: 20, paddingVertical: 16, alignItems: 'center' },
  homeBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 18, color: '#8A7E74' },
  nextLevelBtn: { flex: 1, backgroundColor: '#FF6B35', borderRadius: 20, paddingVertical: 16, alignItems: 'center' },
  nextLevelBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 18, color: '#FFF' },
  errorText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: '#8A7E74', marginBottom: 16 },
  backBtn: { backgroundColor: '#FF6B35', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 24 },
});
