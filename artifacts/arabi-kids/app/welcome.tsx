import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { MascotCharacter } from '@/components/MascotCharacter';
import { AnimatedButton } from '@/components/AnimatedButton';
import { AVATAR_ICONS, AVATAR_COLORS } from '@/types';
import { useResponsive } from '@/hooks/useResponsive';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createProfile, setActiveProfileId } = useApp();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy'>('idle');
  const { isTablet, contentMaxWidth } = useResponsive();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleStart = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('What is your name?', 'Please enter your name to start!');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setMascotMood('happy');
    const profile = await createProfile(trimmed, selectedAvatar);
    await setActiveProfileId(profile.id);
    setTimeout(() => router.replace('/home'), 300);
  };

  return (
    <View style={[styles.container, { paddingTop: topPad, paddingBottom: bottomPad }, isTablet && { alignSelf: 'center', width: '100%', maxWidth: contentMaxWidth }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#FF6B35" />
        </TouchableOpacity>

        {/* Mascot */}
        <View style={styles.mascotSection}>
          <MascotCharacter size={110} mood={mascotMood} />
          <Text style={styles.greeting}>مرحباً!</Text>
          <Text style={styles.greetingEn}>Hello! I'm Nour.</Text>
          <Text style={styles.greetingEn}>What's your name?</Text>
        </View>

        {/* Name Input */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Your name..."
            placeholderTextColor="#BBAA99"
            value={name}
            onChangeText={(t) => { setName(t); if (t.length > 0) setMascotMood('happy'); else setMascotMood('idle'); }}
            maxLength={20}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleStart}
          />
        </View>

        {/* Avatar Picker */}
        <Text style={styles.avatarLabel}>Choose your avatar</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarRow}>
          {AVATAR_ICONS.map((icon, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.avatarOption, selectedAvatar === i && { borderColor: AVATAR_COLORS[i], borderWidth: 3.5 }]}
              onPress={() => { setSelectedAvatar(i); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            >
              <View style={[styles.avatarBg, { backgroundColor: AVATAR_COLORS[i] }]}>
                <MaterialCommunityIcons name={icon as any} size={36} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Start Button */}
        <View style={styles.btnRow}>
          <AnimatedButton
            label={name.trim() ? `Let's Go, ${name.trim()}!` : "Let's Start!"}
            onPress={handleStart}
            color="#FF6B35"
            size="large"
            style={{ width: '80%' }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  backBtn: { padding: 16, paddingBottom: 0, alignSelf: 'flex-start' },
  mascotSection: { alignItems: 'center', paddingVertical: 20 },
  greeting: { fontFamily: 'Nunito_800ExtraBold', fontSize: 40, color: '#FF6B35', marginTop: 12, writingDirection: 'rtl' },
  greetingEn: { fontFamily: 'Nunito_600SemiBold', fontSize: 18, color: '#8A7E74', marginTop: 4 },
  inputSection: { paddingHorizontal: 32, marginTop: 12 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    color: '#1A1A2E',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarLabel: { fontFamily: 'Nunito_700Bold', fontSize: 18, color: '#1A1A2E', textAlign: 'center', marginTop: 28, marginBottom: 12 },
  avatarRow: { paddingHorizontal: 24, gap: 12 },
  avatarOption: { borderRadius: 50, padding: 3, borderColor: 'transparent', borderWidth: 3 },
  avatarBg: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
  btnRow: { alignItems: 'center', marginTop: 36 },
});
