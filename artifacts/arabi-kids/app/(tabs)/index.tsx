import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, Platform, StatusBar, Modal, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '@/context/AppContext';
import { MascotCharacter } from '@/components/MascotCharacter';
import { AVATAR_ICONS, AVATAR_COLORS, Profile } from '@/types';

function ProfileCard({ profile, onSelect, onLongPress }: {
  profile: Profile;
  onSelect: () => void;
  onLongPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const avatarColor = AVATAR_COLORS[profile.avatarId % AVATAR_COLORS.length];
  const avatarIcon = AVATAR_ICONS[profile.avatarId % AVATAR_ICONS.length];
  const wordsSeen = Object.values(profile.progress).filter(p => p.seen).length;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.95, {}, () => { scale.value = withSpring(1); });
    onSelect();
  };

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={styles.profileCard}
        onPress={handlePress}
        onLongPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); onLongPress(); }}
        delayLongPress={450}
        activeOpacity={1}
      >
        <View style={[styles.avatarCircle, { backgroundColor: avatarColor }]}>
          <MaterialCommunityIcons name={avatarIcon as any} size={44} color="#FFFFFF" />
        </View>
        <Text style={styles.profileName} numberOfLines={1}>{profile.name}</Text>
        <View style={styles.profileStats}>
          <MaterialCommunityIcons name="fire" size={13} color="#FF6B35" />
          <Text style={styles.statText}>{profile.streakCount}</Text>
          <MaterialCommunityIcons name="book-alphabet" size={13} color="#4ECDC4" style={{ marginLeft: 8 }} />
          <Text style={styles.statText}>{wordsSeen}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

