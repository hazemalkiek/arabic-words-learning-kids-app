export type Theme = 'animals' | 'food' | 'colors' | 'numbers' | 'home' | 'body' | 'nature' | 'clothes';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type MascotMood = 'idle' | 'happy' | 'celebrate' | 'thinking';

export interface Word {
  id: string;
  english: string;
  arabic: string;
  transliteration: string;
  theme: Theme;
  difficulty: Difficulty;
  icon: string; // MaterialCommunityIcons icon name
  color: string; // background color for the word card
}

export interface WordProgress {
  seen: boolean;
  testCorrect: number;
  testTotal: number;
}

export interface TestResult {
  levelId: string;
  stars: number;
  score: number;
  total: number;
  date: string;
}

export interface Profile {
  id: string;
  name: string;
  avatarId: number; // 0-7
  createdAt: number;
  progress: Record<string, WordProgress>;
  completedLevels: Record<string, number>; // levelId → stars earned
  trophies: string[];
  streakCount: number;
  lastActiveDate: string; // YYYY-MM-DD
  testResults: TestResult[];
}

export interface Trophy {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  condition: (profile: Profile) => boolean;
}

export const THEMES: { id: Theme; label: string; arabicLabel: string; icon: string; color: string }[] = [
  { id: 'animals', label: 'Animals', arabicLabel: 'الحيوانات', icon: 'paw', color: '#FF8B42' },
  { id: 'food', label: 'Food', arabicLabel: 'الطعام', icon: 'food-apple', color: '#E84393' },
  { id: 'colors', label: 'Colors', arabicLabel: 'الألوان', icon: 'palette', color: '#9B5DE5' },
  { id: 'numbers', label: 'Numbers', arabicLabel: 'الأرقام', icon: 'numeric', color: '#00BBF9' },
  { id: 'home', label: 'Home', arabicLabel: 'المنزل', icon: 'home', color: '#6BCB77' },
  { id: 'body', label: 'Body', arabicLabel: 'الجسم', icon: 'human', color: '#FF6B6B' },
  { id: 'nature', label: 'Nature', arabicLabel: 'الطبيعة', icon: 'tree', color: '#4CAF50' },
  { id: 'clothes', label: 'Clothes', arabicLabel: 'الملابس', icon: 'tshirt-crew', color: '#FF4D9E' },
];

export const DIFFICULTIES: { id: Difficulty; label: string; arabicLabel: string; stars: number }[] = [
  { id: 'beginner', label: 'Beginner', arabicLabel: 'مبتدئ', stars: 1 },
  { id: 'intermediate', label: 'Intermediate', arabicLabel: 'متوسط', stars: 2 },
  { id: 'advanced', label: 'Advanced', arabicLabel: 'متقدم', stars: 3 },
];

export const AVATAR_ICONS = ['star-four-points', 'rocket', 'crown', 'lightning-bolt', 'heart', 'diamond', 'moon-full', 'sun'];
export const AVATAR_COLORS = ['#FFD700', '#FF6B35', '#9B5DE5', '#00BBF9', '#FF4D9E', '#4ECDC4', '#6BCB77', '#FF8B42'];
