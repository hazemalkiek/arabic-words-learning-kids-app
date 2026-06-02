import { Trophy, Profile } from '@/types';

export const TROPHIES: Trophy[] = [
  // First-time milestones
  { id: 'first-word', title: 'First Word!', description: 'Learned your first Arabic word', icon: 'star-circle', color: '#FFD700', condition: (p) => Object.keys(p.progress).length >= 1 },
  { id: 'first-level', title: 'Level Champion', description: 'Completed your first level', icon: 'trophy', color: '#FF8B42', condition: (p) => Object.keys(p.completedLevels).length >= 1 },
  { id: 'first-test', title: 'Quiz Master', description: 'Completed your first test', icon: 'clipboard-check', color: '#00BBF9', condition: (p) => p.testResults.length >= 1 },
  { id: 'first-perfect', title: 'Perfect Score!', description: 'Got 3 stars on a test', icon: 'crown', color: '#FFD700', condition: (p) => p.testResults.some(r => r.stars === 3) },
  // Word count milestones
  { id: 'words-10', title: 'Word Collector', description: 'Learned 10 words', icon: 'book-alphabet', color: '#6BCB77', condition: (p) => Object.keys(p.progress).filter(k => p.progress[k].seen).length >= 10 },
  { id: 'words-25', title: 'Vocabulary Ace', description: 'Learned 25 words', icon: 'book-open-page-variant', color: '#4ECDC4', condition: (p) => Object.keys(p.progress).filter(k => p.progress[k].seen).length >= 25 },
  { id: 'words-50', title: 'Half Century', description: 'Learned 50 words', icon: 'book-multiple', color: '#9B5DE5', condition: (p) => Object.keys(p.progress).filter(k => p.progress[k].seen).length >= 50 },
  { id: 'words-all', title: 'Arabic Master!', description: 'Learned all 120 words!', icon: 'medal', color: '#FFD700', condition: (p) => Object.keys(p.progress).filter(k => p.progress[k].seen).length >= 120 },
  // Streak milestones
  { id: 'streak-3', title: '3-Day Streak', description: 'Practiced 3 days in a row', icon: 'fire', color: '#FF6B35', condition: (p) => p.streakCount >= 3 },
  { id: 'streak-7', title: 'Week Warrior', description: 'Practiced 7 days in a row', icon: 'fire', color: '#FF4500', condition: (p) => p.streakCount >= 7 },
  { id: 'streak-14', title: 'Two-Week Hero', description: 'Practiced 14 days in a row', icon: 'fire', color: '#FF2D00', condition: (p) => p.streakCount >= 14 },
  { id: 'streak-30', title: 'Month Champion', description: 'Practiced 30 days in a row', icon: 'fire', color: '#E84848', condition: (p) => p.streakCount >= 30 },
  // Theme completion
  { id: 'animals-done', title: 'Animal Expert', description: 'Completed all Animals levels', icon: 'paw', color: '#FF8B42', condition: (p) => ['animals-beginner','animals-intermediate','animals-advanced'].every(id => id in p.completedLevels) },
  { id: 'food-done', title: 'Food Lover', description: 'Completed all Food levels', icon: 'food-apple', color: '#E84393', condition: (p) => ['food-beginner','food-intermediate','food-advanced'].every(id => id in p.completedLevels) },
  { id: 'colors-done', title: 'Color Wizard', description: 'Completed all Colors levels', icon: 'palette', color: '#9B5DE5', condition: (p) => ['colors-beginner','colors-intermediate','colors-advanced'].every(id => id in p.completedLevels) },
  { id: 'numbers-done', title: 'Number Ninja', description: 'Completed all Numbers levels', icon: 'numeric', color: '#00BBF9', condition: (p) => ['numbers-beginner','numbers-intermediate','numbers-advanced'].every(id => id in p.completedLevels) },
  { id: 'home-done', title: 'Home Expert', description: 'Completed all Home levels', icon: 'home-heart', color: '#6BCB77', condition: (p) => ['home-beginner','home-intermediate','home-advanced'].every(id => id in p.completedLevels) },
  { id: 'body-done', title: 'Body Smart', description: 'Completed all Body levels', icon: 'human', color: '#FF6B6B', condition: (p) => ['body-beginner','body-intermediate','body-advanced'].every(id => id in p.completedLevels) },
  { id: 'nature-done', title: 'Nature Lover', description: 'Completed all Nature levels', icon: 'tree', color: '#4CAF50', condition: (p) => ['nature-beginner','nature-intermediate','nature-advanced'].every(id => id in p.completedLevels) },
  { id: 'clothes-done', title: 'Fashion Star', description: 'Completed all Clothes levels', icon: 'tshirt-crew', color: '#FF4D9E', condition: (p) => ['clothes-beginner','clothes-intermediate','clothes-advanced'].every(id => id in p.completedLevels) },
  // Test achievements
  { id: 'tests-5', title: 'Test Veteran', description: 'Completed 5 tests', icon: 'clipboard-text', color: '#4ECDC4', condition: (p) => p.testResults.length >= 5 },
  { id: 'tests-10', title: 'Quiz Legend', description: 'Completed 10 tests', icon: 'clipboard-text-multiple', color: '#9B5DE5', condition: (p) => p.testResults.length >= 10 },
  // Special
  { id: 'explorer', title: 'Explorer', description: 'Discovered 5 words in Explore mode', icon: 'compass', color: '#00BBF9', condition: (p) => Object.keys(p.progress).filter(k => p.progress[k].seen).length >= 5 },
  { id: 'multilevel', title: 'Level Hunter', description: 'Completed 5 levels', icon: 'layers', color: '#FF8B42', condition: (p) => Object.keys(p.completedLevels).length >= 5 },
  { id: 'all-themes', title: 'All Rounder', description: 'Learned at least one word from every theme', icon: 'star-circle-outline', color: '#FFD700', condition: (p) => {
    const themes = ['animals','food','colors','numbers','home','body','nature','clothes'];
    return themes.every(theme => Object.keys(p.progress).some(k => k.startsWith(theme.slice(0,2))));
  }},
  // Level count
  { id: 'levels-all', title: 'Grand Champion', description: 'Completed all 24 levels', icon: 'trophy-award', color: '#FFD700', condition: (p) => Object.keys(p.completedLevels).length >= 24 },
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