interface EditModalProps {
  visible: boolean;
  profile: Profile | null;
  onSave: (name: string, avatarId: number) => void;
  onClose: () => void;
}
function EditProfileModal({ visible, profile, onSave, onClose }: EditModalProps) {
  const [name, setName] = useState(profile?.name ?? '');
  const [avatarId, setAvatarId] = useState(profile?.avatarId ?? 0);

  React.useEffect(() => {
    if (profile) { setName(profile.name); setAvatarId(profile.avatarId); }
  }, [profile]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) { Alert.alert('Please enter a name'); return; }
    onSave(trimmed, avatarId);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.sheet}>
          <Text style={modalStyles.title}>Edit Profile</Text>

          <TextInput
            style={modalStyles.input}
            value={name}
            onChangeText={setName}
            placeholder="Child's name"
            placeholderTextColor="#BBAA99"
            maxLength={20}
            autoCapitalize="words"
          />

          <Text style={modalStyles.avatarLabel}>Choose Avatar</Text>
          <View style={modalStyles.avatarGrid}>
            {AVATAR_ICONS.map((icon, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => { setAvatarId(i); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                style={[modalStyles.avatarOpt, avatarId === i && { borderColor: AVATAR_COLORS[i], borderWidth: 3 }]}
              >
                <View style={[modalStyles.avatarBg, { backgroundColor: AVATAR_COLORS[i] }]}>
                  <MaterialCommunityIcons name={icon as any} size={28} color="#FFF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={modalStyles.buttons}>
            <TouchableOpacity style={modalStyles.cancelBtn} onPress={onClose}>
              <Text style={modalStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.saveBtn} onPress={handleSave}>
              <Text style={modalStyles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function ProfileSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profiles, setActiveProfileId, deleteProfile, editProfile, isLoading } = useApp();
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  // On first launch (no onboarding seen) redirect to the animated splash
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.getItem('@arabi_onboarded').then(v => {
        if (v !== 'true') router.replace('/onboarding');
      });
    }
  }, [isLoading]);

  const handleSelectProfile = async (profileId: string) => {
    await setActiveProfileId(profileId);
    router.push('/home');
  };

  const handleLongPress = (profile: Profile) => {
    Alert.alert(profile.name, 'What would you like to do?', [
      { text: 'Edit Profile', onPress: () => setEditingProfile(profile) },
      { text: 'Delete Profile', style: 'destructive', onPress: () =>
        Alert.alert('Delete Profile', `Remove ${profile.name}'s profile? All progress will be lost.`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteProfile(profile.id) },
        ])
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleAddProfile = () => {
    if (profiles.length >= 4) {
      Alert.alert('Maximum Profiles', 'You can have up to 4 child profiles.');
      return;
    }
    router.push('/welcome');
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <MascotCharacter size={80} mood="idle" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <MascotCharacter size={80} mood="idle" />
          <Text style={styles.title}>عربي</Text>
          <Text style={styles.subtitle}>Who is learning today?</Text>
        </View>

        {/* Profiles Grid */}
        <View style={styles.grid}>
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onSelect={() => handleSelectProfile(profile.id)}
              onLongPress={() => handleLongPress(profile)}
            />
          ))}

          {profiles.length < 4 && (
            <TouchableOpacity style={styles.addCard} onPress={handleAddProfile}>
              <View style={styles.addCircle}>
                <MaterialCommunityIcons name="plus" size={36} color="#FF6B35" />
              </View>
              <Text style={styles.addText}>Add Child</Text>
            </TouchableOpacity>
          )}
        </View>

        {profiles.length === 0 && (
          <Text style={styles.emptyText}>Tap "Add Child" to get started!</Text>
        )}
        <Text style={styles.hintText}>Hold a profile to edit or remove it</Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={!!editingProfile}
        profile={editingProfile}
        onSave={(name, avatarId) => {
          if (editingProfile) editProfile(editingProfile.id, name, avatarId);
        }}
        onClose={() => setEditingProfile(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  scroll: { flexGrow: 1 },
  header: { alignItems: 'center', paddingVertical: 28, paddingTop: 16 },
  title: { fontFamily: 'Nunito_800ExtraBold', fontSize: 42, color: '#FF6B35', marginTop: 8, letterSpacing: 1 },
  subtitle: { fontFamily: 'Nunito_600SemiBold', fontSize: 20, color: '#8A7E74', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 16, gap: 16 },
  profileCard: { width: 150, backgroundColor: '#FFFFFF', borderRadius: 28, padding: 20, alignItems: 'center', shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 5 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profileName: { fontFamily: 'Nunito_700Bold', fontSize: 18, color: '#1A1A2E', textAlign: 'center', maxWidth: 110 },
  profileStats: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  statText: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: '#8A7E74', marginLeft: 3 },
  addCard: { width: 150, backgroundColor: '#FFF0E8', borderRadius: 28, padding: 20, alignItems: 'center', borderWidth: 2.5, borderStyle: 'dashed', borderColor: '#FF6B35' },
  addCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF8F0', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  addText: { fontFamily: 'Nunito_700Bold', fontSize: 16, color: '#FF6B35' },
  emptyText: { fontFamily: 'Nunito_600SemiBold', fontSize: 16, color: '#8A7E74', textAlign: 'center', marginTop: 24 },
  hintText: { fontFamily: 'Nunito_400Regular', fontSize: 12, color: '#BBAA99', textAlign: 'center', marginTop: 24 },
});

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28, paddingBottom: 40 },
  title: { fontFamily: 'Nunito_800ExtraBold', fontSize: 24, color: '#1A1A2E', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#FFF8F0', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14, fontSize: 20, fontFamily: 'Nunito_700Bold', color: '#1A1A2E', textAlign: 'center', marginBottom: 20 },
  avatarLabel: { fontFamily: 'Nunito_700Bold', fontSize: 16, color: '#8A7E74', marginBottom: 12 },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  avatarOpt: { borderRadius: 28, padding: 3, borderColor: 'transparent', borderWidth: 3 },
  avatarBg: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  buttons: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, backgroundColor: '#F5EEE6', borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
  cancelText: { fontFamily: 'Nunito_700Bold', fontSize: 17, color: '#8A7E74' },
  saveBtn: { flex: 1, backgroundColor: '#FF6B35', borderRadius: 18, paddingVertical: 16, alignItems: 'center' },
  saveText: { fontFamily: 'Nunito_700Bold', fontSize: 17, color: '#FFFFFF' },
});
