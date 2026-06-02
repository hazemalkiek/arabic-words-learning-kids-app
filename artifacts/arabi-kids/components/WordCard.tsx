import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Word } from '@/types';

interface WordCardProps {
  word: Word;
  onPress?: () => void;
  size?: 'small' | 'normal' | 'large';
  showArabic?: boolean;
  selected?: boolean;
  isCorrect?: boolean | null;
  isWrong?: boolean;
}

export function WordCard({ word, onPress, size = 'normal', showArabic = true, selected, isCorrect, isWrong }: WordCardProps) {
  const scale = useSharedValue(1);
  const shakeX = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: shakeX.value }],
  }));

  const handlePress = () => {
    if (!onPress) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(withTiming(0.92, { duration: 80 }), withSpring(1, { damping: 12 }));
    onPress();
  };

  React.useEffect(() => {
    if (isWrong) {
      shakeX.value = withSequence(
        withTiming(8, { duration: 60 }),
        withTiming(-8, { duration: 60 }),
        withTiming(6, { duration: 60 }),
        withTiming(-6, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
    }
  }, [isWrong]);

  const iconSize = size === 'large' ? 72 : size === 'small' ? 36 : 52;
  const borderColor = isCorrect === true ? '#6BCB77' : isWrong ? '#FF6B6B' : selected ? word.color : 'transparent';
  const bg = isCorrect === true ? '#F0FFF4' : isWrong ? '#FFF0F0' : '#FFFFFF';

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={onPress ? 0.85 : 1}
        style={[
          styles.card,
          size === 'large' && styles.cardLarge,
          size === 'small' && styles.cardSmall,
          { borderColor, borderWidth: selected || isCorrect !== null ? 3 : 0, backgroundColor: bg },
        ]}
      >
        {word.id.startsWith('co-') ? (
          <View style={[styles.colorCircle, { backgroundColor: word.color, width: iconSize, height: iconSize, borderRadius: iconSize / 2 }]} />
        ) : (
          <MaterialCommunityIcons name={word.icon as any} size={iconSize} color={word.color} />
        )}
        <Text style={[styles.english, size === 'small' && styles.englishSmall, size === 'large' && styles.englishLarge]}>{word.english}</Text>
        {showArabic && (
          <>
            <Text style={[styles.arabic, size === 'small' && styles.arabicSmall, size === 'large' && styles.arabicLarge]}>{word.arabic}</Text>
            <Text style={styles.transliteration}>{word.transliteration}</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 110,
  },
  cardLarge: {
    padding: 24,
    borderRadius: 28,
    minWidth: 150,
  },
  cardSmall: {
    padding: 10,
    borderRadius: 14,
    minWidth: 80,
  },
  colorCircle: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  english: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#1A1A2E',
    marginTop: 8,
    textAlign: 'center',
  },
  englishLarge: {
    fontSize: 20,
    marginTop: 12,
  },
  englishSmall: {
    fontSize: 12,
    marginTop: 4,
  },
  arabic: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 22,
    color: '#FF6B35',
    marginTop: 6,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  arabicLarge: {
    fontSize: 32,
  },
  arabicSmall: {
    fontSize: 16,
  },
  transliteration: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: '#8A7E74',
    marginTop: 2,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
