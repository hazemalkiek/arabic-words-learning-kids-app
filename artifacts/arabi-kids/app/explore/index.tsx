import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { THEMES } from '@/types';
import { WORDS } from '@/constants/words';

export default function ExploreIndexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#4ECDC4" />
        </TouchableOpacity>
        <Text style={styles.title}>Explore</Text>
        <View style={{ width: 44 }} />
      </View>

      <Text style={styles.subtitle}>Browse all Arabic words</Text>

      <FlatList
        data={THEMES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: 14 }}
        renderItem={({ item: theme }) => {
          const count = WORDS.filter(w => w.theme === theme.id).length;
          return (
            <TouchableOpacity
              style={[styles.themeCard, { backgroundColor: theme.color }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(`/explore/${theme.id}` as any);
              }}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name={theme.icon as any} size={48} color="rgba(255,255,255,0.9)" />
              <Text style={styles.themeName}>{theme.label}</Text>
              <Text style={styles.themeArabic}>{theme.arabicLabel}</Text>
              <Text style={styles.wordCount}>{count} words</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'Nunito_800ExtraBold', fontSize: 26, color: '#1A1A2E' },
  subtitle: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: '#8A7E74', textAlign: 'center', marginBottom: 20 },
  grid: { paddingHorizontal: 16, paddingBottom: 40, gap: 14 },
  themeCard: { flex: 1, borderRadius: 28, padding: 22, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 5 },
  themeName: { fontFamily: 'Nunito_800ExtraBold', fontSize: 18, color: '#FFFFFF', marginTop: 10 },
  themeArabic: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 2, writingDirection: 'rtl' },
  wordCount: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
});
