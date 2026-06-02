import * as Speech from 'expo-speech';

/** Speak a short Arabic phrase as an audio reward/cue */
function speakArabic(text: string, pitch = 1.1, rate = 1.0) {
  Speech.stop();
  Speech.speak(text, { language: 'ar', rate, pitch });
}

/** Play "Correct!" audio cue — "ممتاز" (Excellent) */
export function playCorrect() {
  speakArabic('ممتاز!', 1.3, 1.1);
}

/** Play "Wrong / try again" audio cue — "حاول" (Try) */
export function playWrong() {
  speakArabic('حاول مرة أخرى', 0.85, 0.9);
}

/** Play level complete audio cue — "رائع جداً" (Very wonderful) */
export function playLevelComplete() {
  speakArabic('رائع جداً!', 1.2, 0.9);
}

/** Play trophy/sticker unlock cue — "مبروك" (Congratulations) */
export function playUnlock() {
  speakArabic('مبروك!', 1.3, 1.0);
}
