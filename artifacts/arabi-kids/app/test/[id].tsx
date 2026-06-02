import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform, Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, withSequence } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { ConfettiEffect } from '@/components/ConfettiEffect';
import { getWordsByLevel, getRandomWrongAnswers } from '@/constants/words';
import { TROPHIES } from '@/constants/trophies';
import { STICKERS } from '@/constants/stickers';
import { Difficulty, Theme, Word } from '@/types';
import { THEME_IMAGES } from '@/constants/images';
import { playCorrect, playWrong, playLevelComplete, playUnlock } from '@/utils/soundEffects';

function OptionButton({ word, onPress, state }: { word: Word; onPress: () => void; state: 'idle' | 'correct' | 'wrong' | 'reveal' }) {
  const scale = useSharedValue(1);
  const shakeX = useSharedValue(0);

  useEffect(() => {
    if (state === 'wrong') {
      shakeX.value = withSequence(
        withTiming(8, { duration: 60 }),
        withTiming(-8, { duration: 60 }),
        withTiming(6, { duration: 60 }),
        withTiming(-6, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
    }
    if (state === 'correct') {
      scale.value = withSequence(withSpring(1.08), withSpring(1));
    }
  }, [state]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: shakeX.value }],
  }));

  const bg = state === 'correct' ? '#6BCB77' : state === 'wrong' ? '#FF6B6B' : state === 'reveal' ? '#FFD700' : '#FFFFFF';
  const textColor = state !== 'idle' ? '#FFFFFF' : '#1A1A2E';

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={onPress}
        disabled={state !== 'idle'}
        style={[styles.optionBtn, { backgroundColor: bg, borderColor: state !== 'idle' ? bg : '#F0E8DC' }]}
        activeOpacity={0.85}
      >
        <Text style={[styles.optionArabic, { color: state !== 'idle' ? '#FFFFFF' : '#FF6B35' }]}>{word.arabic}</Text>
        <Text style={[styles.optionTranslit, { color: state !== 'idle' ? 'rgba(255,255,255,0.8)' : '#8A7E74' }]}>{word.transliteration}</Text>
        {state === 'correct' && <MaterialCommunityIcons name="check-circle" size={24} color="#FFFFFF" style={styles.optionIcon} />}
        {state === 'wrong' && <MaterialCommunityIcons name="close-circle" size={24} color="#FFFFFF" style={styles.optionIcon} />}
        {state === 'reveal' && <MaterialCommunityIcons name="star" size={24} color="#FFFFFF" style={styles.optionIcon} />}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function TestGameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { recordTestResult, completeLevel, addTimeSpent } = useApp();
  const sessionStartRef = React.useRef(Date.now());
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const parts = (id ?? '').split('-');
  const difficulty = parts[parts.length - 1] as Difficulty;
  const theme = parts.slice(0, -1).join('-') as Theme;
  const words = getWordsByLevel(theme, difficulty);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<Word[]>([]);
  const [answerState, setAnswerState] = useState<Record<string, 'idle' | 'correct' | 'wrong' | 'reveal'>>({});
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newTrophies, setNewTrophies] = useState<string[]>([]);
  const [newStickers, setNewStickers] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [wrongMsg, setWrongMsg] = useState<string | null>(null);

  const progressAnim = useSharedValue(0);
  const cardScale = useSharedValue(1);

  useEffect(() => {
    return () => { Speech.stop(); };
  }, []);

  useEffect(() => {
    if (words.length > 0) loadQuestion(0);
  }, []);

  function loadQuestion(index: number) {
    if (index >= words.length) return;
    const word = words[index];
    const wrong = getRandomWrongAnswers(word, 3);
    const allOptions = [word, ...wrong].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setAnswerState({});
    setAnswered(false);
    setWrongMsg(null);
    progressAnim.value = withTiming((index + 1) / words.length, { duration: 400 });
    cardScale.value = withSpring(1, { damping: 14 });
    setTimeout(() => {
      Speech.stop();
      Speech.speak(word.english, { language: 'en', rate: 0.9 });
    }, 300);
  }

  const WRONG_ENCOURAGEMENTS = [
    'So close! Keep going! 💪',
    'Almost there — you can do it! 🌟',
    'Nice try! Practice makes perfect! 🎯',
    'Don\'t worry, try the next one! 😊',
    'Great effort! You\'ll get it! 🔥',
  ];

  const handleAnswer = (word: Word) => {
    if (answered) return;
    const currentWord = words[currentIndex];
    const isCorrect = word.id === currentWord.id;
    setAnswered(true);
    if (isCorrect) playCorrect(); else playWrong();
    Haptics.impactAsync(isCorrect ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium);
    const newStates: Record<string, 'idle' | 'correct' | 'wrong' | 'reveal'> = {};
    options.forEach(o => {
      if (o.id === currentWord.id) newStates[o.id] = 'correct';
      else if (o.id === word.id && !isCorrect) newStates[o.id] = 'wrong';
      else newStates[o.id] = 'idle';
    });
    setAnswerState(newStates);
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1200);
    } else {
      const enc = WRONG_ENCOURAGEMENTS[Math.floor(Math.random() * WRONG_ENCOURAGEMENTS.length)];
      setWrongMsg(`${enc}\nThe right answer: ${currentWord.arabic} (${currentWord.transliteration})`);
    }
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= words.length) {
        finishTest(isCorrect ? correctCount + 1 : correctCount);
      } else {
        setCurrentIndex(nextIndex);
        loadQuestion(nextIndex);
      }
    }, 1400);
  };

  async function finishTest(finalCorrect: number) {
    const elapsedMinutes = (Date.now() - sessionStartRef.current) / 60000;
    await addTimeSpent(Math.round(elapsedMinutes));
    const pct = finalCorrect / words.length;
    const stars = pct >= 1 ? 3 : pct >= 0.6 ? 2 : pct > 0 ? 1 : 0;
    const rewards = await recordTestResult({ levelId: `test-${id}`, stars, score: finalCorrect, total: words.length, date: new Date().toISOString().split('T')[0] });
    await completeLevel(`test-${id}`, stars);
    setNewTrophies(rewards.trophies);
    setNewStickers(rewards.stickers);
    setIsCompleted(true);
    if (stars === 3) setShowConfetti(true);
    Haptics.notificationAsync(stars >= 2 ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);
    if (rewards.trophies.length > 0 || rewards.stickers.length > 0) {
      playUnlock();
    } else if (stars > 0) {
      playLevelComplete();
    }
  }

  const progressStyle = useAnimatedStyle(() => ({ width: `${progressAnim.value * 100}%` }));

  if (words.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: topPad, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={styles.errorText}>Complete the Learn level first!</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtnFull}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isCompleted) {
    const pct = correctCount / words.length;
    const stars = pct >= 1 ? 3 : pct >= 0.6 ? 2 : pct > 0 ? 1 : 0;
    const msgs = ['Keep practicing!', 'Good effort!', 'Great job!', 'PERFECT!'];
    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <ConfettiEffect active={showConfetti} />
        <View style={styles.resultsContainer}>
          <MaterialCommunityIcons name={stars === 3 ? 'crown' : 'clipboard-check'} size={72} color={stars === 3 ? '#FFD700' : '#9B5DE5'} />
          <Text style={styles.resultsTitle}>{msgs[stars]}</Text>
          <Text style={styles.scoreText}>{correctCount}/{words.length} correct</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3].map((s) => (
              <MaterialCommunityIcons key={s} name={s <= stars ? 'star' : 'star-outline'} size={44} color={s <= stars ? '#FFD700' : '#DDD'} />
            ))}
          </View>
          {(newTrophies.length > 0 || newStickers.length > 0) && (
            <View style={styles.newTrophySection}>
              {newTrophies.length > 0 && (
                <>
                  <Text style={styles.newTrophyLabel}>🏆 New Trophies!</Text>
                  {newTrophies.map((tid) => {
                    const t = TROPHIES.find(tr => tr.id === tid);
                    return t ? (
                      <View key={tid} style={styles.newTrophyRow}>
                        <MaterialCommunityIcons name={t.icon as any} size={20} color={t.color} />
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
                        <MaterialCommunityIcons name={s.icon as any} size={20} color={s.color} />
                        <Text style={styles.newTrophyTitle}>{s.name}</Text>
                      </View>
                    ) : null;
                  })}
                </>
              )}
            </View>
          )}
          <View style={styles.resultsBtns}>
            <TouchableOpacity style={styles.retryBtn} onPress={() => { setCurrentIndex(0); setCorrectCount(0); setIsCompleted(false); setShowConfetti(false); loadQuestion(0); }}>
              <Text style={styles.retryBtnText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeBtn} onPress={() => router.push('/home')}>
              <Text style={styles.homeBtnText}>Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ConfettiEffect active={showConfetti} />
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

      {/* Score */}
      <View style={styles.scoreRow}>
        <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
        <Text style={styles.scoreLabel}>{correctCount} correct</Text>
      </View>

      {/* Word Display */}
      <View style={styles.wordDisplay}>
        <View style={[styles.wordIconCircle, { backgroundColor: currentWord.color + '20' }]}>
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
                <MaterialCommunityIcons name={currentWord.icon as any} size={20} color={currentWord.color} />
              </View>
            </>
          )}
        </View>
        <Text style={styles.wordEnglish}>{currentWord.english}</Text>
        <View style={styles.hearRow}>
          <TouchableOpacity
            style={styles.hearBtn}
            onPress={() => { Speech.stop(); Speech.speak(currentWord.english, { language: 'en', rate: 0.9 }); }}
          >
            <MaterialCommunityIcons name="volume-high" size={20} color="#9B5DE5" />
            <Text style={styles.hearLabel}>Hear it</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.questionLabel}>Which Arabic word matches?</Text>
      </View>

      {/* Options Grid */}
      <View style={styles.optionsGrid}>
        {options.map((opt) => (
          <OptionButton
            key={opt.id}
            word={opt}
            onPress={() => handleAnswer(opt)}
            state={answerState[opt.id] ?? 'idle'}
          />
        ))}
      </View>

      {/* Wrong-answer encouragement + hint */}
      {wrongMsg && (
        <View style={styles.wrongMsgBox}>
          {wrongMsg.split('\n').map((line, i) => (
            <Text key={i} style={i === 0 ? styles.wrongEnc : styles.wrongHint}>{line}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 12 },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { flex: 1, height: 10, backgroundColor: '#F0E8DC', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: 10, backgroundColor: '#9B5DE5', borderRadius: 5 },
  counter: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#8A7E74', minWidth: 36, textAlign: 'right' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 },
  scoreLabel: { fontFamily: 'Nunito_700Bold', fontSize: 16, color: '#9B5DE5' },
  wordDisplay: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  wordIconCircle: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  colorCircle: { width: 80, height: 80, borderRadius: 40 },
  themeImage: { width: 110, height: 110, borderRadius: 12 },
  iconBadge: { position: 'absolute', bottom: 6, right: 6, backgroundColor: '#FFF', borderRadius: 14, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 3 },
  wordEnglish: { fontFamily: 'Nunito_800ExtraBold', fontSize: 30, color: '#1A1A2E', textAlign: 'center' },
  hearRow: { flexDirection: 'row', marginTop: 8, marginBottom: 8 },
  hearBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F3ECFF', borderRadius: 14, paddingVertical: 8, paddingHorizontal: 16 },
  hearLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: '#9B5DE5' },
  questionLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: '#8A7E74' },
  optionsGrid: { paddingHorizontal: 16, gap: 10, flex: 1 },
  optionBtn: { borderRadius: 20, padding: 16, borderWidth: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  optionArabic: { fontFamily: 'Nunito_800ExtraBold', fontSize: 26, writingDirection: 'rtl', textAlign: 'center', flex: 1 },
  optionTranslit: { fontFamily: 'Nunito_400Regular', fontSize: 14, fontStyle: 'italic', minWidth: 70, textAlign: 'center' },
  optionIcon: { marginLeft: 8 },
  resultsContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  resultsTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 32, color: '#1A1A2E', marginTop: 16 },
  scoreText: { fontFamily: 'Nunito_700Bold', fontSize: 20, color: '#9B5DE5', marginTop: 8 },
  starsRow: { flexDirection: 'row', gap: 8, marginTop: 16, marginBottom: 8 },
  newTrophySection: { alignItems: 'center', marginTop: 12 },
  newTrophyLabel: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#FFD700', marginBottom: 6 },
  newTrophyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 3 },
  newTrophyTitle: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: '#1A1A2E' },
  resultsBtns: { flexDirection: 'row', gap: 14, marginTop: 28 },
  retryBtn: { flex: 1, backgroundColor: '#F3ECFF', borderRadius: 20, paddingVertical: 16, alignItems: 'center' },
  retryBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 17, color: '#9B5DE5' },
  homeBtn: { flex: 1, backgroundColor: '#9B5DE5', borderRadius: 20, paddingVertical: 16, alignItems: 'center' },
  homeBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 17, color: '#FFF' },
  wrongMsgBox: { marginHorizontal: 16, marginTop: 8, backgroundColor: '#FFF0E8', borderRadius: 16, padding: 14, borderLeftWidth: 4, borderLeftColor: '#FF6B6B' },
  wrongEnc: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#FF6B35', marginBottom: 4 },
  wrongHint: { fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: '#1A1A2E', writingDirection: 'rtl' },
  errorText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: '#8A7E74', marginBottom: 16 },
  backBtnFull: { backgroundColor: '#9B5DE5', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 24 },
  backBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 16, color: '#FFF' },
});
