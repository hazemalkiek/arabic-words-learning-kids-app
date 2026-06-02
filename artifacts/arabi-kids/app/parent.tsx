import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, TextInput, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { AVATAR_ICONS, AVATAR_COLORS } from '@/types';
import { WORDS } from '@/constants/words';

const PIN_KEY = '@arabi_kids_pin';
const DEFAULT_PIN = '1234';

const PAD_KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

export default function ParentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profiles } = useApp();
  const [pin, setPin] = useState('');
  const [correctPin, setCorrectPin] = useState(DEFAULT_PIN);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  useEffect(() => {
    AsyncStorage.getItem(PIN_KEY).then(saved => { if (saved) setCorrectPin(saved); });
  }, []);

  const handlePad = (key: string) => {
    if (key === '⌫') { setPin(p => p.slice(0,-1)); setError(''); return; }
    if (!key) return;
    if (pin.length >= 4) return;
    const newPin = pin + key;
    setPin(newPin);
    if (newPin.length === 4) {
      setTimeout(() => {
        if (newPin === correctPin) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setUnlocked(true);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setError('Wrong PIN. Try again.');
          setPin('');
        }
      }, 200);
    }
  };

  const handleChangePin = () => {
    Alert.prompt('Change PIN', 'Enter new 4-digit PIN:', (newPin) => {
      if (!newPin || newPin.length !== 4 || isNaN(Number(newPin))) {
        Alert.alert('Invalid PIN', 'PIN must be exactly 4 digits.');
        return;
      }
      AsyncStorage.setItem(PIN_KEY, newPin);
      setCorrectPin(newPin);
      Alert.alert('PIN Changed', 'Your new PIN has been saved.');
    }, 'plain-text', '', 'number-pad');
  };

  if (!unlocked) {
    return (
      <View style={[styles.container, { paddingTop: topPad, paddingBottom: bottomPad }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#8A7E74" />
        </TouchableOpacity>
        <View style={styles.pinSection}>
          <MaterialCommunityIcons name="shield-account" size={60} color="#8A7E74" />
          <Text style={styles.pinTitle}>Parent Zone</Text>
          <Text style={styles.pinSubtitle}>Enter PIN to continue</Text>
          <Text style={styles.pinHint}>(Default: 1234)</Text>

          {/* Dots */}
          <View style={styles.dotsRow}>
            {[0,1,2,3].map(i => (
              <View key={i} style={[styles.dot, pin.length > i && styles.dotFilled]} />
            ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Keypad */}
          <View style={styles.keypad}>
            {PAD_KEYS.map((key, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.padKey, !key && { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }]}
                onPress={() => key && handlePad(key)}
                disabled={!key}
                activeOpacity={key ? 0.7 : 1}
              >
                {key === '⌫' ? (
                  <MaterialCommunityIcons name="backspace" size={26} color="#8A7E74" />
                ) : (
                  <Text style={styles.padKeyText}>{key}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }

  // Unlocked dashboard
  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#8A7E74" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parent Zone</Text>
        <TouchableOpacity onPress={handleChangePin} style={styles.changePinBtn}>
          <MaterialCommunityIcons name="key" size={22} color="#8A7E74" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.dashScroll, { paddingBottom: bottomPad + 20 }]} showsVerticalScrollIndicator={false}>
        {profiles.length === 0 && (
          <Text style={styles.noProfiles}>No child profiles yet.</Text>
        )}

        {profiles.map((profile) => {
          const avatarColor = AVATAR_COLORS[profile.avatarId % AVATAR_COLORS.length];
          const avatarIcon = AVATAR_ICONS[profile.avatarId % AVATAR_ICONS.length];
          const wordsSeen = Object.values(profile.progress).filter(p => p.seen).length;
          const levelsCompleted = Object.keys(profile.completedLevels).length;
          const trophies = profile.trophies.length;
          const tests = profile.testResults.length;
          const totalCorrect = profile.testResults.reduce((a, r) => a + r.score, 0);
          const totalAnswered = profile.testResults.reduce((a, r) => a + r.total, 0);
          const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

          return (
            <View key={profile.id} style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View style={[styles.avatarCircle, { backgroundColor: avatarColor }]}>
                  <MaterialCommunityIcons name={avatarIcon as any} size={30} color="#FFF" />
                </View>
                <View>
                  <Text style={styles.profileName}>{profile.name}</Text>
                  <Text style={styles.profileSince}>Since {new Date(profile.createdAt).toLocaleDateString()}</Text>
                </View>
                <View style={styles.streakBadge}>
                  <MaterialCommunityIcons name="fire" size={16} color="#FF6B35" />
                  <Text style={styles.streakNum}>{profile.streakCount}</Text>
                </View>
              </View>

              <View style={styles.statsGrid}>
                <StatItem icon="book-alphabet" color="#FF6B35" value={wordsSeen} label="Words Learned" />
                <StatItem icon="layers" color="#4ECDC4" value={levelsCompleted} label="Levels Done" />
                <StatItem icon="trophy" color="#FFD700" value={trophies} label="Trophies" />
                <StatItem icon="clipboard-check" color="#9B5DE5" value={tests} label="Tests Done" />
                <StatItem icon="percent" color="#6BCB77" value={`${accuracy}%`} label="Accuracy" />
                <StatItem icon="fire" color="#FF6B35" value={profile.streakCount} label="Day Streak" />
              </View>
            </View>
          );
        })}

        <Text style={styles.footer}>PIN: {correctPin.replace(/./g, '●')}  |  Tap key icon to change</Text>
      </ScrollView>
    </View>
  );
}

function StatItem({ icon, color, value, label }: { icon: string; color: string; value: string | number; label: string }) {
  return (
    <View style={styles.statItem}>
      <MaterialCommunityIcons name={icon as any} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', margin: 8 },
  pinSection: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  pinTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 30, color: '#1A1A2E', marginTop: 12 },
  pinSubtitle: { fontFamily: 'Nunito_600SemiBold', fontSize: 17, color: '#8A7E74', marginTop: 4 },
  pinHint: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: '#BBAA99', marginTop: 2 },
  dotsRow: { flexDirection: 'row', gap: 16, marginTop: 28, marginBottom: 12 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#8A7E74', backgroundColor: 'transparent' },
  dotFilled: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
  errorText: { fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: '#FF6B6B', marginBottom: 8 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', width: 240, gap: 12, marginTop: 20 },
  padKey: { width: 68, height: 68, backgroundColor: '#FFF', borderRadius: 34, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  padKeyText: { fontFamily: 'Nunito_700Bold', fontSize: 24, color: '#1A1A2E' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontFamily: 'Nunito_800ExtraBold', fontSize: 24, color: '#1A1A2E' },
  changePinBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  dashScroll: { paddingHorizontal: 16 },
  noProfiles: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: '#8A7E74', textAlign: 'center', marginTop: 40 },
  profileCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  avatarCircle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  profileName: { fontFamily: 'Nunito_700Bold', fontSize: 20, color: '#1A1A2E' },
  profileSince: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: '#8A7E74' },
  streakBadge: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF0E8', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  streakNum: { fontFamily: 'Nunito_800ExtraBold', fontSize: 16, color: '#FF6B35' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statItem: { width: '30%', backgroundColor: '#FFF8F0', borderRadius: 16, padding: 12, alignItems: 'center', gap: 4 },
  statValue: { fontFamily: 'Nunito_800ExtraBold', fontSize: 22, color: '#1A1A2E' },
  statLabel: { fontFamily: 'Nunito_400Regular', fontSize: 11, color: '#8A7E74', textAlign: 'center' },
  footer: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: '#BBAA99', textAlign: 'center', marginTop: 12, marginBottom: 8 },
});
