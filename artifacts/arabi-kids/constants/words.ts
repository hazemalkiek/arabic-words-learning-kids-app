import { Word } from '@/types';

const RAW_WORDS: Omit<Word, 'imagePath'>[] = [
  // ─── ANIMALS ───────────────────────────────────────────────────────────────
  // Beginner
  { id: 'an-cat', english: 'Cat', arabic: 'قطة', transliteration: 'qitta', theme: 'animals', difficulty: 'beginner', icon: 'cat', color: '#FF8B42' },
  { id: 'an-dog', english: 'Dog', arabic: 'كلب', transliteration: 'kalb', theme: 'animals', difficulty: 'beginner', icon: 'dog', color: '#FF6B35' },
  { id: 'an-fish', english: 'Fish', arabic: 'سمكة', transliteration: 'samaka', theme: 'animals', difficulty: 'beginner', icon: 'fish', color: '#00BBF9' },
  { id: 'an-bird', english: 'Bird', arabic: 'طائر', transliteration: "ta'ir", theme: 'animals', difficulty: 'beginner', icon: 'bird', color: '#6BCB77' },
  { id: 'an-rabbit', english: 'Rabbit', arabic: 'أرنب', transliteration: 'arnab', theme: 'animals', difficulty: 'beginner', icon: 'rabbit', color: '#F9C74F' },
  // Intermediate
  { id: 'an-elephant', english: 'Elephant', arabic: 'فيل', transliteration: 'fil', theme: 'animals', difficulty: 'intermediate', icon: 'elephant', color: '#9B9B9B' },
  { id: 'an-lion', english: 'Lion', arabic: 'أسد', transliteration: 'asad', theme: 'animals', difficulty: 'intermediate', icon: 'lion', color: '#F9C74F' },
  { id: 'an-horse', english: 'Horse', arabic: 'حصان', transliteration: 'hisan', theme: 'animals', difficulty: 'intermediate', icon: 'horse', color: '#8B5E3C' },
  { id: 'an-sheep', english: 'Sheep', arabic: 'خروف', transliteration: 'kharuf', theme: 'animals', difficulty: 'intermediate', icon: 'sheep', color: '#F0F0F0' },
  { id: 'an-butterfly', english: 'Butterfly', arabic: 'فراشة', transliteration: 'farasha', theme: 'animals', difficulty: 'intermediate', icon: 'butterfly', color: '#FF4D9E' },
  // Advanced
  { id: 'an-bee', english: 'Bee', arabic: 'نحلة', transliteration: 'nahla', theme: 'animals', difficulty: 'advanced', icon: 'bee', color: '#FFD700' },
  { id: 'an-turtle', english: 'Turtle', arabic: 'سلحفاة', transliteration: 'sulhafa', theme: 'animals', difficulty: 'advanced', icon: 'turtle', color: '#4CAF50' },
  { id: 'an-monkey', english: 'Monkey', arabic: 'قرد', transliteration: 'qird', theme: 'animals', difficulty: 'advanced', icon: 'monkey', color: '#8B5E3C' },
  { id: 'an-frog', english: 'Frog', arabic: 'ضفدع', transliteration: "dafda'", theme: 'animals', difficulty: 'advanced', icon: 'frog', color: '#6BCB77' },
  { id: 'an-camel', english: 'Camel', arabic: 'جمل', transliteration: 'jamal', theme: 'animals', difficulty: 'advanced', icon: 'camel', color: '#D4A847' },

  // ─── FOOD ──────────────────────────────────────────────────────────────────
  // Beginner
  { id: 'fo-apple', english: 'Apple', arabic: 'تفاحة', transliteration: 'tuffaha', theme: 'food', difficulty: 'beginner', icon: 'food-apple', color: '#E84848' },
  { id: 'fo-bread', english: 'Bread', arabic: 'خبز', transliteration: 'khubz', theme: 'food', difficulty: 'beginner', icon: 'bread-slice', color: '#F9C74F' },
  { id: 'fo-cake', english: 'Cake', arabic: 'كيكة', transliteration: 'kika', theme: 'food', difficulty: 'beginner', icon: 'cake-variant', color: '#FF4D9E' },
  { id: 'fo-egg', english: 'Egg', arabic: 'بيضة', transliteration: 'bayda', theme: 'food', difficulty: 'beginner', icon: 'egg', color: '#FFF9C4' },
  { id: 'fo-milk', english: 'Milk', arabic: 'حليب', transliteration: 'halib', theme: 'food', difficulty: 'beginner', icon: 'cup', color: '#E3F2FD' },
  // Intermediate
  { id: 'fo-cheese', english: 'Cheese', arabic: 'جبنة', transliteration: 'jubna', theme: 'food', difficulty: 'intermediate', icon: 'cheese', color: '#FFD700' },
  { id: 'fo-orange', english: 'Orange', arabic: 'برتقال', transliteration: 'burtuqal', theme: 'food', difficulty: 'intermediate', icon: 'fruit-citrus', color: '#FF8C00' },
  { id: 'fo-banana', english: 'Banana', arabic: 'موزة', transliteration: 'mawza', theme: 'food', difficulty: 'intermediate', icon: 'fruit-pineapple', color: '#FFE57F' },
  { id: 'fo-rice', english: 'Rice', arabic: 'أرز', transliteration: 'aruzz', theme: 'food', difficulty: 'intermediate', icon: 'rice', color: '#F5F5F5' },
  { id: 'fo-tea', english: 'Tea', arabic: 'شاي', transliteration: 'shay', theme: 'food', difficulty: 'intermediate', icon: 'tea', color: '#8D6E63' },
  // Advanced
  { id: 'fo-coffee', english: 'Coffee', arabic: 'قهوة', transliteration: 'qahwa', theme: 'food', difficulty: 'advanced', icon: 'coffee', color: '#5D4037' },
  { id: 'fo-chicken', english: 'Chicken', arabic: 'دجاجة', transliteration: 'dajaja', theme: 'food', difficulty: 'advanced', icon: 'food-drumstick', color: '#FF8B42' },
  { id: 'fo-watermelon', english: 'Watermelon', arabic: 'بطيخ', transliteration: 'battikh', theme: 'food', difficulty: 'advanced', icon: 'food-variant', color: '#E84848' },
  { id: 'fo-pizza', english: 'Pizza', arabic: 'بيتزا', transliteration: 'pizza', theme: 'food', difficulty: 'advanced', icon: 'pizza', color: '#FF6B35' },
  { id: 'fo-grapes', english: 'Grapes', arabic: 'عنب', transliteration: "'inab", theme: 'food', difficulty: 'advanced', icon: 'fruit-grapes', color: '#9B5DE5' },

  // ─── COLORS ────────────────────────────────────────────────────────────────
  // Beginner
  { id: 'co-red', english: 'Red', arabic: 'أحمر', transliteration: 'ahmar', theme: 'colors', difficulty: 'beginner', icon: 'circle', color: '#E84848' },
  { id: 'co-blue', english: 'Blue', arabic: 'أزرق', transliteration: 'azraq', theme: 'colors', difficulty: 'beginner', icon: 'circle', color: '#2196F3' },
  { id: 'co-green', english: 'Green', arabic: 'أخضر', transliteration: 'akhdar', theme: 'colors', difficulty: 'beginner', icon: 'circle', color: '#4CAF50' },
  { id: 'co-yellow', english: 'Yellow', arabic: 'أصفر', transliteration: 'asfar', theme: 'colors', difficulty: 'beginner', icon: 'circle', color: '#FFD700' },
  { id: 'co-white', english: 'White', arabic: 'أبيض', transliteration: 'abyad', theme: 'colors', difficulty: 'beginner', icon: 'circle-outline', color: '#FFFFFF' },
  // Intermediate
  { id: 'co-orange', english: 'Orange', arabic: 'برتقالي', transliteration: 'burtuqali', theme: 'colors', difficulty: 'intermediate', icon: 'circle', color: '#FF8C00' },
  { id: 'co-purple', english: 'Purple', arabic: 'بنفسجي', transliteration: 'banafsaji', theme: 'colors', difficulty: 'intermediate', icon: 'circle', color: '#9C27B0' },
  { id: 'co-black', english: 'Black', arabic: 'أسود', transliteration: 'aswad', theme: 'colors', difficulty: 'intermediate', icon: 'circle', color: '#212121' },
  { id: 'co-brown', english: 'Brown', arabic: 'بني', transliteration: 'bunni', theme: 'colors', difficulty: 'intermediate', icon: 'circle', color: '#795548' },
  { id: 'co-pink', english: 'Pink', arabic: 'وردي', transliteration: 'wardi', theme: 'colors', difficulty: 'intermediate', icon: 'circle', color: '#E91E8C' },
  // Advanced
  { id: 'co-grey', english: 'Grey', arabic: 'رمادي', transliteration: 'ramadi', theme: 'colors', difficulty: 'advanced', icon: 'circle', color: '#9E9E9E' },
  { id: 'co-gold', english: 'Gold', arabic: 'ذهبي', transliteration: 'dhahabi', theme: 'colors', difficulty: 'advanced', icon: 'circle', color: '#FFC107' },
  { id: 'co-silver', english: 'Silver', arabic: 'فضي', transliteration: 'fiddi', theme: 'colors', difficulty: 'advanced', icon: 'circle', color: '#B0BEC5' },
  { id: 'co-turquoise', english: 'Turquoise', arabic: 'فيروزي', transliteration: 'fayrouzi', theme: 'colors', difficulty: 'advanced', icon: 'circle', color: '#00BCD4' },
  { id: 'co-maroon', english: 'Maroon', arabic: 'كستنائي', transliteration: 'kastana\'i', theme: 'colors', difficulty: 'advanced', icon: 'circle', color: '#800000' },

  // ─── NUMBERS ───────────────────────────────────────────────────────────────
  // Beginner
  { id: 'nu-one', english: 'One', arabic: 'واحد', transliteration: 'wahid', theme: 'numbers', difficulty: 'beginner', icon: 'numeric-1-box', color: '#FF6B35' },
  { id: 'nu-two', english: 'Two', arabic: 'اثنان', transliteration: 'ithnan', theme: 'numbers', difficulty: 'beginner', icon: 'numeric-2-box', color: '#FF4D9E' },
  { id: 'nu-three', english: 'Three', arabic: 'ثلاثة', transliteration: 'thalatha', theme: 'numbers', difficulty: 'beginner', icon: 'numeric-3-box', color: '#9B5DE5' },
  { id: 'nu-four', english: 'Four', arabic: 'أربعة', transliteration: "arba'a", theme: 'numbers', difficulty: 'beginner', icon: 'numeric-4-box', color: '#00BBF9' },
  { id: 'nu-five', english: 'Five', arabic: 'خمسة', transliteration: 'khamsa', theme: 'numbers', difficulty: 'beginner', icon: 'numeric-5-box', color: '#6BCB77' },
  // Intermediate
  { id: 'nu-six', english: 'Six', arabic: 'ستة', transliteration: 'sitta', theme: 'numbers', difficulty: 'intermediate', icon: 'numeric-6-box', color: '#FF8B42' },
  { id: 'nu-seven', english: 'Seven', arabic: 'سبعة', transliteration: "sab'a", theme: 'numbers', difficulty: 'intermediate', icon: 'numeric-7-box', color: '#F9C74F' },
  { id: 'nu-eight', english: 'Eight', arabic: 'ثمانية', transliteration: 'thamaniya', theme: 'numbers', difficulty: 'intermediate', icon: 'numeric-8-box', color: '#4ECDC4' },
  { id: 'nu-nine', english: 'Nine', arabic: 'تسعة', transliteration: "tis'a", theme: 'numbers', difficulty: 'intermediate', icon: 'numeric-9-box', color: '#E84848' },
  { id: 'nu-ten', english: 'Ten', arabic: 'عشرة', transliteration: "'ashara", theme: 'numbers', difficulty: 'intermediate', icon: 'numeric-10-box', color: '#9B5DE5' },
  // Advanced
  { id: 'nu-zero', english: 'Zero', arabic: 'صفر', transliteration: 'sifr', theme: 'numbers', difficulty: 'advanced', icon: 'numeric-0-box', color: '#6BCB77' },
  { id: 'nu-twenty', english: 'Twenty', arabic: 'عشرون', transliteration: "'ishrun", theme: 'numbers', difficulty: 'advanced', icon: 'numeric-2-box-multiple', color: '#FF4D9E' },
  { id: 'nu-hundred', english: 'Hundred', arabic: 'مئة', transliteration: "mi'a", theme: 'numbers', difficulty: 'advanced', icon: 'counter', color: '#00BBF9' },
  { id: 'nu-thousand', english: 'Thousand', arabic: 'ألف', transliteration: 'alf', theme: 'numbers', difficulty: 'advanced', icon: 'counter', color: '#FFD700' },
  { id: 'nu-million', english: 'Million', arabic: 'مليون', transliteration: 'milyun', theme: 'numbers', difficulty: 'advanced', icon: 'counter', color: '#FF6B35' },

  // ─── HOME ──────────────────────────────────────────────────────────────────
  // Beginner
  { id: 'ho-house', english: 'House', arabic: 'منزل', transliteration: 'manzil', theme: 'home', difficulty: 'beginner', icon: 'home', color: '#6BCB77' },
  { id: 'ho-door', english: 'Door', arabic: 'باب', transliteration: 'bab', theme: 'home', difficulty: 'beginner', icon: 'door', color: '#8B5E3C' },
  { id: 'ho-chair', english: 'Chair', arabic: 'كرسي', transliteration: 'kursi', theme: 'home', difficulty: 'beginner', icon: 'seat', color: '#FF8B42' },
  { id: 'ho-table', english: 'Table', arabic: 'طاولة', transliteration: 'tawila', theme: 'home', difficulty: 'beginner', icon: 'table-furniture', color: '#A1C181' },
  { id: 'ho-bed', english: 'Bed', arabic: 'سرير', transliteration: 'sarir', theme: 'home', difficulty: 'beginner', icon: 'bed', color: '#9B5DE5' },
  // Intermediate
  { id: 'ho-window', english: 'Window', arabic: 'نافذة', transliteration: 'nafidha', theme: 'home', difficulty: 'intermediate', icon: 'window-open-variant', color: '#00BBF9' },
  { id: 'ho-kitchen', english: 'Kitchen', arabic: 'مطبخ', transliteration: 'matbakh', theme: 'home', difficulty: 'intermediate', icon: 'stove', color: '#E84848' },
  { id: 'ho-bathroom', english: 'Bathroom', arabic: 'حمام', transliteration: 'hammam', theme: 'home', difficulty: 'intermediate', icon: 'shower', color: '#4ECDC4' },
  { id: 'ho-book', english: 'Book', arabic: 'كتاب', transliteration: 'kitab', theme: 'home', difficulty: 'intermediate', icon: 'book-open-variant', color: '#FF4D9E' },
  { id: 'ho-clock', english: 'Clock', arabic: 'ساعة', transliteration: "sa'a", theme: 'home', difficulty: 'intermediate', icon: 'clock', color: '#F9C74F' },
  // Advanced
  { id: 'ho-lamp', english: 'Lamp', arabic: 'مصباح', transliteration: 'misbah', theme: 'home', difficulty: 'advanced', icon: 'lamp', color: '#FFD700' },
  { id: 'ho-phone', english: 'Phone', arabic: 'هاتف', transliteration: 'hatif', theme: 'home', difficulty: 'advanced', icon: 'phone', color: '#6BCB77' },
  { id: 'ho-tv', english: 'Television', arabic: 'تلفاز', transliteration: 'tilfaz', theme: 'home', difficulty: 'advanced', icon: 'television', color: '#212121' },
  { id: 'ho-carpet', english: 'Carpet', arabic: 'سجادة', transliteration: 'sajjada', theme: 'home', difficulty: 'advanced', icon: 'rug', color: '#E84393' },
  { id: 'ho-mirror', english: 'Mirror', arabic: 'مرآة', transliteration: "mir'at", theme: 'home', difficulty: 'advanced', icon: 'mirror', color: '#B0BEC5' },

  // ─── BODY ──────────────────────────────────────────────────────────────────
  // Beginner
  { id: 'bo-eye', english: 'Eye', arabic: 'عين', transliteration: "'ayn", theme: 'body', difficulty: 'beginner', icon: 'eye', color: '#00BBF9' },
  { id: 'bo-nose', english: 'Nose', arabic: 'أنف', transliteration: 'anf', theme: 'body', difficulty: 'beginner', icon: 'nose', color: '#FF8B42' },
  { id: 'bo-hand', english: 'Hand', arabic: 'يد', transliteration: 'yad', theme: 'body', difficulty: 'beginner', icon: 'hand-back-right', color: '#FF6B6B' },
  { id: 'bo-foot', english: 'Foot', arabic: 'قدم', transliteration: 'qadam', theme: 'body', difficulty: 'beginner', icon: 'foot-print', color: '#8B5E3C' },
  { id: 'bo-head', english: 'Head', arabic: 'رأس', transliteration: "ra's", theme: 'body', difficulty: 'beginner', icon: 'head', color: '#F9C74F' },
  // Intermediate
  { id: 'bo-ear', english: 'Ear', arabic: 'أذن', transliteration: 'udhun', theme: 'body', difficulty: 'intermediate', icon: 'ear-hearing', color: '#FF4D9E' },
  { id: 'bo-mouth', english: 'Mouth', arabic: 'فم', transliteration: 'fam', theme: 'body', difficulty: 'intermediate', icon: 'tooth', color: '#FFFFFF' },
  { id: 'bo-heart', english: 'Heart', arabic: 'قلب', transliteration: 'qalb', theme: 'body', difficulty: 'intermediate', icon: 'heart', color: '#E84848' },
  { id: 'bo-hair', english: 'Hair', arabic: 'شعر', transliteration: "sha'r", theme: 'body', difficulty: 'intermediate', icon: 'head', color: '#5D4037' },
  { id: 'bo-finger', english: 'Finger', arabic: 'إصبع', transliteration: 'isba\'', theme: 'body', difficulty: 'intermediate', icon: 'fingerprint', color: '#9B5DE5' },
  // Advanced
  { id: 'bo-shoulder', english: 'Shoulder', arabic: 'كتف', transliteration: 'katif', theme: 'body', difficulty: 'advanced', icon: 'human-handsdown', color: '#6BCB77' },
  { id: 'bo-knee', english: 'Knee', arabic: 'ركبة', transliteration: 'rukba', theme: 'body', difficulty: 'advanced', icon: 'human', color: '#FF6B35' },
  { id: 'bo-back', english: 'Back', arabic: 'ظهر', transliteration: 'dhahr', theme: 'body', difficulty: 'advanced', icon: 'human-male', color: '#00BBF9' },
  { id: 'bo-cheek', english: 'Cheek', arabic: 'خد', transliteration: 'khadd', theme: 'body', difficulty: 'advanced', icon: 'emoticon', color: '#FF4D9E' },
  { id: 'bo-forehead', english: 'Forehead', arabic: 'جبهة', transliteration: 'jabha', theme: 'body', difficulty: 'advanced', icon: 'head-outline', color: '#F9C74F' },

  // ─── NATURE ────────────────────────────────────────────────────────────────
  // Beginner
  { id: 'na-sun', english: 'Sun', arabic: 'شمس', transliteration: 'shams', theme: 'nature', difficulty: 'beginner', icon: 'weather-sunny', color: '#FFD700' },
  { id: 'na-moon', english: 'Moon', arabic: 'قمر', transliteration: 'qamar', theme: 'nature', difficulty: 'beginner', icon: 'moon-waning-crescent', color: '#9B5DE5' },
  { id: 'na-star', english: 'Star', arabic: 'نجمة', transliteration: 'najma', theme: 'nature', difficulty: 'beginner', icon: 'star', color: '#FFD700' },
  { id: 'na-tree', english: 'Tree', arabic: 'شجرة', transliteration: 'shajara', theme: 'nature', difficulty: 'beginner', icon: 'tree', color: '#4CAF50' },
  { id: 'na-flower', english: 'Flower', arabic: 'زهرة', transliteration: 'zahra', theme: 'nature', difficulty: 'beginner', icon: 'flower', color: '#FF4D9E' },
  // Intermediate
  { id: 'na-cloud', english: 'Cloud', arabic: 'غيمة', transliteration: 'ghayma', theme: 'nature', difficulty: 'intermediate', icon: 'cloud', color: '#B0BEC5' },
  { id: 'na-rain', english: 'Rain', arabic: 'مطر', transliteration: 'matar', theme: 'nature', difficulty: 'intermediate', icon: 'weather-pouring', color: '#2196F3' },
  { id: 'na-mountain', english: 'Mountain', arabic: 'جبل', transliteration: 'jabal', theme: 'nature', difficulty: 'intermediate', icon: 'mountain', color: '#795548' },
  { id: 'na-sea', english: 'Sea', arabic: 'بحر', transliteration: 'bahr', theme: 'nature', difficulty: 'intermediate', icon: 'waves', color: '#00BBF9' },
  { id: 'na-river', english: 'River', arabic: 'نهر', transliteration: 'nahr', theme: 'nature', difficulty: 'intermediate', icon: 'water', color: '#4FC3F7' },
  // Advanced
  { id: 'na-fire', english: 'Fire', arabic: 'نار', transliteration: 'nar', theme: 'nature', difficulty: 'advanced', icon: 'fire', color: '#FF6B35' },
  { id: 'na-earth', english: 'Earth', arabic: 'أرض', transliteration: 'ard', theme: 'nature', difficulty: 'advanced', icon: 'earth', color: '#4CAF50' },
  { id: 'na-wind', english: 'Wind', arabic: 'ريح', transliteration: 'rih', theme: 'nature', difficulty: 'advanced', icon: 'weather-windy', color: '#B0BEC5' },
  { id: 'na-snow', english: 'Snow', arabic: 'ثلج', transliteration: 'thalj', theme: 'nature', difficulty: 'advanced', icon: 'snowflake', color: '#E3F2FD' },
  { id: 'na-desert', english: 'Desert', arabic: 'صحراء', transliteration: 'sahra', theme: 'nature', difficulty: 'advanced', icon: 'terrain', color: '#F9C74F' },

  // ─── CLOTHES ───────────────────────────────────────────────────────────────
  // Beginner
  { id: 'cl-shirt', english: 'Shirt', arabic: 'قميص', transliteration: 'qamis', theme: 'clothes', difficulty: 'beginner', icon: 'tshirt-crew', color: '#00BBF9' },
  { id: 'cl-shoe', english: 'Shoe', arabic: 'حذاء', transliteration: "hidha'", theme: 'clothes', difficulty: 'beginner', icon: 'shoe-formal', color: '#5D4037' },
  { id: 'cl-hat', english: 'Hat', arabic: 'قبعة', transliteration: "qubba'a", theme: 'clothes', difficulty: 'beginner', icon: 'hat-fedora', color: '#FF8B42' },
  { id: 'cl-pants', english: 'Pants', arabic: 'بنطلون', transliteration: 'bantalon', theme: 'clothes', difficulty: 'beginner', icon: 'hanger', color: '#3F51B5' },
  { id: 'cl-dress', english: 'Dress', arabic: 'فستان', transliteration: 'fustan', theme: 'clothes', difficulty: 'beginner', icon: 'tshirt-v', color: '#FF4D9E' },
  // Intermediate
  { id: 'cl-socks', english: 'Socks', arabic: 'جوارب', transliteration: 'jawarib', theme: 'clothes', difficulty: 'intermediate', icon: 'shoe-sneaker', color: '#6BCB77' },
  { id: 'cl-glasses', english: 'Glasses', arabic: 'نظارة', transliteration: 'nazzara', theme: 'clothes', difficulty: 'intermediate', icon: 'glasses', color: '#212121' },
  { id: 'cl-jacket', english: 'Jacket', arabic: 'جاكيت', transliteration: 'jakit', theme: 'clothes', difficulty: 'intermediate', icon: 'zipper', color: '#FF6B35' },
  { id: 'cl-bag', english: 'Bag', arabic: 'حقيبة', transliteration: 'haqiba', theme: 'clothes', difficulty: 'intermediate', icon: 'bag-personal', color: '#9B5DE5' },
  { id: 'cl-watch', english: 'Watch', arabic: 'ساعة', transliteration: "sa'a", theme: 'clothes', difficulty: 'intermediate', icon: 'watch', color: '#212121' },
  // Advanced
  { id: 'cl-scarf', english: 'Scarf', arabic: 'وشاح', transliteration: 'wishash', theme: 'clothes', difficulty: 'advanced', icon: 'scarf', color: '#E84393' },
  { id: 'cl-ring', english: 'Ring', arabic: 'خاتم', transliteration: 'khatim', theme: 'clothes', difficulty: 'advanced', icon: 'ring', color: '#FFD700' },
  { id: 'cl-necklace', english: 'Necklace', arabic: 'عقد', transliteration: "'iqd", theme: 'clothes', difficulty: 'advanced', icon: 'necklace', color: '#FFD700' },
  { id: 'cl-gloves', english: 'Gloves', arabic: 'قفازات', transliteration: 'quffazat', theme: 'clothes', difficulty: 'advanced', icon: 'ski', color: '#E84848' },
  { id: 'cl-boots', english: 'Boots', arabic: 'جزمة', transliteration: 'jazma', theme: 'clothes', difficulty: 'advanced', icon: 'shoe-heel', color: '#5D4037' },
];

export const WORDS: Word[] = RAW_WORDS.map(w => ({
  ...w,
  imagePath: `./assets/images/theme_${w.theme}.png`,
}));

export function getWordsByLevel(theme: string, difficulty: string): Word[] {
  return WORDS.filter(w => w.theme === theme && w.difficulty === difficulty);
}

export function getWordsByTheme(theme: string): Word[] {
  return WORDS.filter(w => w.theme === theme);
}

export function getRandomWrongAnswers(correctWord: Word, count: number): Word[] {
  const sameTheme = WORDS.filter(w => w.theme === correctWord.theme && w.id !== correctWord.id);
  const shuffled = sameTheme.sort(() => Math.random() - 0.5);
  if (shuffled.length >= count) return shuffled.slice(0, count);
  // Fill with other themes if not enough
  const others = WORDS.filter(w => w.id !== correctWord.id && !sameTheme.find(s => s.id === w.id));
  return [...shuffled, ...others.sort(() => Math.random() - 0.5)].slice(0, count);
}
