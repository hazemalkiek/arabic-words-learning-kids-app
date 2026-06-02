import * as Speech from 'expo-speech';

/** Speak a short Arabic phrase as an audio reward/cue */
function speakArabic(text: string, pitch = 1.0, rate = 0.8) {
  Speech.stop();
  // ar-SA = Saudi Arabic (Modern Standard Arabic) — clearest pronunciation
  Speech.speak(text, { language: 'ar-SA', rate, pitch });
}

/** Play "Correct!" audio cue — "ممتاز" (Excellent) */
export function playCorrect() {
  speakArabic('ممتاز', 1.1, 0.85);
}

/** Play "Wrong / try again" audio cue — "حاول مرة أخرى" (Try again) */
export function playWrong() {
  speakArabic('حاول مرة أخرى', 1.0, 0.8);
}

/** Play level complete audio cue — "رائع جداً" (Very wonderful) */
export function playLevelComplete() {
  speakArabic('رائع جداً', 1.0, 0.8);
}

/** Play trophy/sticker unlock cue — "مبروك" (Congratulations) */
export function playUnlock() {
  speakArabic('مبروك', 1.1, 0.85);
}
