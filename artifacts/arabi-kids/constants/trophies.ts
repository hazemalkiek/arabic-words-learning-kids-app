import { Trophy, Profile } from '@/types';

const wordsSeen = (p: Profile) => Object.values(p.progress).filter(pr => pr.seen).length;
const levelsCompleted = (p: Profile) => Object.keys(p.completedLevels).filter(k => !k.startsWith('test')).length;
const testsPerfect = (p: Profile) => p.testResults.filter(r => r.score === r.total && r.total > 0).length;

export const TROPHIES: Trophy[] = [
  // First-time milestones
  { id: 'first-word', title: 'First Word!', description: 'Learned your very first Arabic word', icon: 'star-circle', color: '#FFD700', condition: (p) => wordsSeen(p) >= 1 },
  { id: 'first-level', title: 'Level Champion', description: 'Completed your first level', icon: 'trophy', color: '#FF8B42', condition: (p) => levelsCompleted(p) >= 1 },
  { id: 'first-test', title: 'Quiz Starter', description: 'Completed your first quiz', icon: 'clipboard-check', color: '#00BBF9', condition: (p) => p.testResults.length >= 1 },
  { id: 'first-perfect', title: 'Perfect Score!', description: 'Got 100% on a test', icon: 'crown', color: '#FFD700', condition: (p) => testsPerfect(p) >= 1 },
  { id: 'first-explore', title: 'Explorer', description: 'Discovered words in Explore mode', icon: 'compass', color: '#4ECDC4', condition: (p) => wordsSeen(p) >= 3 },
  // Word count milestones
  { id: 'words-10', title: 'Word Collector', description: 'Learned 10 words', icon: 'book-alphabet', color: '#6BCB77', condition: (p) => wordsSeen(p) >= 10 },
  { id: 'words-25', title: 'Vocabulary Ace', description: 'Learned 25 words', icon: 'book-open-page-variant', color: '#4ECDC4', condition: (p) => wordsSeen(p) >= 25 },
  { id: 'words-50', title: 'Half Century', description: 'Learned 50 words!', icon: 'book-multiple', color: '#9B5DE5', condition: (p) => wordsSeen(p) >= 50 },
  { id: 'words-75', title: 'Almost There!', description: 'Learned 75 words!', icon: 'book-check', color: '#FF4D9E', condition: (p) => wordsSeen(p) >= 75 },
  { id: 'words-all', title: 'Arabic Master!', description: 'Learned all 120 words!', icon: 'medal', color: '#FFD700', condition: (p) => wordsSeen(p) >= 120 },
  // Streak milestones
  { id: 'streak-3', title: '3-Day Streak', description: 'Practiced 3 days in a row', icon: 'fire', color: '#FF6B35', condition: (p) => p.streakCount >= 3 },
  { id: 'streak-7', title: 'Week Warrior', description: 'Practiced 7 days in a row', icon: 'fire', color: '#FF4500', condition: (p) => p.streakCount >= 7 },
  { id: 'streak-14', title: 'Two-Week Hero', description: 'Practiced 14 days in a row', icon: 'fire', color: '#FF2D00', condition: (p) => p.streakCount >= 14 },
  { id: 'streak-30', title: 'Month Champion', description: 'Practiced 30 days in a row!', icon: 'fire', color: '#E84848', condition: (p) => p.streakCount >= 30 },
  // Level milestones
  { id: 'levels-5', title: 'Level Hunter', description: 'Completed 5 levels', icon: 'layers', color: '#FF8B42', condition: (p) => levelsCompleted(p) >= 5 },
  { id: 'levels-12', title: 'Halfway Hero', description: 'Completed 12 levels', icon: 'layers-triple', color: '#4ECDC4', condition: (p) => levelsCompleted(p) >= 12 },
  { id: 'levels-all', title: 'Grand Champion', description: 'Completed all 24 levels!', icon: 'trophy-award', color: '#FFD700', condition: (p) => levelsCompleted(p) >= 24 },
  // Theme completion trophies
  { id: 'animals-done', title: 'Animal Expert', description: 'Completed all Animals levels', icon: 'paw', color: '#FF8B42', condition: (p) => ['animals-beginner','animals-intermediate','animals-advanced'].every(id => id in p.completedLevels) },
  { id: 'food-done', title: 'Food Lover', description: 'Completed all Food levels', icon: 'food-apple', color: '#E84393', condition: (p) => ['food-beginner','food-intermediate','food-advanced'].every(id => id in p.completedLevels) },
  { id: 'colors-done', title: 'Color Wizard', description: 'Completed all Colors levels', icon: 'palette', color: '#9B5DE5', condition: (p) => ['colors-beginner','colors-intermediate','colors-advanced'].every(id => id in p.completedLevels) },
  { id: 'numbers-done', title: 'Number Ninja', description: 'Completed all Numbers levels', icon: 'numeric', color: '#00BBF9', condition: (p) => ['numbers-beginner','numbers-intermediate','numbers-advanced'].every(id => id in p.completedLevels) },
  { id: 'home-done', title: 'Home Expert', description: 'Completed all Home levels', icon: 'home-heart', color: '#6BCB77', condition: (p) => ['home-beginner','home-intermediate','home-advanced'].every(id => id in p.completedLevels) },
  { id: 'body-done', title: 'Body Smart', description: 'Completed all Body levels', icon: 'human', color: '#FF6B6B', condition: (p) => ['body-beginner','body-intermediate','body-advanced'].every(id => id in p.completedLevels) },
  { id: 'nature-done', title: 'Nature Lover', description: 'Completed all Nature levels', icon: 'tree', color: '#4CAF50', condition: (p) => ['nature-beginner','nature-intermediate','nature-advanced'].every(id => id in p.completedLevels) },
  { id: 'clothes-done', title: 'Fashion Star', description: 'Completed all Clothes levels', icon: 'tshirt-crew', color: '#FF4D9E', condition: (p) => ['clothes-beginner','clothes-intermediate','clothes-advanced'].every(id => id in p.completedLevels) },
  // Test performance trophies
  { id: 'tests-5', title: 'Test Veteran', description: 'Completed 5 tests', icon: 'clipboard-text', color: '#4ECDC4', condition: (p) => p.testResults.length >= 5 },
  { id: 'tests-10', title: 'Quiz Legend', description: 'Completed 10 tests', icon: 'clipboard-text-multiple', color: '#9B5DE5', condition: (p) => p.testResults.length >= 10 },
  { id: 'perfect-3', title: 'Triple Perfect', description: 'Got 3 perfect scores', icon: 'crown', color: '#FF8B42', condition: (p) => testsPerfect(p) >= 3 },
  { id: 'perfect-5', title: 'Flawless', description: 'Got 5 perfect scores', icon: 'crown', color: '#9B5DE5', condition: (p) => testsPerfect(p) >= 5 },
  // All-rounder
  { id: 'all-themes', title: 'All Rounder', description: 'Learned words from every theme', icon: 'star-circle-outline', color: '#FFD700', condition: (p) => {
    return ['an','fo','co','nu','ho','bo','na','cl'].every(prefix =>
      Object.keys(p.progress).some(k => k.startsWith(prefix) && p.progress[k].seen)
    );
  }},
  { id: 'multilevel', title: 'Multi-Level Master', description: 'Completed levels in 5 different themes', icon: 'view-grid', color: '#FF6B35', condition: (p) => {
    const themes = new Set(Object.keys(p.completedLevels).filter(k => !k.startsWith('test')).map(k => k.split('-')[0]));
    return themes.size >= 5;
  }},
];

export function checkNewTrophies(profile: Profile): string[] {
  const newTrophies: string[] = [];
  for (const trophy of TROPHIES) {
    if (!profile.trophies.includes(trophy.id) && trophy.condition(profile)) {
      newTrophies.push(trophy.id);
    }
  }
  return newTrophies;
}
