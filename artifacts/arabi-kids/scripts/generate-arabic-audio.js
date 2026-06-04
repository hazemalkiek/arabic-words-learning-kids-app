#!/usr/bin/env node
/**
 * Arabic Audio Generator
 * Generates MP3/M4A audio files for all Arabic words using macOS built-in voices.
 * Run once from the arabi-kids directory: node scripts/generate-arabic-audio.js
 *
 * Requirements: macOS with Arabic voice installed
 * Install voice: System Settings → Accessibility → Spoken Content → System Voice → Manage Voices → Arabic (Majed or Tarik)
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, '../assets/audio');
const RATE = 130; // words per minute — slower = clearer for kids

// ─── All words ────────────────────────────────────────────────────────────────
const WORDS = [
  // Animals
  { id: 'an-cat',        text: 'قطة' },
  { id: 'an-dog',        text: 'كلب' },
  { id: 'an-fish',       text: 'سمكة' },
  { id: 'an-bird',       text: 'طائر' },
  { id: 'an-rabbit',     text: 'أرنب' },
  { id: 'an-elephant',   text: 'فيل' },
  { id: 'an-lion',       text: 'أسد' },
  { id: 'an-horse',      text: 'حصان' },
  { id: 'an-sheep',      text: 'خروف' },
  { id: 'an-butterfly',  text: 'فراشة' },
  { id: 'an-bee',        text: 'نحلة' },
  { id: 'an-turtle',     text: 'سلحفاة' },
  { id: 'an-monkey',     text: 'قرد' },
  { id: 'an-frog',       text: 'ضفدع' },
  { id: 'an-camel',      text: 'جمل' },
  // Food
  { id: 'fo-apple',      text: 'تفاحة' },
  { id: 'fo-bread',      text: 'خبز' },
  { id: 'fo-cake',       text: 'كيكة' },
  { id: 'fo-egg',        text: 'بيضة' },
  { id: 'fo-milk',       text: 'حليب' },
  { id: 'fo-cheese',     text: 'جبنة' },
  { id: 'fo-orange',     text: 'برتقال' },
  { id: 'fo-banana',     text: 'موزة' },
  { id: 'fo-rice',       text: 'أرز' },
  { id: 'fo-tea',        text: 'شاي' },
  { id: 'fo-coffee',     text: 'قهوة' },
  { id: 'fo-chicken',    text: 'دجاجة' },
  { id: 'fo-watermelon', text: 'بطيخ' },
  { id: 'fo-pizza',      text: 'بيتزا' },
  { id: 'fo-grapes',     text: 'عنب' },
  // Colors
  { id: 'co-red',        text: 'أحمر' },
  { id: 'co-blue',       text: 'أزرق' },
  { id: 'co-green',      text: 'أخضر' },
  { id: 'co-yellow',     text: 'أصفر' },
  { id: 'co-white',      text: 'أبيض' },
  { id: 'co-orange',     text: 'برتقالي' },
  { id: 'co-purple',     text: 'بنفسجي' },
  { id: 'co-black',      text: 'أسود' },
  { id: 'co-brown',      text: 'بني' },
  { id: 'co-pink',       text: 'وردي' },
  { id: 'co-grey',       text: 'رمادي' },
  { id: 'co-gold',       text: 'ذهبي' },
  { id: 'co-silver',     text: 'فضي' },
  { id: 'co-turquoise',  text: 'فيروزي' },
  { id: 'co-maroon',     text: 'كستنائي' },
  // Numbers
  { id: 'nu-one',        text: 'واحد' },
  { id: 'nu-two',        text: 'اثنان' },
  { id: 'nu-three',      text: 'ثلاثة' },
  { id: 'nu-four',       text: 'أربعة' },
  { id: 'nu-five',       text: 'خمسة' },
  { id: 'nu-six',        text: 'ستة' },
  { id: 'nu-seven',      text: 'سبعة' },
  { id: 'nu-eight',      text: 'ثمانية' },
  { id: 'nu-nine',       text: 'تسعة' },
  { id: 'nu-ten',        text: 'عشرة' },
  { id: 'nu-zero',       text: 'صفر' },
  { id: 'nu-twenty',     text: 'عشرون' },
  { id: 'nu-hundred',    text: 'مئة' },
  { id: 'nu-thousand',   text: 'ألف' },
  { id: 'nu-million',    text: 'مليون' },
  // Home
  { id: 'ho-house',      text: 'منزل' },
  { id: 'ho-door',       text: 'باب' },
  { id: 'ho-chair',      text: 'كرسي' },
  { id: 'ho-table',      text: 'طاولة' },
  { id: 'ho-bed',        text: 'سرير' },
  { id: 'ho-window',     text: 'نافذة' },
  { id: 'ho-kitchen',    text: 'مطبخ' },
  { id: 'ho-bathroom',   text: 'حمام' },
  { id: 'ho-book',       text: 'كتاب' },
  { id: 'ho-clock',      text: 'ساعة' },
  { id: 'ho-lamp',       text: 'مصباح' },
  { id: 'ho-phone',      text: 'هاتف' },
  { id: 'ho-tv',         text: 'تلفاز' },
  { id: 'ho-carpet',     text: 'سجادة' },
  { id: 'ho-mirror',     text: 'مرآة' },
  // Body
  { id: 'bo-eye',        text: 'عين' },
  { id: 'bo-nose',       text: 'أنف' },
  { id: 'bo-hand',       text: 'يد' },
  { id: 'bo-foot',       text: 'قدم' },
  { id: 'bo-head',       text: 'رأس' },
  { id: 'bo-ear',        text: 'أذن' },
  { id: 'bo-mouth',      text: 'فم' },
  { id: 'bo-heart',      text: 'قلب' },
  { id: 'bo-hair',       text: 'شعر' },
  { id: 'bo-finger',     text: 'إصبع' },
  { id: 'bo-shoulder',   text: 'كتف' },
  { id: 'bo-knee',       text: 'ركبة' },
  { id: 'bo-back',       text: 'ظهر' },
  { id: 'bo-cheek',      text: 'خد' },
  { id: 'bo-forehead',   text: 'جبهة' },
  // Nature
  { id: 'na-sun',        text: 'شمس' },
  { id: 'na-moon',       text: 'قمر' },
  { id: 'na-star',       text: 'نجمة' },
  { id: 'na-tree',       text: 'شجرة' },
  { id: 'na-flower',     text: 'زهرة' },
  { id: 'na-cloud',      text: 'غيمة' },
  { id: 'na-rain',       text: 'مطر' },
  { id: 'na-mountain',   text: 'جبل' },
  { id: 'na-sea',        text: 'بحر' },
  { id: 'na-river',      text: 'نهر' },
  { id: 'na-fire',       text: 'نار' },
  { id: 'na-earth',      text: 'أرض' },
  { id: 'na-wind',       text: 'ريح' },
  { id: 'na-snow',       text: 'ثلج' },
  { id: 'na-desert',     text: 'صحراء' },
  // Clothes
  { id: 'cl-shirt',      text: 'قميص' },
  { id: 'cl-shoe',       text: 'حذاء' },
  { id: 'cl-hat',        text: 'قبعة' },
  { id: 'cl-pants',      text: 'بنطلون' },
  { id: 'cl-dress',      text: 'فستان' },
  { id: 'cl-socks',      text: 'جوارب' },
  { id: 'cl-glasses',    text: 'نظارة' },
  { id: 'cl-jacket',     text: 'جاكيت' },
  { id: 'cl-bag',        text: 'حقيبة' },
  { id: 'cl-watch',      text: 'ساعة' },
  { id: 'cl-scarf',      text: 'وشاح' },
  { id: 'cl-ring',       text: 'خاتم' },
  { id: 'cl-necklace',   text: 'عقد' },
  { id: 'cl-gloves',     text: 'قفازات' },
  { id: 'cl-boots',      text: 'جزمة' },
];

// Reward / feedback phrases
const PHRASES = [
  { id: 'reward-correct',        text: 'ممتاز', rate: 160 },
  { id: 'reward-wrong',          text: 'حاول مرة أخرى', rate: 130 },
  { id: 'reward-level-complete', text: 'رائع جداً', rate: 160 },
  { id: 'reward-unlock',         text: 'مبروك', rate: 160 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectVoice() {
  try {
    const voices = execSync('say -v "?" 2>&1').toString();
    // Prefer Majed (male, Saudi), fallback to Tarik (male, Saudi newer), then any ar_ voice
    if (voices.includes('Majed')) return 'Majed';
    if (voices.includes('Tarik')) return 'Tarik';
    const match = voices.match(/^(\S+)\s+ar_/m);
    if (match) return match[1];
    return null;
  } catch {
    return null;
  }
}

function generateFile(id, text, voice, rate) {
  const aiff = path.join(AUDIO_DIR, `${id}.aiff`);
  const m4a  = path.join(AUDIO_DIR, `${id}.m4a`);

  if (fs.existsSync(m4a)) {
    process.stdout.write(`  skip  ${id}\n`);
    return true;
  }

  // Generate AIFF via say
  const sayResult = spawnSync('say', ['-v', voice, '-r', String(rate), text, '-o', aiff], { encoding: 'utf8' });
  if (sayResult.status !== 0) {
    console.error(`  ERROR generating ${id}: ${sayResult.stderr}`);
    return false;
  }

  // Convert AIFF → M4A (AAC) using afconvert (built into macOS)
  const afResult = spawnSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '64000', aiff, m4a], { encoding: 'utf8' });
  if (afResult.status !== 0) {
    console.error(`  ERROR converting ${id}: ${afResult.stderr}`);
    return false;
  }

  // Remove temp AIFF
  fs.unlinkSync(aiff);
  process.stdout.write(`  ✓  ${id}\n`);
  return true;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('\n🎙  Arabic Audio Generator\n');

const voice = detectVoice();
if (!voice) {
  console.error('❌  No Arabic voice found on this Mac.\n');
  console.error('   Install it: System Settings → Accessibility → Spoken Content');
  console.error('   → System Voice → Manage Voices → Arabic (Majed)\n');
  process.exit(1);
}
console.log(`✅  Using voice: ${voice}\n`);

if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true });

let ok = 0, fail = 0;

console.log('── Words (' + WORDS.length + ') ──────────────────────────');
for (const w of WORDS) {
  if (generateFile(w.id, w.text, voice, RATE)) ok++; else fail++;
}

console.log('\n── Reward phrases ──────────────────────────');
for (const p of PHRASES) {
  if (generateFile(p.id, p.text, voice, p.rate ?? RATE)) ok++; else fail++;
}

console.log(`\n✅  Done — ${ok} generated, ${fail} failed`);
console.log(`📁  Files saved to: ${AUDIO_DIR}\n`);
if (fail > 0) process.exit(1);
