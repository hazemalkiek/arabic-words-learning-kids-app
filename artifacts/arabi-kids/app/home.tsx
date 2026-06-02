import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { MascotCharacter } from '@/components/MascotCharacter';
import { AVATAR_ICONS, AVATAR_COLORS } from '@/types';
import { WORDS } from '@/constants/words';

const MODE_CARDS = [
  { id: 'learn', label: 'Learn', arabicLabel: 'تعلَّم', icon: 'book-open-variant', color: '#FF6B35', bg: '#FFF0E8', desc: 'Discover new Arabic words' },
  { id: 'explore', label: 'Explore', arabicLabel: 'استكشف', icon: 'compass', color: '#4ECDC4', bg: '#E8FFFE', desc: 'Browse all word themes' },
  { id: 'test', label: 'Test', arabicLabel: 'اختبِر', icon: 'clipboard-check', color: '#9B5DE5', bg: '#F3ECFF', desc: 'Challenge yourself!' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activeProfile, setActiveProfileId, updateStreak } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  useEffect(() => {
    updateStreak();
  }, []);

  if (!activeProfile) {
    router.replace('/');
    return null;
  }

  const avatarColor = AVATAR_COLORS[activeProfile.avatarId % AVATAR_COLORS.length];
  const avatarIcon = AVATAR_ICONS[activeProfile.avatarId % AVATAR_ICONS.length];
  const wordsSeen = Object.values(activeProfile.progress).filter(p => p.seen).length;
  const levelsCompleted = Object.keys(activeProfile.completedLevels).length;
  const trophiesCount = activeProfile.trophies.length;

  const handleSwitchProfile = async () => {
    await setActiveProfileId(null);
    router.replace('/');
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 20 }]} showsVerticalScrollIndicator={false}>

        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.profileBadge} onPress={handleSwitchProfile}>
            <View style={[styles.avatarSmall, { backgroundColor: avatarColor }]}>
              <MaterialCommunityIcons name={avatarIcon as any} size={22} color="#FFF" />
            </View>
            <Text style={styles.profileNameSmall}>{activeProfile.name}</Text>
          </TouchableOpacity>

          <View style={styles.streakBadge}>
            <MaterialCommunityIcons name="fire" size={20} color="#FF6B35" />
            <Text style={styles.streakNum}>{activeProfile.streakCount}</Text>
          </View>
        </View>

        {/* Greeting + Mascot */}
        <View style={styles.heroSection}>
          <MascotCharacter size={130} mood="idle" streakCount={activeProfile.streakCount} />
          <Text style={styles.helloText}>
            أهلاً, {activeProfile.name}!
          </Text>
          <Text style={styles.helloSub}>Ready to learn Arabic today?</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{wordsSeen}</Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{levelsCompleted}</Text>
            <Text style={styles.statLabel}>Levels</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{trophiesCount}</Text>
            <Text style={styles.statLabel}>Trophies</Text>
          </View>
        </View>

        {/* Mode Cards */}
        <Text style={styles.sectionTitle}>Choose your game</Text>
        {MODE_CARDS.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[styles.modeCard, { backgroundColor: mode.bg }]}
            onPress={() => router.push(`/${mode.id}` as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.modeIconCircle, { backgroundColor: mode.color }]}>
              <MaterialCommunityIcons name={mode.icon as any} size={34} color="#FFFFFF" />
            </View>
            <View style={styles.modeInfo}>
              <Text style={[styles.modeLabel, { color: mode.color }]}>{mode.label}</Text>
              <Text style={styles.modeArabic}>{mode.arabicLabel}</Text>
              <Text style={styles.modeDesc}>{mode.desc}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={28} color={mode.color} />
          </TouchableOpacity>
        ))}

        {/* Trophy Button */}
        <TouchableOpacity style={styles.trophyBtn} onPress={() => router.push('/trophies')}>
          <MaterialCommunityIcons name="trophy" size={26} color="#FFD700" />
          <Text style={styles.trophyBtnText}>Trophy Room</Text>
          <View style={styles.trophyBadge}>
            <Text style={styles.trophyBadgeText}>{trophiesCount}</Text>
          </View>
        </TouchableOpacity>

        {/* Parent Zone */}
        <TouchableOpacity style={styles.parentBtn} onPress={() => router.push('/parent')}>
          <MaterialCommunityIcons name="shield-account" size={20} color="#8A7E74" />
          <Text style={styles.parentBtnText}>Parent Zone</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  scroll: { flexGrow: 1, paddingHorizontal: 20 },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  profileBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  avatarSmall: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  profileNameSmall: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: '#1A1A2E' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF0E8', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  streakNum: { fontFamily: 'Nunito_800ExtraBold', fontSize: 16, color: '#FF6B35' },
  heroSection: { alignItems: 'center', paddingVertical: 20 },
  helloText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 28, color: '#FF6B35', marginTop: 12, writingDirection: 'rtl' },
  helloSub: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: '#8A7E74', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 20, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  statNum: { fontFamily: 'Nunito_800ExtraBold', fontSize: 28, color: '#FF6B35' },
  statLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#8A7E74', marginTop: 2 },
  sectionTitle: { fontFamily: 'Nunito_700Bold', fontSize: 20, color: '#1A1A2E', marginBottom: 16 },
  modeCard: { borderRadius: 24, padding: 18, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  modeIconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  modeInfo: { flex: 1 },
  modeLabel: { fontFamily: 'Nunito_800ExtraBold', fontSize: 20 },
  modeArabic: { fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: '#8A7E74', writingDirection: 'rtl', marginTop: 1 },
  modeDesc: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: '#BBAA99', marginTop: 2 },
  trophyBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFBE6', borderRadius: 20, padding: 18, marginTop: 4, shadowColor: '#FFD700', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 2 },
  trophyBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 18, color: '#1A1A2E', flex: 1 },
  trophyBadge: { backgroundColor: '#FFD700', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  trophyBadgeText: { fontFamily: 'Nunito_800ExtraBold', fontSize: 14, color: '#1A1A2E' },
  parentBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20, paddingVertical: 12 },
  parentBtnText: { fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: '#8A7E74' },
});
