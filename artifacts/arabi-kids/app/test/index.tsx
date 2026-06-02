import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { THEMES, DIFFICULTIES } from '@/types';

export default function TestIndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activeProfile } = useApp();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#9B5DE5" />
        </TouchableOpacity>
        <Text style={styles.title}>Test</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>How well do you know Arabic?</Text>

        {THEMES.map((theme) => (
          <View key={theme.id} style={styles.themeSection}>
            <View style={styles.themeHeader}>
              <View style={[styles.themeIconCircle, { backgroundColor: theme.color }]}>
                <MaterialCommunityIcons name={theme.icon as any} size={22} color="#FFF" />
              </View>
              <View>
                <Text style={styles.themeName}>{theme.label}</Text>
                <Text style={[styles.themeArabic, { color: theme.color }]}>{theme.arabicLabel}</Text>
              </View>
            </View>

            <View style={styles.levelsRow}>
              {DIFFICULTIES.map((diff) => {
                const levelId = `${theme.id}-${diff.id}`;
                const learnCompleted = (activeProfile?.completedLevels[levelId] ?? 0) > 0;
                const testResult = activeProfile?.testResults.find(r => r.levelId === `test-${levelId}`);
                const stars = testResult?.stars ?? 0;

                return (
                  <TouchableOpacity
                    key={diff.id}
                    style={[styles.levelCard, { borderColor: theme.color, backgroundColor: stars > 0 ? theme.color : '#FFF', opacity: !learnCompleted ? 0.5 : 1 }]}
                    onPress={() => learnCompleted && router.push(`/test/${levelId}` as any)}
                    disabled={!learnCompleted}
                  >
                    {!learnCompleted ? (
                      <MaterialCommunityIcons name="lock" size={22} color={theme.color} />
                    ) : (
                      <MaterialCommunityIcons name={stars > 0 ? 'check-circle' : 'play-circle'} size={22} color={stars > 0 ? '#FFF' : theme.color} />
                    )}
                    <Text style={[styles.levelName, { color: stars > 0 ? '#FFF' : theme.color }]}>{diff.label}</Text>
                    <View style={styles.starsRow}>
                      {[1, 2, 3].map((s) => (
                        <MaterialCommunityIcons key={s} name={s <= stars ? 'star' : 'star-outline'} size={13} color={stars > 0 ? '#FFD700' : '#DDD'} />
                      ))}
                    </View>
                    <Text style={[styles.wordCount, { color: stars > 0 ? 'rgba(255,255,255,0.75)' : '#BBAA99' }]}>
                      {!learnCompleted ? 'Learn first' : '4 choices'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'Nunito_800ExtraBold', fontSize: 26, color: '#1A1A2E' },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },
  subtitle: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: '#8A7E74', marginBottom: 20, textAlign: 'center' },
  themeSection: { marginBottom: 16, backgroundColor: '#FFF', borderRadius: 24, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  themeHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  themeIconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  themeName: { fontFamily: 'Nunito_700Bold', fontSize: 18, color: '#1A1A2E' },
  themeArabic: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, writingDirection: 'rtl' },
  levelsRow: { flexDirection: 'row', gap: 10 },
  levelCard: { flex: 1, borderRadius: 16, borderWidth: 2, padding: 12, alignItems: 'center', gap: 4 },
  levelName: { fontFamily: 'Nunito_700Bold', fontSize: 12, textAlign: 'center' },
  starsRow: { flexDirection: 'row', gap: 1 },
  wordCount: { fontFamily: 'Nunito_400Regular', fontSize: 10, textAlign: 'center' },
});
