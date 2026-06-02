import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, WordProgress, TestResult } from '@/types';
import { checkNewTrophies } from '@/constants/trophies';

const STORAGE_KEY = '@arabi_kids_profiles';
const ACTIVE_KEY = '@arabi_kids_active';

interface AppContextType {
  profiles: Profile[];
  activeProfileId: string | null;
  activeProfile: Profile | null;
  isLoading: boolean;
  setActiveProfileId: (id: string | null) => void;
  createProfile: (name: string, avatarId: number) => Promise<Profile>;
  deleteProfile: (id: string) => Promise<void>;
  markWordSeen: (wordId: string) => Promise<string[]>; // returns new trophy IDs
  recordTestResult: (result: TestResult) => Promise<string[]>;
  completeLevel: (levelId: string, stars: number) => Promise<string[]>;
  updateStreak: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

function createEmptyProfile(name: string, avatarId: number): Profile {
  return {
    id: generateId(),
    name,
    avatarId,
    createdAt: Date.now(),
    progress: {},
    completedLevels: {},
    trophies: [],
    streakCount: 1,
    lastActiveDate: todayString(),
    testResults: [],
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [profilesData, activeId] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(ACTIVE_KEY),
      ]);
      if (profilesData) setProfiles(JSON.parse(profilesData));
      if (activeId) setActiveProfileIdState(activeId);
    } catch (e) {
      console.error('Failed to load data:', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveProfiles(updated: Profile[]) {
    setProfiles(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  const setActiveProfileId = useCallback(async (id: string | null) => {
    setActiveProfileIdState(id);
    if (id) {
      await AsyncStorage.setItem(ACTIVE_KEY, id);
    } else {
      await AsyncStorage.removeItem(ACTIVE_KEY);
    }
  }, []);

  const createProfile = useCallback(async (name: string, avatarId: number): Promise<Profile> => {
    const profile = createEmptyProfile(name, avatarId);
    const updated = [...profiles, profile];
    await saveProfiles(updated);
    return profile;
  }, [profiles]);

  const deleteProfile = useCallback(async (id: string) => {
    const updated = profiles.filter(p => p.id !== id);
    await saveProfiles(updated);
    if (activeProfileId === id) {
      await setActiveProfileId(null);
    }
  }, [profiles, activeProfileId]);

  const updateProfile = useCallback(async (profileId: string, updater: (p: Profile) => Profile): Promise<string[]> => {
    let newTrophies: string[] = [];
    const updated = profiles.map(p => {
      if (p.id !== profileId) return p;
      const updatedProfile = updater(p);
      newTrophies = checkNewTrophies(updatedProfile);
      return {
        ...updatedProfile,
        trophies: [...updatedProfile.trophies, ...newTrophies],
      };
    });
    await saveProfiles(updated);
    return newTrophies;
  }, [profiles]);

  const markWordSeen = useCallback(async (wordId: string): Promise<string[]> => {
    if (!activeProfileId) return [];
    return updateProfile(activeProfileId, (p) => ({
      ...p,
      progress: {
        ...p.progress,
        [wordId]: { seen: true, testCorrect: p.progress[wordId]?.testCorrect ?? 0, testTotal: p.progress[wordId]?.testTotal ?? 0 },
      },
    }));
  }, [activeProfileId, updateProfile]);

  const recordTestResult = useCallback(async (result: TestResult): Promise<string[]> => {
    if (!activeProfileId) return [];
    return updateProfile(activeProfileId, (p) => ({
      ...p,
      testResults: [...p.testResults, result],
    }));
  }, [activeProfileId, updateProfile]);

  const completeLevel = useCallback(async (levelId: string, stars: number): Promise<string[]> => {
    if (!activeProfileId) return [];
    return updateProfile(activeProfileId, (p) => {
      const existing = p.completedLevels[levelId] ?? 0;
      return {
        ...p,
        completedLevels: {
          ...p.completedLevels,
          [levelId]: Math.max(existing, stars),
        },
      };
    });
  }, [activeProfileId, updateProfile]);

  const updateStreak = useCallback(async () => {
    if (!activeProfileId) return;
    await updateProfile(activeProfileId, (p) => {
      const today = todayString();
      if (p.lastActiveDate === today) return p;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const newStreak = p.lastActiveDate === yesterdayStr ? p.streakCount + 1 : 1;
      return { ...p, streakCount: newStreak, lastActiveDate: today };
    });
  }, [activeProfileId, updateProfile]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) ?? null;

  return (
    <AppContext.Provider value={{
      profiles, activeProfileId, activeProfile, isLoading,
      setActiveProfileId, createProfile, deleteProfile,
      markWordSeen, recordTestResult, completeLevel, updateStreak,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
