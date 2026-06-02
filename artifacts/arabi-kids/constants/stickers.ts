import { Sticker, Profile } from '@/types';

export const STICKERS: Sticker[] = [
  // Starter stickers
  { id: 'sticker-welcome', name: 'Welcome!', description: 'Joined the Arabic adventure', icon: 'hand-wave', color: '#FFD700', condition: () => true },
  { id: 'sticker-nour', name: 'Nour Friend', description: 'Met your mascot Nour', icon: 'star-four-points', color: '#FFB800', condition: (p) => Object.keys(p.progress).length >= 1 },
  // Animal stickers
  { id: 'sticker-cat', name: 'Cat Fan', description: 'Learned the word cat (قطة)', icon: 'cat', color: '#FF8B42', condition: (p) => !!p.progress['an-cat']?.seen },
  { id: 'sticker-lion', name: 'Lion Heart', description: 'Learned the word lion (أسد)', icon: 'paw', color: '#F9C74F', condition: (p) => !!p.progress['an-lion']?.seen },
  { id: 'sticker-butterfly', name: 'Social Butterfly', description: 'Learned the word butterfly (فراشة)', icon: 'butterfly', color: '#FF4D9E', condition: (p) => !!p.progress['an-butterfly']?.seen },
  // Nature stickers
  { id: 'sticker-sun', name: 'Sunshine', description: 'Learned the word sun (شمس)', icon: 'weather-sunny', color: '#FFD700', condition: (p) => !!p.progress['na-sun']?.seen },
  { id: 'sticker-star', name: 'Star Gazer', description: 'Learned the word star (نجمة)', icon: 'star-shooting', color: '#9B5DE5', condition: (p) => !!p.progress['na-star']?.seen },
  { id: 'sticker-flower', name: 'Flower Power', description: 'Learned the word flower (زهرة)', icon: 'flower', color: '#FF4D9E', condition: (p) => !!p.progress['na-flower']?.seen },
  // Achievement stickers
  { id: 'sticker-reader', name: 'Book Worm', description: 'Completed 3 Learn levels', icon: 'book-open-variant', color: '#4ECDC4', condition: (p) => Object.keys(p.completedLevels).filter(k => !k.startsWith('test')).length >= 3 },
  { id: 'sticker-quiz', name: 'Quiz Star', description: 'Completed first quiz', icon: 'clipboard-text', color: '#9B5DE5', condition: (p) => p.testResults.length >= 1 },
  { id: 'sticker-perfect', name: 'Gold Star', description: 'Got a perfect quiz score', icon: 'star-circle', color: '#FFD700', condition: (p) => p.testResults.some(r => r.score === r.total && r.total > 0) },
  // Streak stickers
  { id: 'sticker-streak3', name: '3-Day Champ', description: 'Practiced 3 days in a row', icon: 'fire', color: '#FF6B35', condition: (p) => p.streakCount >= 3 },
  { id: 'sticker-streak7', name: 'On Fire!', description: 'Practiced 7 days in a row', icon: 'fire', color: '#FF2D00', condition: (p) => p.streakCount >= 7 },
  // Word count stickers
  { id: 'sticker-5words', name: 'First Steps', description: 'Learned 5 words', icon: 'walk', color: '#6BCB77', condition: (p) => Object.values(p.progress).filter(pr => pr.seen).length >= 5 },
  { id: 'sticker-20words', name: 'Word Wizard', description: 'Learned 20 words', icon: 'magic-staff', color: '#9B5DE5', condition: (p) => Object.values(p.progress).filter(pr => pr.seen).length >= 20 },
  // Theme stickers
  { id: 'sticker-animals-done', name: 'Animal Champion', description: 'Completed all Animal levels', icon: 'paw', color: '#FF8B42', condition: (p) => ['animals-beginner','animals-intermediate','animals-advanced'].every(id => id in p.completedLevels) },
  { id: 'sticker-colors-done', name: 'Rainbow Master', description: 'Completed all Color levels', icon: 'palette', color: '#9B5DE5', condition: (p) => ['colors-beginner','colors-intermediate','colors-advanced'].every(id => id in p.completedLevels) },
  { id: 'sticker-food-done', name: 'Chef Extraordinaire', description: 'Completed all Food levels', icon: 'chef-hat', color: '#E84393', condition: (p) => ['food-beginner','food-intermediate','food-advanced'].every(id => id in p.completedLevels) },
  // Heart sticker
  { id: 'sticker-heart', name: 'Arabic Lover', description: 'Shows real love for Arabic', icon: 'heart', color: '#E84848', condition: (p) => Object.values(p.progress).filter(pr => pr.seen).length >= 15 },
];

export function checkNewStickers(profile: Profile): string[] {
  const newStickers: string[] = [];
  for (const sticker of STICKERS) {
    if (!profile.stickers.includes(sticker.id) && sticker.condition(profile)) {
      newStickers.push(sticker.id);
    }
  }
  return newStickers;
}
