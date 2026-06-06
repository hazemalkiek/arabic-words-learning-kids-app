import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Platform, Modal, Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { playArabicById, stopAudio } from '@/utils/audioPlayer';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { THEMES, Theme } from '@/types';
import { WORDS } from '@/constants/words';
import type { Word } from '@/types';
import { THEME_IMAGES } from '@/constants/images';
import WORD_IMAGES from '@/constants/wordImages';
import { useResponsive } from '@/hooks/useResponsive';

export default function ExploreCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { markWordSeen } = useApp();
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const lastSpeakRef = useRef(0);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const { hPad, numCols } = useResponsive();
  const cols = numCols(3, 4, 5);

  const theme = THEMES.find(t => t.id === category);
  const words = WORDS.filter(w => w.theme === category);

  const handleWordPress = (word: Word) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedWord(word);
    markWordSeen(word.id);
    setTimeout(() => { playArabicById(word.id); }, 200);
  };

  const handleClose = () => {
    stopAudio();
    setSelectedWord(null);
  };

  const handleSpeak = (word: Word) => {
    const now = Date.now();
    if (now - lastSpeakRef.current < 600) return;
    lastSpeakRef.current = now;
    playArabicById(word.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (!theme) return null;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.color }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name={theme.icon as any} size={28} color="#FFFFFF" />
          <Text style={styles.title}>{theme.label}</Text>
          <Text style={styles.titleArabic}>{theme.arabicLabel}</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={words}
        keyExtractor={(item) => item.id}
        numColumns={cols}
        key={cols.toString()}
        contentContainerStyle={[styles.grid, { paddingHorizontal: hPad }]}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: 10 }}
        renderItem={({ item: word }) => (
          <TouchableOpacity style={styles.wordCard} onPress={() => handleWordPress(word)} activeOpacity={0.85}>
            {word.theme === 'colors' ? (
              <View style={[styles.colorCircle, { backgroundColor: word.color }]} />
            ) : word.theme === 'numbers' ? (
              <View style={[styles.numberCircle, { backgroundColor: word.color + '18' }]}>
                <Text style={[styles.numeralText, { color: word.color }]}>{word.icon}</Text>
              </View>
            ) : WORD_IMAGES[word.id] ? (
              <Image source={WORD_IMAGES[word.id]} style={styles.cardImg} resizeMode="cover" />
            ) : (
              <View style={styles.cardImgWrap}>
                <Image source={THEME_IMAGES[word.theme]} style={styles.cardImg} resizeMode="contain" />
                <View style={styles.cardIconBadge}>
                  <MaterialCommunityIcons name={word.icon as any} size={13} color={word.color} />
                </View>
              </View>
            )}
            <Text style={styles.wordEnglish}>{word.english}</Text>
            <Text style={[styles.wordArabic, { color: word.color }]}>{word.arabic}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Word Detail Modal */}
      <Modal visible={!!selectedWord} transparent animationType="fade" onRequestClose={handleClose}>
        <TouchableOpacity style={styles.modalOverlay} onPress={handleClose} activeOpacity={1}>
          <View style={styles.modalCard}>
            {WORD_IMAGES[selectedWord?.id ?? ''] ? (
              <Image source={WORD_IMAGES[selectedWord!.id]} style={styles.modalPhoto} resizeMode="cover" />
            ) : (
              <View style={[styles.modalIconCircle, { backgroundColor: (selectedWord?.color ?? '#FF6B35') + '22' }]}>
                {selectedWord?.theme === 'colors' ? (
                  <View style={[styles.colorCircleLg, { backgroundColor: selectedWord?.color }]} />
                ) : selectedWord?.theme === 'numbers' ? (
                  <Text style={[styles.numeralTextLg, { color: selectedWord.color }]}>{selectedWord.icon}</Text>
                ) : selectedWord ? (
                  <>
                    <Image source={THEME_IMAGES[selectedWord.theme]} style={styles.modalImg} resizeMode="contain" />
                    <View style={styles.modalIconBadge}>
                      <MaterialCommunityIcons name={(selectedWord.icon ?? 'star') as any} size={22} color={selectedWord.color} />
                    </View>
                  </>
                ) : null}
              </View>
            )}
            <Text style={styles.modalEnglish}>{selectedWord?.english}</Text>
            <Text style={[styles.modalArabic, { color: selectedWord?.color }]}>{selectedWord?.arabic}</Text>
            <Text style={styles.modalTranslit}>{selectedWord?.transliteration}</Text>
            <TouchableOpacity
              style={[styles.speakerBtn, { backgroundColor: (selectedWord?.color ?? '#FF6B35') + '22' }]}
              onPress={() => selectedWord && handleSpeak(selectedWord)}
            >
              <MaterialCommunityIcons name="volume-high" size={24} color={selectedWord?.color} />
              <Text style={[styles.speakerLabel, { color: selectedWord?.color }]}>Hear in Arabic</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClose} style={styles.closeModalBtn}>
              <MaterialCommunityIcons name="close" size={22} color="#8A7E74" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 14 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerContent: { alignItems: 'center', gap: 2 },
  title: { fontFamily: 'Nunito_800ExtraBold', fontSize: 22, color: '#FFFFFF' },
  titleArabic: { fontFamily: 'Cairo_700Bold', fontSize: 16, color: 'rgba(255,255,255,0.9)', writingDirection: 'rtl' },
  grid: { padding: 12, gap: 10, paddingBottom: 40 },
  wordCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2, minHeight: 110 },
  colorCircle: { width: 40, height: 40, borderRadius: 20 },
  numberCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  numeralText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 20, textAlign: 'center' },
  numeralTextLg: { fontFamily: 'Nunito_800ExtraBold', fontSize: 52, textAlign: 'center' },
  cardImgWrap: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  cardImg: { width: 44, height: 44, borderRadius: 10 },
  modalPhoto: { width: 150, height: 150, borderRadius: 24, marginBottom: 16 },
  cardIconBadge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#FFF', borderRadius: 8, padding: 2 },
  wordEnglish: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#1A1A2E', marginTop: 6, textAlign: 'center' },
  wordArabic: { fontFamily: 'Cairo_700Bold', fontSize: 16, marginTop: 2, textAlign: 'center', writingDirection: 'rtl' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 32, alignItems: 'center', width: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 12 },
  modalIconCircle: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  colorCircleLg: { width: 80, height: 80, borderRadius: 40 },
  modalImg: { width: 110, height: 110, borderRadius: 12 },
  modalIconBadge: { position: 'absolute', bottom: 6, right: 6, backgroundColor: '#FFF', borderRadius: 16, padding: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 3 },
  modalEnglish: { fontFamily: 'Nunito_700Bold', fontSize: 24, color: '#1A1A2E', textAlign: 'center' },
  modalArabic: { fontFamily: 'Cairo_700Bold', fontSize: 42, textAlign: 'center', writingDirection: 'rtl', marginTop: 8 },
  modalTranslit: { fontFamily: 'Nunito_400Regular', fontSize: 16, color: '#8A7E74', fontStyle: 'italic', marginTop: 4 },
  speakerBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 16 },
  speakerLabel: { fontFamily: 'Nunito_700Bold', fontSize: 16 },
  closeModalBtn: { position: 'absolute', top: 16, right: 16 },
});
