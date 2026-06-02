import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, Modal, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { AVATAR_ICONS, AVATAR_COLORS, THEMES, DIFFICULTIES } from '@/types';

const PIN_KEY = '@arabi_kids_pin';
const DEFAULT_PIN = '1234';
const PAD_KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

function PinDots({ length }: { length: number }) {
  return (
    <View style={pinStyles.dotsRow}>
      {[0,1,2,3].map(i => (
        <View key={i} style={[pinStyles.dot, length > i && pinStyles.dotFilled]} />
      ))}
    </View>
  );
}

function NumPad({ onKey }: { onKey: (k: string) => void }) {
  return (
    <View style={pinStyles.keypad}>
      {PAD_KEYS.map((key, i) => (
        <TouchableOpacity
          key={i}
          style={[pinStyles.padKey, !key && { backgroundColor: 'transparent', shadowOpacity: 0, elevation: 0 }]}
          onPress={() => key && onKey(key)}
          disabled={!key}
          activeOpacity={key ? 0.7 : 1}
        >
          {key === '⌫' ? (
            <MaterialCommunityIcons name="backspace" size={26} color="#8A7E74" />
          ) : key ? (
            <Text style={pinStyles.padKeyText}>{key}</Text>
          ) : null}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ChangePinModal({ visible, onClose, onSave }: { visible: boolean; onClose: () => void; onSave: (pin: string) => void }) {
  const [newPin, setNewPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [step, setStep] = useState<'new' | 'confirm'>('new');
  const [error, setError] = useState('');

  const reset = () => { setNewPin(''); setConfirm(''); setStep('new'); setError(''); };
  const handleClose = () => { reset(); onClose(); };

  const handleKey = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 'new') {
      if (key === '⌫') { setNewPin(p => p.slice(0,-1)); return; }
      if (newPin.length >= 4) return;
      const next = newPin + key;
      setNewPin(next);
      if (next.length === 4) setTimeout(() => setStep('confirm'), 300);
    } else {
      if (key === '⌫') { setConfirm(p => p.slice(0,-1)); setError(''); return; }
      if (confirm.length >= 4) return;
      const next = confirm + key;
      setConfirm(next);
      if (next.length === 4) {
        setTimeout(() => {
          if (next === newPin) { onSave(newPin); handleClose(); }
          else { setError("PINs don't match. Try again."); setConfirm(''); }
        }, 200);
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Change PIN</Text>
          <Text style={styles.modalSub}>{step === 'new' ? 'Enter new 4-digit PIN' : 'Confirm your new PIN'}</Text>
          <PinDots length={step === 'new' ? newPin.length : confirm.length} />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <NumPad onKey={handleKey} />
          <TouchableOpacity onPress={handleClose} style={styles.cancelLink}>
            <Text style={styles.cancelLinkText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function StatItem({ icon, color, value, label }: { icon: string; color: string; value: string | number; label: string }) {
  return (
    <View style={styles.statItem}>
      <MaterialCommunityIcons name={icon as any} size={22} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ThemeProgress({ profile }: { profile: NonNullable<ReturnType<typeof useApp>['activeProfile']> }) {
  return (
    <View style={styles.themeSection}>
      <Text style={styles.themeSectionTitle}>Progress by Theme</Text>
      {THEMES.map(theme => {
        const completed = DIFFICULTIES.filter(d => (profile.completedLevels[`${theme.id}-${d.id}`] ?? 0) > 0).length;
        const stars = DIFFICULTIES.reduce((sum, d) => sum + (profile.completedLevels[`${theme.id}-${d.id}`] ?? 0), 0);
        return (
          <View key={theme.id} style={styles.themeRow}>
            <View style={[styles.themeIconSm, { backgroundColor: theme.color }]}>
              <MaterialCommunityIcons name={theme.icon as any} size={14} color="#FFF" />
            </View>
            <Text style={styles.themeLabel}>{theme.label}</Text>
            <View style={styles.themeStarsRow}>
              {[1,2,3,4,5,6,7,8,9].map(s => (
                <MaterialCommunityIcons key={s} name={s <= stars ? 'star' : 'star-outline'} size={12} color={s <= stars ? '#FFD700' : '#E0E0E0'} />
              ))}
            </View>
            <Text style={styles.themeCompleted}>{completed}/3</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function ParentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profiles } = useApp();
  const [pin, setPin] = useState('');
  const [correctPin, setCorrectPin] = useState(DEFAULT_PIN);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [showChangePin, setShowChangePin] = useState(false);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  useEffect(() => {
    AsyncStorage.getItem(PIN_KEY).then(saved => { if (saved) setCorrectPin(saved); });
  }, []);

  const handlePad = (key: string) => {
    if (key === '⌫') { setPin(p => p.slice(0,-1)); setError(''); return; }
    if (pin.length >= 4) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newPin = pin + key;
    setPin(newPin);
    if (newPin.length === 4) {
      setTimeout(() => {
        if (newPin === correctPin) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setUnlocked(true);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setError('Incorrect PIN. Try again.');
          setPin('');
        }
      }, 200);
    }
  };

  const handleSavePin = (newPin: string) => {
    AsyncStorage.setItem(PIN_KEY, newPin);
    setCorrectPin(newPin);
  };

  if (!unlocked) {
    return (
      <View style={[styles.container, { paddingTop: topPad, paddingBottom: bottomPad }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#8A7E74" />
        </TouchableOpacity>
        <View style={styles.pinSection}>
          <MaterialCommunityIcons name="shield-account" size={64} color="#8A7E74" />
          <Text style={styles.pinTitle}>Parent Zone</Text>
          <Text style={styles.pinSub}>Enter PIN to continue</Text>
          <Text style={styles.pinHint}>Default PIN: 1234</Text>
          <PinDots length={pin.length} />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <NumPad onKey={handlePad} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#8A7E74" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parent Zone</Text>
        <TouchableOpacity onPress={() => setShowChangePin(true)} style={styles.iconBtn}>
          <MaterialCommunityIcons name="key-variant" size={24} color="#8A7E74" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.dashScroll, { paddingBottom: bottomPad + 20 }]} showsVerticalScrollIndicator={false}>
        {profiles.length === 0 && <Text style={styles.noProfiles}>No child profiles yet.</Text>}

        {profiles.map((profile) => {
          const avatarColor = AVATAR_COLORS[profile.avatarId % AVATAR_COLORS.length];
          const avatarIcon = AVATAR_ICONS[profile.avatarId % AVATAR_ICONS.length];
          const wordsSeen = Object.values(profile.progress).filter(p => p.seen).length;
          const levelsCompleted = Object.keys(profile.completedLevels).filter(k => !k.startsWith('test')).length;
          const trophies = profile.trophies.length;
          const stickers = (profile.stickers ?? []).length;
          const tests = profile.testResults.length;
          const totalCorrect = profile.testResults.reduce((a, r) => a + r.score, 0);
          const totalAnswered = profile.testResults.reduce((a, r) => a + r.total, 0);
          const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

          return (
            <View key={profile.id} style={styles.profileCard}>
              {/* Profile header */}
              <View style={styles.profileHeader}>
                <View style={[styles.avatarCircle, { backgroundColor: avatarColor }]}>
                  <MaterialCommunityIcons name={avatarIcon as any} size={30} color="#FFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.profileName}>{profile.name}</Text>
                  <Text style={styles.profileSince}>Member since {new Date(profile.createdAt).toLocaleDateString()}</Text>
                </View>
                <View style={styles.streakBadge}>
                  <MaterialCommunityIcons name="fire" size={16} color="#FF6B35" />
                  <Text style={styles.streakNum}>{profile.streakCount}</Text>
                </View>
              </View>

              {/* Stats grid */}
              <View style={styles.statsGrid}>
                <StatItem icon="book-alphabet" color="#FF6B35" value={wordsSeen} label="Words" />
                <StatItem icon="layers" color="#4ECDC4" value={levelsCompleted} label="Levels" />
                <StatItem icon="trophy" color="#FFD700" value={trophies} label="Trophies" />
                <StatItem icon="sticker-emoji" color="#FF4D9E" value={stickers} label="Stickers" />
                <StatItem icon="percent" color="#6BCB77" value={`${accuracy}%`} label="Accuracy" />
                <StatItem icon="calendar-check" color="#9B5DE5" value={`${profile.bestStreak ?? profile.streakCount}d`} label="Best Streak" />
              </View>

              {/* Per-theme breakdown */}
              <ThemeProgress profile={profile} />
            </View>
          );
        })}
      </ScrollView>

      <ChangePinModal
        visible={showChangePin}
        onClose={() => setShowChangePin(false)}
        onSave={handleSavePin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', margin: 8 },
  pinSection: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  pinTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 30, color: '#1A1A2E', marginTop: 12 },
  pinSub: { fontFamily: 'Nunito_600SemiBold', fontSize: 17, color: '#8A7E74', marginTop: 4 },
  pinHint: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: '#BBAA99', marginTop: 2, marginBottom: 8 },
  errorText: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: '#FF6B6B', marginBottom: 8, marginTop: 4 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 24, color: '#1A1A2E' },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  dashScroll: { paddingHorizontal: 16 },
  noProfiles: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: '#8A7E74', textAlign: 'center', marginTop: 40 },
  profileCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  avatarCircle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  profileName: { fontFamily: 'Nunito_700Bold', fontSize: 20, color: '#1A1A2E' },
  profileSince: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: '#8A7E74' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF0E8', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  streakNum: { fontFamily: 'Nunito_800ExtraBold', fontSize: 16, color: '#FF6B35' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  statItem: { width: '30%', backgroundColor: '#FFF8F0', borderRadius: 16, padding: 12, alignItems: 'center', gap: 3, flexGrow: 1 },
  statValue: { fontFamily: 'Nunito_800ExtraBold', fontSize: 20, color: '#1A1A2E' },
  statLabel: { fontFamily: 'Nunito_400Regular', fontSize: 11, color: '#8A7E74', textAlign: 'center' },
  themeSection: { borderTopWidth: 1, borderTopColor: '#F0E8DC', paddingTop: 14 },
  themeSectionTitle: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#8A7E74', marginBottom: 10 },
  themeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  themeIconSm: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  themeLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#1A1A2E', width: 60 },
  themeStarsRow: { flexDirection: 'row', flex: 1, gap: 2 },
  themeCompleted: { fontFamily: 'Nunito_600SemiBold', fontSize: 12, color: '#8A7E74', width: 24, textAlign: 'right' },
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28, paddingBottom: 40, alignItems: 'center' },
  modalTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 24, color: '#1A1A2E', marginBottom: 4 },
  modalSub: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: '#8A7E74', marginBottom: 16 },
  cancelLink: { marginTop: 20, paddingVertical: 10, paddingHorizontal: 24 },
  cancelLinkText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: '#8A7E74' },
});

const pinStyles = StyleSheet.create({
  dotsRow: { flexDirection: 'row', gap: 16, marginTop: 16, marginBottom: 8 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#8A7E74', backgroundColor: 'transparent' },
  dotFilled: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', width: 240, gap: 12, marginTop: 20 },
  padKey: { width: 68, height: 68, backgroundColor: '#FFF', borderRadius: 34, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  padKeyText: { fontFamily: 'Nunito_700Bold', fontSize: 24, color: '#1A1A2E' },
});
