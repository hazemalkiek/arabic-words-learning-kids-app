import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, Platform, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { MascotCharacter } from '@/components/MascotCharacter';
import { AVATAR_ICONS, AVATAR_COLORS } from '@/types';

function ProfileCard({ profile, onSelect, onDelete }: {
  profile: { id: string; name: string; avatarId: number; streakCount: number };
  onSelect: () => void;
  onDelete: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const avatarColor = AVATAR_COLORS[profile.avatarId % AVATAR_COLORS.length];
  const avatarIcon = AVATAR_ICONS[profile.avatarId % AVATAR_ICONS.length];
  const wordsLearned = 0;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.95, {}, () => { scale.value = withSpring(1); });
    onSelect();
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert('Delete Profile', `Remove ${profile.name}'s profile?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={styles.profileCard}
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={1}
      >
        <View style={[styles.avatarCircle, { backgroundColor: avatarColor }]}>
          <MaterialCommunityIcons name={avatarIcon as any} size={44} color="#FFFFFF" />
        </View>
        <Text style={styles.profileName}>{profile.name}</Text>
        <View style={styles.streakRow}>
          <MaterialCommunityIcons name="fire" size={16} color="#FF6B35" />
          <Text style={styles.streakText}>{profile.streakCount}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ProfileSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { profiles, setActiveProfileId, deleteProfile, isLoading } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const handleSelectProfile = async (profileId: string) => {
    await setActiveProfileId(profileId);
    router.push('/home');
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
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <MascotCharacter size={80} mood="idle" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
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
              onDelete={() => deleteProfile(profile.id)}
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

        <Text style={styles.hintText}>Hold a profile to remove it</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingTop: 16,
  },
  title: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 42,
    color: '#FF6B35',
    marginTop: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 20,
    color: '#8A7E74',
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },
  profileCard: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#1A1A2E',
    textAlign: 'center',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  streakText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#FF6B35',
  },
  addCard: {
    width: 150,
    backgroundColor: '#FFF0E8',
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2.5,
    borderStyle: 'dashed',
    borderColor: '#FF6B35',
  },
  addCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  addText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#FF6B35',
  },
  emptyText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#8A7E74',
    textAlign: 'center',
    marginTop: 24,
  },
  hintText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: '#BBAA99',
    textAlign: 'center',
    marginTop: 24,
  },
});
