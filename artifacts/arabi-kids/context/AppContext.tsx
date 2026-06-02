import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, WordProgress, TestResult } from '@/types';
import { checkNewTrophies } from '@/constants/trophies';
import { checkNewStickers } from '@/constants/stickers';

const STORAGE_KEY = '@arabi_kids_profiles_v2';
const ACTIVE_KEY = '@arabi_kids_active_v2';

interface AppContextType {
  profiles: Profile[];
  activeProfileId: string | null;
  activeProfile: Profile | null;
  isLoading: boolean;
  setActiveProfileId: (id: string | null) => void;
  createProfile: (name: string, avatarId: number) => Promise<Profile>;
  editProfile: (id: string, name: string, avatarId: number) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  markWordSeen: (wordId: string) => Promise<{ trophies: string[]; stickers: string[] }>;
  recordTestResult: (result: TestResult) => Promise<{ trophies: string[]; stickers: string[] }>;
  completeLevel: (levelId: string, stars: number) => Promise<{ trophies: string[]; stickers: string[] }>;
  addTimeSpent: (minutes: number) => Promise<void>;
  updateStreak: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

/** Ensure a parsed profile from storage has all fields with correct types */
function migrateProfile(p: Partial<Profile> & { id: string; name: string }): Profile {
  const streakCount = p.streakCount ?? 1;
  return {
    id: p.id,
    name: p.name,
    avatarId: p.avatarId ?? 0,
    createdAt: p.createdAt ?? Date.now(),
    progress: p.progress ?? {},
    completedLevels: p.completedLevels ?? {},
    trophies: p.trophies ?? [],
    stickers: p.stickers ?? [],
    streakCount,
    bestStreak: p.bestStreak ?? streakCount,
    lastActiveDate: p.lastActiveDate ?? todayString(),
    testResults: p.testResults ?? [],
    timeSpentMinutes: p.timeSpentMinutes ?? 0,
    activityLog: p.activityLog ?? (p.lastActiveDate ? [p.lastActiveDate] : [todayString()]),
  };
}

function createEmptyProfile(name: string, avatarId: number): Profile {
  const today = todayString();
  return {
    id: generateId(),
    name,
    avatarId,
    createdAt: Date.now(),
    progress: {},
    completedLevels: {},
    trophies: [],
    stickers: ['sticker-welcome'],
    streakCount: 1,
    bestStreak: 1,
    lastActiveDate: today,
    testResults: [],
    timeSpentMinutes: 0,
    activityLog: [today],
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
      if (profilesData) {
        const parsed: unknown[] = JSON.parse(profilesData);
        const migrated = (parsed as Array<Partial<Profile> & { id: string; name: string }>).map(migrateProfile);
        setProfiles(migrated);
      }
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

  const editProfile = useCallback(async (id: string, name: string, avatarId: number): Promise<void> => {
    const updated = profiles.map(p => p.id === id ? { ...p, name, avatarId } : p);
    await saveProfiles(updated);
  }, [profiles]);

  const deleteProfile = useCallback(async (id: string) => {
    const updated = profiles.filter(p => p.id !== id);
    await saveProfiles(updated);
    if (activeProfileId === id) {
      await setActiveProfileId(null);
    }
  }, [profiles, activeProfileId]);

  const updateProfileWithRewards = useCallback(async (
    profileId: string,
    updater: (p: Profile) => Profile
  ): Promise<{ trophies: string[]; stickers: string[] }> => {
    let newTrophies: string[] = [];
    let newStickers: string[] = [];
    const updated = profiles.map(p => {
      if (p.id !== profileId) return p;
      const updatedProfile = updater(p);
      newTrophies = checkNewTrophies(updatedProfile);
      newStickers = checkNewStickers(updatedProfile);
      return {
        ...updatedProfile,
        trophies: [...updatedProfile.trophies, ...newTrophies],
        stickers: [...updatedProfile.stickers, ...newStickers],
      };
    });
    await saveProfiles(updated);
    return { trophies: newTrophies, stickers: newStickers };
  }, [profiles]);

  const markWordSeen = useCallback(async (wordId: string) => {
    if (!activeProfileId) return { trophies: [], stickers: [] };
    return updateProfileWithRewards(activeProfileId, (p) => ({
      ...p,
      progress: {
        ...p.progress,
        [wordId]: {
          seen: true,
          testCorrect: p.progress[wordId]?.testCorrect ?? 0,
          testTotal: p.progress[wordId]?.testTotal ?? 0,
        },
      },
    }));
  }, [activeProfileId, updateProfileWithRewards]);

  const recordTestResult = useCallback(async (result: TestResult) => {
    if (!activeProfileId) return { trophies: [], stickers: [] };
    return updateProfileWithRewards(activeProfileId, (p) => ({
      ...p,
      testResults: [...p.testResults, result],
    }));
  }, [activeProfileId, updateProfileWithRewards]);

  const completeLevel = useCallback(async (levelId: string, stars: number) => {
    if (!activeProfileId) return { trophies: [], stickers: [] };
    return updateProfileWithRewards(activeProfileId, (p) => {
      const existing = p.completedLevels[levelId] ?? 0;
      return {
        ...p,
        completedLevels: {
          ...p.completedLevels,
          [levelId]: Math.max(existing, stars),
        },
      };
    });
  }, [activeProfileId, updateProfileWithRewards]);

  const addTimeSpent = useCallback(async (minutes: number) => {
    if (!activeProfileId) return;
    const updated = profiles.map(p => p.id === activeProfileId
      ? { ...p, timeSpentMinutes: p.timeSpentMinutes + Math.max(0, minutes) }
      : p
    );
    await saveProfiles(updated);
  }, [activeProfileId, profiles]);

  const updateStreak = useCallback(async () => {
    if (!activeProfileId) return;
    await updateProfileWithRewards(activeProfileId, (p) => {
      const today = todayString();
      // Update activity log: add today if missing, keep last 60 days
      const logSet = new Set(p.activityLog ?? []);
      logSet.add(today);
      const sortedLog = [...logSet].sort().slice(-60);

      if (p.lastActiveDate === today) return { ...p, activityLog: sortedLog };

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const newStreak = p.lastActiveDate === yesterdayStr ? p.streakCount + 1 : 1;
      return {
        ...p,
        streakCount: newStreak,
        bestStreak: Math.max(p.bestStreak ?? newStreak, newStreak),
        lastActiveDate: today,
        activityLog: sortedLog,
      };
    });
  }, [activeProfileId, updateProfileWithRewards]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) ?? null;

  return (
    <AppContext.Provider value={{
      profiles, activeProfileId, activeProfile, isLoading,
      setActiveProfileId, createProfile, editProfile, deleteProfile,
      markWordSeen, recordTestResult, completeLevel, addTimeSpent, updateStreak,
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
