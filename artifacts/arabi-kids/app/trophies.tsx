import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { TROPHIES } from '@/constants/trophies';
import { STICKERS } from '@/constants/stickers';
import type { Sticker } from '@/types';
import type { Trophy } from '@/types';
import { useResponsive } from '@/hooks/useResponsive';

type Tab = 'trophies' | 'stickers';

function TrophyItem({ trophy, earned }: { trophy: Trophy; earned: boolean }) {
  return (
    <View style={[styles.card, earned ? styles.cardEarned : styles.cardLocked]}>
      <View style={[styles.iconCircle, { backgroundColor: earned ? trophy.color + '25' : '#F5F5F5' }]}>
        <MaterialCommunityIcons name={trophy.icon as any} size={40} color={earned ? trophy.color : '#CCCCCC'} />
      </View>
      <Text style={[styles.cardTitle, { color: earned ? '#1A1A2E' : '#BBBBBB' }]}>{trophy.title}</Text>
      <Text style={[styles.cardDesc, { color: earned ? '#8A7E74' : '#CCCCCC' }]}>{trophy.description}</Text>
      {earned ? (
        <View style={[styles.earnedBadge, { backgroundColor: trophy.color }]}>
          <MaterialCommunityIcons name="check" size={12} color="#FFF" />
        </View>
      ) : (
        <MaterialCommunityIcons name="lock" size={16} color="#CCCCCC" style={{ marginTop: 6 }} />
      )}
    </View>
  );
}

function StickerItem({ sticker, earned }: { sticker: Sticker; earned: boolean }) {
  return (
    <View style={[styles.stickerCard, {
      borderColor: earned ? sticker.color : '#F0E8DC',
      backgroundColor: earned ? sticker.color + '15' : '#F8F8F8',
    }]}>
      <View style={[styles.stickerIconCircle, { backgroundColor: earned ? sticker.color + '30' : '#EEEEEE' }]}>
        <MaterialCommunityIcons name={sticker.icon as any} size={32} color={earned ? sticker.color : '#CCCCCC'} />
      </View>
      <Text style={[styles.stickerName, { color: earned ? '#1A1A2E' : '#BBBBBB' }]} numberOfLines={1}>{sticker.name}</Text>
      <Text style={[styles.stickerDesc, { color: earned ? '#8A7E74' : '#CCCCCC' }]} numberOfLines={2}>{sticker.description}</Text>
      {!earned && <MaterialCommunityIcons name="lock" size={14} color="#CCCCCC" style={{ marginTop: 4 }} />}
    </View>
  );
}

export default function TrophiesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activeProfile } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('trophies');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const { hPad } = useResponsive();

  const earnedTrophies = activeProfile?.trophies ?? [];
  const earnedStickers = activeProfile?.stickers ?? [];
  const trophyCount = earnedTrophies.length;
  const stickerCount = earnedStickers.length;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <MaterialCommunityIcons name="trophy" size={28} color="#FFD700" />
          <Text style={styles.title}>Collection</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'trophies' && styles.tabActive]}
          onPress={() => setActiveTab('trophies')}
        >
          <MaterialCommunityIcons name="trophy" size={18} color={activeTab === 'trophies' ? '#FF6B35' : '#8A7E74'} />
          <Text style={[styles.tabLabel, activeTab === 'trophies' && styles.tabLabelActive]}>
            Trophies {trophyCount}/{TROPHIES.length}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stickers' && styles.tabActive]}
          onPress={() => setActiveTab('stickers')}
        >
          <MaterialCommunityIcons name="sticker-emoji" size={18} color={activeTab === 'stickers' ? '#FF4D9E' : '#8A7E74'} />
          <Text style={[styles.tabLabel, activeTab === 'stickers' && { color: '#FF4D9E' }]}>
            Stickers {stickerCount}/{STICKERS.length}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        {activeTab === 'trophies' ? (
          <>
            <Text style={styles.progressText}>{trophyCount} of {TROPHIES.length} trophies unlocked</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${(trophyCount / TROPHIES.length) * 100}%` as any, backgroundColor: '#FFD700' }]} />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.progressText}>{stickerCount} of {STICKERS.length} stickers collected</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${(stickerCount / STICKERS.length) * 100}%` as any, backgroundColor: '#FF4D9E' }]} />
            </View>
          </>
        )}
      </View>

      {/* Trophies grid */}
      {activeTab === 'trophies' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.trophyScroll, { paddingBottom: bottomPad + 20, paddingHorizontal: hPad }]}>
          <View style={styles.trophyGrid}>
            {TROPHIES.map(trophy => (
              <TrophyItem key={trophy.id} trophy={trophy} earned={earnedTrophies.includes(trophy.id)} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.stickerScroll, { paddingBottom: bottomPad + 20, paddingHorizontal: hPad }]}>
          <View style={styles.stickerGrid}>
            {STICKERS.map(sticker => (
              <StickerItem key={sticker.id} sticker={sticker} earned={earnedStickers.includes(sticker.id)} />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontFamily: 'Nunito_800ExtraBold', fontSize: 26, color: '#1A1A2E' },
  tabBar: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#F0E8DC', borderRadius: 20, padding: 4, marginBottom: 12 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 16 },
  tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabLabel: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#8A7E74' },
  tabLabelActive: { color: '#FF6B35' },
  progressSection: { paddingHorizontal: 20, marginBottom: 14 },
  progressText: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: '#8A7E74', marginBottom: 6, textAlign: 'center' },
  progressTrack: { height: 8, backgroundColor: '#F0E8DC', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  trophyScroll: { paddingHorizontal: 16 },
  trophyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  card: { width: '47.5%', borderRadius: 24, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardEarned: { backgroundColor: '#FFFFFF' },
  cardLocked: { backgroundColor: '#F8F8F8' },
  iconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  cardTitle: { fontFamily: 'Nunito_700Bold', fontSize: 13, textAlign: 'center' },
  cardDesc: { fontFamily: 'Nunito_400Regular', fontSize: 11, textAlign: 'center', marginTop: 4, lineHeight: 15 },
  earnedBadge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  stickerScroll: { paddingHorizontal: 12 },
  stickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stickerCard: { width: '30.5%', borderRadius: 20, borderWidth: 2, padding: 12, alignItems: 'center', minHeight: 120 },
  stickerIconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  stickerName: { fontFamily: 'Nunito_700Bold', fontSize: 12, textAlign: 'center' },
  stickerDesc: { fontFamily: 'Nunito_400Regular', fontSize: 10, textAlign: 'center', marginTop: 2, lineHeight: 14 },
});
