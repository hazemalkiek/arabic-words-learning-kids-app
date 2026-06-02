import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { TROPHIES } from '@/constants/trophies';

export default function TrophiesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activeProfile } = useApp();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const earnedIds = activeProfile?.trophies ?? [];
  const earnedCount = earnedIds.length;
  const totalCount = TROPHIES.length;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <MaterialCommunityIcons name="trophy" size={30} color="#FFD700" />
          <Text style={styles.title}>Trophies</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <Text style={styles.progressText}>{earnedCount} / {totalCount} unlocked</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(earnedCount / totalCount) * 100}%` }]} />
        </View>
      </View>

      <FlatList
        data={TROPHIES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: 14 }}
        renderItem={({ item: trophy }) => {
          const earned = earnedIds.includes(trophy.id);
          return (
            <View style={[styles.trophyCard, earned ? styles.trophyCardEarned : styles.trophyCardLocked]}>
              <View style={[styles.trophyIconCircle, { backgroundColor: earned ? trophy.color + '25' : '#F5F5F5' }]}>
                <MaterialCommunityIcons
                  name={trophy.icon as any}
                  size={40}
                  color={earned ? trophy.color : '#CCCCCC'}
                />
              </View>
              <Text style={[styles.trophyTitle, { color: earned ? '#1A1A2E' : '#BBBBBB' }]}>{trophy.title}</Text>
              <Text style={[styles.trophyDesc, { color: earned ? '#8A7E74' : '#CCCCCC' }]}>{trophy.description}</Text>
              {earned && (
                <View style={[styles.earnedBadge, { backgroundColor: trophy.color }]}>
                  <MaterialCommunityIcons name="check" size={12} color="#FFF" />
                </View>
              )}
              {!earned && (
                <MaterialCommunityIcons name="lock" size={18} color="#CCCCCC" style={{ marginTop: 6 }} />
              )}
            </View>
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
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontFamily: 'Nunito_800ExtraBold', fontSize: 26, color: '#1A1A2E' },
  progressSection: { paddingHorizontal: 20, marginBottom: 16 },
  progressText: { fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: '#8A7E74', marginBottom: 8, textAlign: 'center' },
  progressTrack: { height: 10, backgroundColor: '#F0E8DC', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: 10, backgroundColor: '#FFD700', borderRadius: 5 },
  grid: { paddingHorizontal: 16, paddingBottom: 40, gap: 14 },
  trophyCard: { flex: 1, borderRadius: 24, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  trophyCardEarned: { backgroundColor: '#FFFFFF' },
  trophyCardLocked: { backgroundColor: '#F8F8F8' },
  trophyIconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 10, position: 'relative' },
  trophyTitle: { fontFamily: 'Nunito_700Bold', fontSize: 13, textAlign: 'center' },
  trophyDesc: { fontFamily: 'Nunito_400Regular', fontSize: 11, textAlign: 'center', marginTop: 4, lineHeight: 15 },
  earnedBadge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
});
