/**
 * Arabic Audio Player
 *
 * Plays pre-recorded M4A files bundled in assets/audio/ using expo-audio.
 * Falls back silently to expo-speech if playback fails.
 * English always uses expo-speech (no bundled files needed).
 */

import { createAudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';

// Static asset map — Metro requires static require() calls for bundled assets
const AUDIO_FILES: Record<string, number> = {
  // Animals
  'an-cat':        require('@/assets/audio/an-cat.m4a'),
  'an-dog':        require('@/assets/audio/an-dog.m4a'),
  'an-fish':       require('@/assets/audio/an-fish.m4a'),
  'an-bird':       require('@/assets/audio/an-bird.m4a'),
  'an-rabbit':     require('@/assets/audio/an-rabbit.m4a'),
  'an-elephant':   require('@/assets/audio/an-elephant.m4a'),
  'an-lion':       require('@/assets/audio/an-lion.m4a'),
  'an-horse':      require('@/assets/audio/an-horse.m4a'),
  'an-sheep':      require('@/assets/audio/an-sheep.m4a'),
  'an-butterfly':  require('@/assets/audio/an-butterfly.m4a'),
  'an-bee':        require('@/assets/audio/an-bee.m4a'),
  'an-turtle':     require('@/assets/audio/an-turtle.m4a'),
  'an-monkey':     require('@/assets/audio/an-monkey.m4a'),
  'an-frog':       require('@/assets/audio/an-frog.m4a'),
  'an-camel':      require('@/assets/audio/an-camel.m4a'),
  // Food
  'fo-apple':      require('@/assets/audio/fo-apple.m4a'),
  'fo-bread':      require('@/assets/audio/fo-bread.m4a'),
  'fo-cake':       require('@/assets/audio/fo-cake.m4a'),
  'fo-egg':        require('@/assets/audio/fo-egg.m4a'),
  'fo-milk':       require('@/assets/audio/fo-milk.m4a'),
  'fo-cheese':     require('@/assets/audio/fo-cheese.m4a'),
  'fo-orange':     require('@/assets/audio/fo-orange.m4a'),
  'fo-banana':     require('@/assets/audio/fo-banana.m4a'),
  'fo-rice':       require('@/assets/audio/fo-rice.m4a'),
  'fo-tea':        require('@/assets/audio/fo-tea.m4a'),
  'fo-coffee':     require('@/assets/audio/fo-coffee.m4a'),
  'fo-chicken':    require('@/assets/audio/fo-chicken.m4a'),
  'fo-watermelon': require('@/assets/audio/fo-watermelon.m4a'),
  'fo-pizza':      require('@/assets/audio/fo-pizza.m4a'),
  'fo-grapes':     require('@/assets/audio/fo-grapes.m4a'),
  // Colors
  'co-red':        require('@/assets/audio/co-red.m4a'),
  'co-blue':       require('@/assets/audio/co-blue.m4a'),
  'co-green':      require('@/assets/audio/co-green.m4a'),
  'co-yellow':     require('@/assets/audio/co-yellow.m4a'),
  'co-white':      require('@/assets/audio/co-white.m4a'),
  'co-orange':     require('@/assets/audio/co-orange.m4a'),
  'co-purple':     require('@/assets/audio/co-purple.m4a'),
  'co-black':      require('@/assets/audio/co-black.m4a'),
  'co-brown':      require('@/assets/audio/co-brown.m4a'),
  'co-pink':       require('@/assets/audio/co-pink.m4a'),
  'co-grey':       require('@/assets/audio/co-grey.m4a'),
  'co-gold':       require('@/assets/audio/co-gold.m4a'),
  'co-silver':     require('@/assets/audio/co-silver.m4a'),
  'co-turquoise':  require('@/assets/audio/co-turquoise.m4a'),
  'co-maroon':     require('@/assets/audio/co-maroon.m4a'),
  // Numbers
  'nu-one':        require('@/assets/audio/nu-one.m4a'),
  'nu-two':        require('@/assets/audio/nu-two.m4a'),
  'nu-three':      require('@/assets/audio/nu-three.m4a'),
  'nu-four':       require('@/assets/audio/nu-four.m4a'),
  'nu-five':       require('@/assets/audio/nu-five.m4a'),
  'nu-six':        require('@/assets/audio/nu-six.m4a'),
  'nu-seven':      require('@/assets/audio/nu-seven.m4a'),
  'nu-eight':      require('@/assets/audio/nu-eight.m4a'),
  'nu-nine':       require('@/assets/audio/nu-nine.m4a'),
  'nu-ten':        require('@/assets/audio/nu-ten.m4a'),
  'nu-zero':       require('@/assets/audio/nu-zero.m4a'),
  'nu-twenty':     require('@/assets/audio/nu-twenty.m4a'),
  'nu-hundred':    require('@/assets/audio/nu-hundred.m4a'),
  'nu-thousand':   require('@/assets/audio/nu-thousand.m4a'),
  'nu-million':    require('@/assets/audio/nu-million.m4a'),
  // Home
  'ho-house':      require('@/assets/audio/ho-house.m4a'),
  'ho-door':       require('@/assets/audio/ho-door.m4a'),
  'ho-chair':      require('@/assets/audio/ho-chair.m4a'),
  'ho-table':      require('@/assets/audio/ho-table.m4a'),
  'ho-bed':        require('@/assets/audio/ho-bed.m4a'),
  'ho-window':     require('@/assets/audio/ho-window.m4a'),
  'ho-kitchen':    require('@/assets/audio/ho-kitchen.m4a'),
  'ho-bathroom':   require('@/assets/audio/ho-bathroom.m4a'),
  'ho-book':       require('@/assets/audio/ho-book.m4a'),
  'ho-clock':      require('@/assets/audio/ho-clock.m4a'),
  'ho-lamp':       require('@/assets/audio/ho-lamp.m4a'),
  'ho-phone':      require('@/assets/audio/ho-phone.m4a'),
  'ho-tv':         require('@/assets/audio/ho-tv.m4a'),
  'ho-carpet':     require('@/assets/audio/ho-carpet.m4a'),
  'ho-mirror':     require('@/assets/audio/ho-mirror.m4a'),
  // Body
  'bo-eye':        require('@/assets/audio/bo-eye.m4a'),
  'bo-nose':       require('@/assets/audio/bo-nose.m4a'),
  'bo-hand':       require('@/assets/audio/bo-hand.m4a'),
  'bo-foot':       require('@/assets/audio/bo-foot.m4a'),
  'bo-head':       require('@/assets/audio/bo-head.m4a'),
  'bo-ear':        require('@/assets/audio/bo-ear.m4a'),
  'bo-mouth':      require('@/assets/audio/bo-mouth.m4a'),
  'bo-heart':      require('@/assets/audio/bo-heart.m4a'),
  'bo-hair':       require('@/assets/audio/bo-hair.m4a'),
  'bo-finger':     require('@/assets/audio/bo-finger.m4a'),
  'bo-shoulder':   require('@/assets/audio/bo-shoulder.m4a'),
  'bo-knee':       require('@/assets/audio/bo-knee.m4a'),
  'bo-back':       require('@/assets/audio/bo-back.m4a'),
  'bo-cheek':      require('@/assets/audio/bo-cheek.m4a'),
  'bo-forehead':   require('@/assets/audio/bo-forehead.m4a'),
  // Nature
  'na-sun':        require('@/assets/audio/na-sun.m4a'),
  'na-moon':       require('@/assets/audio/na-moon.m4a'),
  'na-star':       require('@/assets/audio/na-star.m4a'),
  'na-tree':       require('@/assets/audio/na-tree.m4a'),
  'na-flower':     require('@/assets/audio/na-flower.m4a'),
  'na-cloud':      require('@/assets/audio/na-cloud.m4a'),
  'na-rain':       require('@/assets/audio/na-rain.m4a'),
  'na-mountain':   require('@/assets/audio/na-mountain.m4a'),
  'na-sea':        require('@/assets/audio/na-sea.m4a'),
  'na-river':      require('@/assets/audio/na-river.m4a'),
  'na-fire':       require('@/assets/audio/na-fire.m4a'),
  'na-earth':      require('@/assets/audio/na-earth.m4a'),
  'na-wind':       require('@/assets/audio/na-wind.m4a'),
  'na-snow':       require('@/assets/audio/na-snow.m4a'),
  'na-desert':     require('@/assets/audio/na-desert.m4a'),
  // Clothes
  'cl-shirt':      require('@/assets/audio/cl-shirt.m4a'),
  'cl-shoe':       require('@/assets/audio/cl-shoe.m4a'),
  'cl-hat':        require('@/assets/audio/cl-hat.m4a'),
  'cl-pants':      require('@/assets/audio/cl-pants.m4a'),
  'cl-dress':      require('@/assets/audio/cl-dress.m4a'),
  'cl-socks':      require('@/assets/audio/cl-socks.m4a'),
  'cl-glasses':    require('@/assets/audio/cl-glasses.m4a'),
  'cl-jacket':     require('@/assets/audio/cl-jacket.m4a'),
  'cl-bag':        require('@/assets/audio/cl-bag.m4a'),
  'cl-watch':      require('@/assets/audio/cl-watch.m4a'),
  'cl-scarf':      require('@/assets/audio/cl-scarf.m4a'),
  'cl-ring':       require('@/assets/audio/cl-ring.m4a'),
  'cl-necklace':   require('@/assets/audio/cl-necklace.m4a'),
  'cl-gloves':     require('@/assets/audio/cl-gloves.m4a'),
  'cl-boots':      require('@/assets/audio/cl-boots.m4a'),
  // Reward phrases
  'reward-correct':        require('@/assets/audio/reward-correct.m4a'),
  'reward-wrong':          require('@/assets/audio/reward-wrong.m4a'),
  'reward-level-complete': require('@/assets/audio/reward-level-complete.m4a'),
  'reward-unlock':         require('@/assets/audio/reward-unlock.m4a'),
};

// Arabic text fallback map for expo-speech if bundled audio fails
const ARABIC_TEXT: Record<string, string> = {
  'an-cat': 'قطة', 'an-dog': 'كلب', 'an-fish': 'سمكة', 'an-bird': 'طائر',
  'an-rabbit': 'أرنب', 'an-elephant': 'فيل', 'an-lion': 'أسد', 'an-horse': 'حصان',
  'an-sheep': 'خروف', 'an-butterfly': 'فراشة', 'an-bee': 'نحلة', 'an-turtle': 'سلحفاة',
  'an-monkey': 'قرد', 'an-frog': 'ضفدع', 'an-camel': 'جمل',
  'fo-apple': 'تفاحة', 'fo-bread': 'خبز', 'fo-cake': 'كيكة', 'fo-egg': 'بيضة',
  'fo-milk': 'حليب', 'fo-cheese': 'جبنة', 'fo-orange': 'برتقال', 'fo-banana': 'موزة',
  'fo-rice': 'أرز', 'fo-tea': 'شاي', 'fo-coffee': 'قهوة', 'fo-chicken': 'دجاجة',
  'fo-watermelon': 'بطيخ', 'fo-pizza': 'بيتزا', 'fo-grapes': 'عنب',
  'reward-correct': 'ممتاز', 'reward-wrong': 'حاول مرة أخرى',
  'reward-level-complete': 'رائع جداً', 'reward-unlock': 'مبروك',
};

let currentPlayer: ReturnType<typeof createAudioPlayer> | null = null;

function stopCurrent() {
  if (currentPlayer) {
    try { currentPlayer.remove(); } catch {}
    currentPlayer = null;
  }
}

/** Play a bundled Arabic audio file by word ID, falls back to TTS */
export function playArabicById(id: string): void {
  stopCurrent();
  const source = AUDIO_FILES[id];
  if (!source) return;
  try {
    const player = createAudioPlayer(source);
    currentPlayer = player;
    player.play();
  } catch (e) {
    // Fallback to expo-speech if audio playback fails
    const text = ARABIC_TEXT[id];
    if (text) {
      Speech.stop();
      Speech.speak(text, { language: 'ar-SA', rate: 0.6, pitch: 1.0 });
    }
  }
}

/** Speak Arabic text directly via TTS */
export function speakArabic(text: string): void {
  stopCurrent();
  Speech.stop();
  Speech.speak(text, { language: 'ar-SA', rate: 0.6, pitch: 1.0 });
}

/** Speak English text via TTS */
export function speakEnglish(text: string): void {
  Speech.stop();
  Speech.speak(text, { language: 'en', rate: 0.9 });
}

/** Stop any currently playing audio */
export function stopAudio(): void {
  stopCurrent();
  Speech.stop();
}

// ─── Reward sounds ────────────────────────────────────────────────────────────
export const playCorrect       = () => playArabicById('reward-correct');
export const playWrong         = () => playArabicById('reward-wrong');
export const playLevelComplete = () => playArabicById('reward-level-complete');
export const playUnlock        = () => playArabicById('reward-unlock');
