import { Word } from '@/types';

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=400&h=400&fit=crop&auto=format`;

const RAW_WORDS: Omit<Word, 'imagePath'>[] = [
  // ─── ANIMALS ───────────────────────────────────────────────────────────────
  { id: 'an-cat',       english: 'Cat',       arabic: 'قِطَّة',      transliteration: 'qitta',   theme: 'animals', difficulty: 'beginner',     icon: 'cat',            color: '#FF8B42', photoUrl: U('1514888286974-6c03e2ca1dba') },
  { id: 'an-dog',       english: 'Dog',       arabic: 'كَلْب',       transliteration: 'kalb',    theme: 'animals', difficulty: 'beginner',     icon: 'dog',            color: '#FF6B35', photoUrl: U('1587300003388-59208cc962cb') },
  { id: 'an-fish',      english: 'Fish',      arabic: 'سَمَكَة',     transliteration: 'samaka',  theme: 'animals', difficulty: 'beginner',     icon: 'fish',           color: '#00BBF9', photoUrl: U('1522069169874-c58ec4b76be5') },
  { id: 'an-bird',      english: 'Bird',      arabic: 'طَائِر',      transliteration: "ta'ir",   theme: 'animals', difficulty: 'beginner',     icon: 'bird',           color: '#6BCB77', photoUrl: U('1444464666168-49d633b86797') },
  { id: 'an-rabbit',    english: 'Rabbit',    arabic: 'أَرْنَب',     transliteration: 'arnab',   theme: 'animals', difficulty: 'beginner',     icon: 'rabbit',         color: '#F9C74F', photoUrl: U('1425082661705-1834bfd09dca') },
  { id: 'an-elephant',  english: 'Elephant',  arabic: 'فِيل',        transliteration: 'fiil',    theme: 'animals', difficulty: 'intermediate', icon: 'elephant',       color: '#9B9B9B', photoUrl: U('1557050543-4d5f4e07ef46') },
  { id: 'an-lion',      english: 'Lion',      arabic: 'أَسَد',       transliteration: 'asad',    theme: 'animals', difficulty: 'intermediate', icon: 'paw',            color: '#F9C74F', photoUrl: U('1546182990-dffeafbe841d') },
  { id: 'an-horse',     english: 'Horse',     arabic: 'حِصَان',      transliteration: 'hisaan',  theme: 'animals', difficulty: 'intermediate', icon: 'horse',          color: '#8B5E3C', photoUrl: U('1553284965-83fd3e82fa5a') },
  { id: 'an-sheep',     english: 'Sheep',     arabic: 'خَرُوف',      transliteration: 'kharuf',  theme: 'animals', difficulty: 'intermediate', icon: 'sheep',          color: '#F0F0F0', photoUrl: U('1484557052118-f32bd25b45b5') },
  { id: 'an-butterfly', english: 'Butterfly', arabic: 'فَرَاشَة',    transliteration: 'farasha', theme: 'animals', difficulty: 'intermediate', icon: 'butterfly',      color: '#FF4D9E', photoUrl: U('1473175494278-d83ed8459089') },
  { id: 'an-bee',       english: 'Bee',       arabic: 'نَحْلَة',     transliteration: 'nahla',   theme: 'animals', difficulty: 'advanced',     icon: 'bee',            color: '#FFD700', photoUrl: U('1568526381923-caf3fd520382') },
  { id: 'an-turtle',    english: 'Turtle',    arabic: 'سُلْحَفَاة',  transliteration: 'sulhafa', theme: 'animals', difficulty: 'advanced',     icon: 'turtle',         color: '#4CAF50', photoUrl: U('1437622368342-7a3d73a34c8f') },
  { id: 'an-monkey',    english: 'Monkey',    arabic: 'قِرْد',       transliteration: 'qird',    theme: 'animals', difficulty: 'advanced',     icon: 'monkey',         color: '#8B5E3C', photoUrl: U('1540573133985-87b6da6d54a9') },
  { id: 'an-frog',      english: 'Frog',      arabic: 'ضُفْدَع',     transliteration: "dafda'",  theme: 'animals', difficulty: 'advanced',     icon: 'frog',           color: '#6BCB77', photoUrl: U('1544568100-847a948585b9') },
  { id: 'an-camel',     english: 'Camel',     arabic: 'جَمَل',       transliteration: 'jamal',   theme: 'animals', difficulty: 'advanced',     icon: 'camel',          color: '#D4A847', photoUrl: U('1500468756762-a401b6f17b46') },

  // ─── FOOD ──────────────────────────────────────────────────────────────────
  { id: 'fo-apple',      english: 'Apple',      arabic: 'تُفَّاحَة',  transliteration: 'tuffaha', theme: 'food', difficulty: 'beginner',     icon: 'food-apple',     color: '#E84848', photoUrl: U('1560806887-1e4cd0b6cbd6') },
  { id: 'fo-bread',      english: 'Bread',      arabic: 'خُبْز',      transliteration: 'khubz',   theme: 'food', difficulty: 'beginner',     icon: 'bread-slice',    color: '#F9C74F', photoUrl: U('1549931319-a545dcf3bc7c') },
  { id: 'fo-cake',       english: 'Cake',       arabic: 'كَيْكَة',    transliteration: 'kayka',   theme: 'food', difficulty: 'beginner',     icon: 'cake-variant',   color: '#FF4D9E', photoUrl: U('1621303837174-89787a7d4729') },
  { id: 'fo-egg',        english: 'Egg',        arabic: 'بَيْضَة',    transliteration: 'bayda',   theme: 'food', difficulty: 'beginner',     icon: 'egg',            color: '#FFF9C4', photoUrl: U('1582722872445-44dc5f7e3c8f') },
  { id: 'fo-milk',       english: 'Milk',       arabic: 'حَلِيب',     transliteration: 'haliib',  theme: 'food', difficulty: 'beginner',     icon: 'cup',            color: '#E3F2FD', photoUrl: U('1563636619-e9143da7973b') },
  { id: 'fo-cheese',     english: 'Cheese',     arabic: 'جُبْنَة',    transliteration: 'jubna',   theme: 'food', difficulty: 'intermediate', icon: 'cheese',         color: '#FFD700', photoUrl: U('1486297678162-eb2a19b0a32d') },
  { id: 'fo-orange',     english: 'Orange',     arabic: 'بُرْتُقَال', transliteration: 'burtuqal',theme: 'food', difficulty: 'intermediate', icon: 'fruit-citrus',   color: '#FF8C00', photoUrl: U('1611080626919-7cf5a9dbab12') },
  { id: 'fo-banana',     english: 'Banana',     arabic: 'مَوْزَة',    transliteration: 'mawza',   theme: 'food', difficulty: 'intermediate', icon: 'fruit-pineapple',color: '#FFE57F', photoUrl: U('1571771894821-ce9b6c11b08e') },
  { id: 'fo-rice',       english: 'Rice',       arabic: 'أُرُزّ',     transliteration: 'uruzz',   theme: 'food', difficulty: 'intermediate', icon: 'rice',           color: '#F5F5F5', photoUrl: U('1536304993881-ff86e0c9ef1b') },
  { id: 'fo-tea',        english: 'Tea',        arabic: 'شَاي',       transliteration: 'shaay',   theme: 'food', difficulty: 'intermediate', icon: 'tea',            color: '#8D6E63', photoUrl: U('1556679343-c7306c1976bc') },
  { id: 'fo-coffee',     english: 'Coffee',     arabic: 'قَهْوَة',    transliteration: 'qahwa',   theme: 'food', difficulty: 'advanced',     icon: 'coffee',         color: '#5D4037', photoUrl: U('1514432324607-a09d9b4aefdd') },
  { id: 'fo-chicken',    english: 'Chicken',    arabic: 'دَجَاجَة',   transliteration: 'dajaaja', theme: 'food', difficulty: 'advanced',     icon: 'food-drumstick', color: '#FF8B42', photoUrl: U('1598103442097-8b74394b95c3') },
  { id: 'fo-watermelon', english: 'Watermelon', arabic: 'بَطِّيخ',    transliteration: 'battiikh',theme: 'food', difficulty: 'advanced',     icon: 'food-variant',   color: '#E84848', photoUrl: U('1589010588553-46e8e7c21788') },
  { id: 'fo-pizza',      english: 'Pizza',      arabic: 'بِيتْزَا',   transliteration: 'biitza',  theme: 'food', difficulty: 'advanced',     icon: 'pizza',          color: '#FF6B35', photoUrl: U('1565299624946-b28f40a0ae38') },
  { id: 'fo-grapes',     english: 'Grapes',     arabic: 'عِنَب',      transliteration: "'inab",   theme: 'food', difficulty: 'advanced',     icon: 'fruit-grapes',   color: '#9B5DE5', photoUrl: U('1537640538966-79f369143f8f') },

  // ─── COLORS ────────────────────────────────────────────────────────────────
  { id: 'co-red',       english: 'Red',       arabic: 'أَحْمَر',      transliteration: 'ahmar',      theme: 'colors', difficulty: 'beginner',     icon: 'circle',        color: '#E84848' },
  { id: 'co-blue',      english: 'Blue',      arabic: 'أَزْرَق',      transliteration: 'azraq',      theme: 'colors', difficulty: 'beginner',     icon: 'circle',        color: '#2196F3' },
  { id: 'co-green',     english: 'Green',     arabic: 'أَخْضَر',      transliteration: 'akhdar',     theme: 'colors', difficulty: 'beginner',     icon: 'circle',        color: '#4CAF50' },
  { id: 'co-yellow',    english: 'Yellow',    arabic: 'أَصْفَر',      transliteration: 'asfar',      theme: 'colors', difficulty: 'beginner',     icon: 'circle',        color: '#FFD700' },
  { id: 'co-white',     english: 'White',     arabic: 'أَبْيَض',      transliteration: 'abyad',      theme: 'colors', difficulty: 'beginner',     icon: 'circle-outline',color: '#FFFFFF' },
  { id: 'co-orange',    english: 'Orange',    arabic: 'بُرْتُقَالِيّ', transliteration: 'burtuqali',  theme: 'colors', difficulty: 'intermediate', icon: 'circle',        color: '#FF8C00' },
  { id: 'co-purple',    english: 'Purple',    arabic: 'بَنَفْسَجِيّ', transliteration: 'banafsaji',  theme: 'colors', difficulty: 'intermediate', icon: 'circle',        color: '#9C27B0' },
  { id: 'co-black',     english: 'Black',     arabic: 'أَسْوَد',      transliteration: 'aswad',      theme: 'colors', difficulty: 'intermediate', icon: 'circle',        color: '#212121' },
  { id: 'co-brown',     english: 'Brown',     arabic: 'بُنِّيّ',      transliteration: 'bunniy',     theme: 'colors', difficulty: 'intermediate', icon: 'circle',        color: '#795548' },
  { id: 'co-pink',      english: 'Pink',      arabic: 'وَرْدِيّ',     transliteration: 'wardiy',     theme: 'colors', difficulty: 'intermediate', icon: 'circle',        color: '#E91E8C' },
  { id: 'co-grey',      english: 'Grey',      arabic: 'رَمَادِيّ',    transliteration: 'ramadiy',    theme: 'colors', difficulty: 'advanced',     icon: 'circle',        color: '#9E9E9E' },
  { id: 'co-gold',      english: 'Gold',      arabic: 'ذَهَبِيّ',     transliteration: 'dhahabiy',   theme: 'colors', difficulty: 'advanced',     icon: 'circle',        color: '#FFC107' },
  { id: 'co-silver',    english: 'Silver',    arabic: 'فِضِّيّ',      transliteration: 'fiddiy',     theme: 'colors', difficulty: 'advanced',     icon: 'circle',        color: '#B0BEC5' },
  { id: 'co-turquoise', english: 'Turquoise', arabic: 'فَيْرُوزِيّ',  transliteration: 'fayruziy',   theme: 'colors', difficulty: 'advanced',     icon: 'circle',        color: '#00BCD4' },
  { id: 'co-maroon',    english: 'Maroon',    arabic: 'كَسْتَنَائِيّ',transliteration: "kastana'iy", theme: 'colors', difficulty: 'advanced',     icon: 'circle',        color: '#800000' },

  // ─── NUMBERS ───────────────────────────────────────────────────────────────
  { id: 'nu-one',     english: 'One',     arabic: 'وَاحِد',   transliteration: 'waahid',   theme: 'numbers', difficulty: 'beginner',     icon: 'numeric-1-box',          color: '#FF6B35' },
  { id: 'nu-two',     english: 'Two',     arabic: 'اثْنَان',  transliteration: 'ithnaan',  theme: 'numbers', difficulty: 'beginner',     icon: 'numeric-2-box',          color: '#FF4D9E' },
  { id: 'nu-three',   english: 'Three',   arabic: 'ثَلَاثَة', transliteration: 'thalaatha',theme: 'numbers', difficulty: 'beginner',     icon: 'numeric-3-box',          color: '#9B5DE5' },
  { id: 'nu-four',    english: 'Four',    arabic: 'أَرْبَعَة',transliteration: "arba'a",   theme: 'numbers', difficulty: 'beginner',     icon: 'numeric-4-box',          color: '#00BBF9' },
  { id: 'nu-five',    english: 'Five',    arabic: 'خَمْسَة',  transliteration: 'khamsa',   theme: 'numbers', difficulty: 'beginner',     icon: 'numeric-5-box',          color: '#6BCB77' },
  { id: 'nu-six',     english: 'Six',     arabic: 'سِتَّة',   transliteration: 'sitta',    theme: 'numbers', difficulty: 'intermediate', icon: 'numeric-6-box',          color: '#FF8B42' },
  { id: 'nu-seven',   english: 'Seven',   arabic: 'سَبْعَة',  transliteration: "sab'a",    theme: 'numbers', difficulty: 'intermediate', icon: 'numeric-7-box',          color: '#F9C74F' },
  { id: 'nu-eight',   english: 'Eight',   arabic: 'ثَمَانِيَة',transliteration: 'thamaniya',theme: 'numbers', difficulty: 'intermediate', icon: 'numeric-8-box',          color: '#4ECDC4' },
  { id: 'nu-nine',    english: 'Nine',    arabic: 'تِسْعَة',  transliteration: "tis'a",    theme: 'numbers', difficulty: 'intermediate', icon: 'numeric-9-box',          color: '#E84848' },
  { id: 'nu-ten',     english: 'Ten',     arabic: 'عَشَرَة',  transliteration: "'ashara",  theme: 'numbers', difficulty: 'intermediate', icon: 'numeric-10-box',         color: '#9B5DE5' },
  { id: 'nu-zero',    english: 'Zero',    arabic: 'صِفْر',    transliteration: 'sifr',     theme: 'numbers', difficulty: 'advanced',     icon: 'numeric-0-box',          color: '#6BCB77' },
  { id: 'nu-twenty',  english: 'Twenty',  arabic: 'عِشْرُون', transliteration: "'ishruun",  theme: 'numbers', difficulty: 'advanced',     icon: 'numeric-2-box-multiple', color: '#FF4D9E' },
  { id: 'nu-hundred', english: 'Hundred', arabic: 'مِئَة',    transliteration: "mi'a",     theme: 'numbers', difficulty: 'advanced',     icon: 'counter',                color: '#00BBF9' },
  { id: 'nu-thousand',english: 'Thousand',arabic: 'أَلْف',    transliteration: 'alf',      theme: 'numbers', difficulty: 'advanced',     icon: 'counter',                color: '#FFD700' },
  { id: 'nu-million', english: 'Million', arabic: 'مِلْيُون', transliteration: 'milyuun',  theme: 'numbers', difficulty: 'advanced',     icon: 'counter',                color: '#FF6B35' },

  // ─── HOME ──────────────────────────────────────────────────────────────────
  { id: 'ho-house',    english: 'House',      arabic: 'مَنْزِل',  transliteration: 'manzil',  theme: 'home', difficulty: 'beginner',     icon: 'home',               color: '#6BCB77', photoUrl: U('1568605114967-8130f3a36994') },
  { id: 'ho-door',     english: 'Door',       arabic: 'بَاب',     transliteration: 'baab',    theme: 'home', difficulty: 'beginner',     icon: 'door',               color: '#8B5E3C', photoUrl: U('1558618666-fcd25c85cd64') },
  { id: 'ho-chair',    english: 'Chair',      arabic: 'كُرْسِيّ', transliteration: 'kursiy',  theme: 'home', difficulty: 'beginner',     icon: 'seat',               color: '#FF8B42', photoUrl: U('1555041469-149851f5f781') },
  { id: 'ho-table',    english: 'Table',      arabic: 'طَاوِلَة', transliteration: 'tawila',  theme: 'home', difficulty: 'beginner',     icon: 'table-furniture',    color: '#A1C181', photoUrl: U('1533090161767-e6ffed986c88') },
  { id: 'ho-bed',      english: 'Bed',        arabic: 'سَرِير',   transliteration: 'sariir',  theme: 'home', difficulty: 'beginner',     icon: 'bed',                color: '#9B5DE5', photoUrl: U('1556909172-54557c7e4fb7') },
  { id: 'ho-window',   english: 'Window',     arabic: 'نَافِذَة', transliteration: 'naafidha',theme: 'home', difficulty: 'intermediate', icon: 'window-open-variant',color: '#00BBF9', photoUrl: U('1560184897-4e4e90f6eb83') },
  { id: 'ho-kitchen',  english: 'Kitchen',    arabic: 'مَطْبَخ',  transliteration: 'matbakh', theme: 'home', difficulty: 'intermediate', icon: 'stove',              color: '#E84848', photoUrl: U('1556910103-1c02745ad422') },
  { id: 'ho-bathroom', english: 'Bathroom',   arabic: 'حَمَّام',  transliteration: 'hammaam', theme: 'home', difficulty: 'intermediate', icon: 'shower',             color: '#4ECDC4', photoUrl: U('1552321554-5fece8eef0bc') },
  { id: 'ho-book',     english: 'Book',       arabic: 'كِتَاب',   transliteration: 'kitaab',  theme: 'home', difficulty: 'intermediate', icon: 'book-open-variant',  color: '#FF4D9E', photoUrl: U('1516979187895-176e14045c85') },
  { id: 'ho-clock',    english: 'Clock',      arabic: 'سَاعَة',   transliteration: "saa'a",   theme: 'home', difficulty: 'intermediate', icon: 'clock',              color: '#F9C74F', photoUrl: U('1563861826100-9cb868fdbe1c') },
  { id: 'ho-lamp',     english: 'Lamp',       arabic: 'مِصْبَاح', transliteration: 'misbaah', theme: 'home', difficulty: 'advanced',     icon: 'lamp',               color: '#FFD700', photoUrl: U('1513506003901-1e6a35d44a9f') },
  { id: 'ho-phone',    english: 'Phone',      arabic: 'هَاتِف',   transliteration: 'haatif',  theme: 'home', difficulty: 'advanced',     icon: 'phone',              color: '#6BCB77', photoUrl: U('1598327105666-5b89351aff97') },
  { id: 'ho-tv',       english: 'Television', arabic: 'تِلْفَاز', transliteration: 'tilfaaz', theme: 'home', difficulty: 'advanced',     icon: 'television',         color: '#212121', photoUrl: U('1593305841991-05c297ba4575') },
  { id: 'ho-carpet',   english: 'Carpet',     arabic: 'سَجَّادَة',transliteration: 'sajjaada',theme: 'home', difficulty: 'advanced',     icon: 'rug',                color: '#E84393', photoUrl: U('1512699297745-50f9614f7a55') },
  { id: 'ho-mirror',   english: 'Mirror',     arabic: 'مِرْآة',   transliteration: "mir'aah", theme: 'home', difficulty: 'advanced',     icon: 'mirror',             color: '#B0BEC5', photoUrl: U('1507003211169-0a1dd7228f2d') },

  // ─── BODY ──────────────────────────────────────────────────────────────────
  { id: 'bo-eye',      english: 'Eye',      arabic: 'عَيْن',    transliteration: "'ayn",    theme: 'body', difficulty: 'beginner',     icon: 'eye',             color: '#00BBF9', photoUrl: U('1561037280-173a23d28f87') },
  { id: 'bo-nose',     english: 'Nose',     arabic: 'أَنْف',    transliteration: 'anf',     theme: 'body', difficulty: 'beginner',     icon: 'nose',            color: '#FF8B42', photoUrl: U('1498558250498-bb360ec9fcf3') },
  { id: 'bo-hand',     english: 'Hand',     arabic: 'يَد',      transliteration: 'yad',     theme: 'body', difficulty: 'beginner',     icon: 'hand-back-right', color: '#FF6B6B', photoUrl: U('1567225557620-f8b4e4d3cfa3') },
  { id: 'bo-foot',     english: 'Foot',     arabic: 'قَدَم',    transliteration: 'qadam',   theme: 'body', difficulty: 'beginner',     icon: 'foot-print',      color: '#8B5E3C', photoUrl: U('1473263780248-eedf8f7e9af8') },
  { id: 'bo-head',     english: 'Head',     arabic: 'رَأْس',    transliteration: "ra's",    theme: 'body', difficulty: 'beginner',     icon: 'head',            color: '#F9C74F', photoUrl: U('1500648767791-00dcc994a43e') },
  { id: 'bo-ear',      english: 'Ear',      arabic: 'أُذُن',    transliteration: 'udhun',   theme: 'body', difficulty: 'intermediate', icon: 'ear-hearing',     color: '#FF4D9E', photoUrl: U('1516876467961-f13cc5c7a28f') },
  { id: 'bo-mouth',    english: 'Mouth',    arabic: 'فَم',      transliteration: 'fam',     theme: 'body', difficulty: 'intermediate', icon: 'tooth',           color: '#FFFFFF', photoUrl: U('1531746020798-e6953c6e8e04') },
  { id: 'bo-heart',    english: 'Heart',    arabic: 'قَلْب',    transliteration: 'qalb',    theme: 'body', difficulty: 'intermediate', icon: 'heart',           color: '#E84848', photoUrl: U('1628771065518-0d82f1938462') },
  { id: 'bo-hair',     english: 'Hair',     arabic: 'شَعْر',    transliteration: "sha'r",   theme: 'body', difficulty: 'intermediate', icon: 'head',            color: '#5D4037', photoUrl: U('1562322140-8baeececf3df') },
  { id: 'bo-finger',   english: 'Finger',   arabic: 'إِصْبَع',  transliteration: 'isba\'',  theme: 'body', difficulty: 'intermediate', icon: 'fingerprint',     color: '#9B5DE5', photoUrl: U('1567225557620-f8b4e4d3cfa3') },
  { id: 'bo-shoulder', english: 'Shoulder', arabic: 'كَتِف',    transliteration: 'katif',   theme: 'body', difficulty: 'advanced',     icon: 'human-handsdown', color: '#6BCB77', photoUrl: U('1571019613454-1cb2f99b2d8b') },
  { id: 'bo-knee',     english: 'Knee',     arabic: 'رُكْبَة',  transliteration: 'rukba',   theme: 'body', difficulty: 'advanced',     icon: 'human',           color: '#FF6B35', photoUrl: U('1571019613454-1cb2f99b2d8b') },
  { id: 'bo-back',     english: 'Back',     arabic: 'ظَهْر',    transliteration: 'dhahr',   theme: 'body', difficulty: 'advanced',     icon: 'human-male',      color: '#00BBF9', photoUrl: U('1571019613454-1cb2f99b2d8b') },
  { id: 'bo-cheek',    english: 'Cheek',    arabic: 'خَدّ',     transliteration: 'khadd',   theme: 'body', difficulty: 'advanced',     icon: 'emoticon',        color: '#FF4D9E', photoUrl: U('1531746020798-e6953c6e8e04') },
  { id: 'bo-forehead', english: 'Forehead', arabic: 'جَبْهَة',  transliteration: 'jabha',   theme: 'body', difficulty: 'advanced',     icon: 'head-outline',    color: '#F9C74F', photoUrl: U('1500648767791-00dcc994a43e') },

  // ─── NATURE ────────────────────────────────────────────────────────────────
  { id: 'na-sun',      english: 'Sun',      arabic: 'شَمْس',    transliteration: 'shams',   theme: 'nature', difficulty: 'beginner',     icon: 'weather-sunny',   color: '#FFD700', photoUrl: U('1504701954957-2010ec3bcec1') },
  { id: 'na-moon',     english: 'Moon',     arabic: 'قَمَر',    transliteration: 'qamar',   theme: 'nature', difficulty: 'beginner',     icon: 'moon-waning-crescent', color: '#9B5DE5', photoUrl: U('1444703686981-a3abbc4d4fe3') },
  { id: 'na-star',     english: 'Star',     arabic: 'نَجْمَة',  transliteration: 'najma',   theme: 'nature', difficulty: 'beginner',     icon: 'star',            color: '#FFD700', photoUrl: U('1419242902214-272b3f1d0f8f') },
  { id: 'na-tree',     english: 'Tree',     arabic: 'شَجَرَة',  transliteration: 'shajara', theme: 'nature', difficulty: 'beginner',     icon: 'tree',            color: '#4CAF50', photoUrl: U('1441974231531-c6227db76b6e') },
  { id: 'na-flower',   english: 'Flower',   arabic: 'زَهْرَة',  transliteration: 'zahra',   theme: 'nature', difficulty: 'beginner',     icon: 'flower',          color: '#FF4D9E', photoUrl: U('1490750967868-88df5691b2eb') },
  { id: 'na-cloud',    english: 'Cloud',    arabic: 'غَيْمَة',  transliteration: 'ghayma',  theme: 'nature', difficulty: 'intermediate', icon: 'cloud',           color: '#B0BEC5', photoUrl: U('1500534314209-a25ddb2bd429') },
  { id: 'na-rain',     english: 'Rain',     arabic: 'مَطَر',    transliteration: 'matar',   theme: 'nature', difficulty: 'intermediate', icon: 'weather-pouring', color: '#2196F3', photoUrl: U('1501999635878-71cb5379c2d8') },
  { id: 'na-mountain', english: 'Mountain', arabic: 'جَبَل',    transliteration: 'jabal',   theme: 'nature', difficulty: 'intermediate', icon: 'mountain',        color: '#795548', photoUrl: U('1464822759023-fed622ff2c3b') },
  { id: 'na-sea',      english: 'Sea',      arabic: 'بَحْر',    transliteration: 'bahr',    theme: 'nature', difficulty: 'intermediate', icon: 'waves',           color: '#00BBF9', photoUrl: U('1505118380757-91f5f5632de0') },
  { id: 'na-river',    english: 'River',    arabic: 'نَهْر',    transliteration: 'nahr',    theme: 'nature', difficulty: 'intermediate', icon: 'water',           color: '#4FC3F7', photoUrl: U('1504194104404-433180773017') },
  { id: 'na-fire',     english: 'Fire',     arabic: 'نَار',     transliteration: 'naar',    theme: 'nature', difficulty: 'advanced',     icon: 'fire',            color: '#FF6B35', photoUrl: U('1516362248-18f56ded576d') },
  { id: 'na-earth',    english: 'Earth',    arabic: 'أَرْض',    transliteration: 'ard',     theme: 'nature', difficulty: 'advanced',     icon: 'earth',           color: '#4CAF50', photoUrl: U('1446329360995-b4642a139973') },
  { id: 'na-wind',     english: 'Wind',     arabic: 'رِيح',     transliteration: 'riyh',    theme: 'nature', difficulty: 'advanced',     icon: 'weather-windy',   color: '#B0BEC5', photoUrl: U('1500534314209-a25ddb2bd429') },
  { id: 'na-snow',     english: 'Snow',     arabic: 'ثَلْج',    transliteration: 'thalj',   theme: 'nature', difficulty: 'advanced',     icon: 'snowflake',       color: '#E3F2FD', photoUrl: U('1491002052546-bf38f186af56') },
  { id: 'na-desert',   english: 'Desert',   arabic: 'صَحْرَاء', transliteration: 'sahraa',  theme: 'nature', difficulty: 'advanced',     icon: 'terrain',         color: '#F9C74F', photoUrl: U('1509316785289-025f5b846b35') },

  // ─── CLOTHES ───────────────────────────────────────────────────────────────
  { id: 'cl-shirt',    english: 'Shirt',    arabic: 'قَمِيص',   transliteration: 'qamiis',  theme: 'clothes', difficulty: 'beginner',     icon: 'tshirt-crew',   color: '#00BBF9', photoUrl: U('1521572163474-6864f9cf17ab') },
  { id: 'cl-shoe',     english: 'Shoe',     arabic: 'حِذَاء',   transliteration: "hidhaa'", theme: 'clothes', difficulty: 'beginner',     icon: 'shoe-formal',   color: '#5D4037', photoUrl: U('1542291026-7eec264c27ff') },
  { id: 'cl-hat',      english: 'Hat',      arabic: 'قُبَّعَة', transliteration: "qubba'a", theme: 'clothes', difficulty: 'beginner',     icon: 'hat-fedora',    color: '#FF8B42', photoUrl: U('1521369909029-2afed882baaa') },
  { id: 'cl-pants',    english: 'Pants',    arabic: 'بَنْطَلُون',transliteration: 'bantalon',theme: 'clothes', difficulty: 'beginner',     icon: 'hanger',        color: '#3F51B5', photoUrl: U('1542219550-37153d387dc7') },
  { id: 'cl-dress',    english: 'Dress',    arabic: 'فُسْتَان', transliteration: 'fustan',  theme: 'clothes', difficulty: 'beginner',     icon: 'tshirt-v',      color: '#FF4D9E', photoUrl: U('1515886657613-9f3515b0c78f') },
  { id: 'cl-socks',    english: 'Socks',    arabic: 'جَوَارِب', transliteration: 'jawarib', theme: 'clothes', difficulty: 'intermediate', icon: 'shoe-sneaker',  color: '#6BCB77', photoUrl: U('1586350977771-b3b0abd50c82') },
  { id: 'cl-glasses',  english: 'Glasses',  arabic: 'نَظَّارَة',transliteration: 'nazzaara',theme: 'clothes', difficulty: 'intermediate', icon: 'glasses',       color: '#212121', photoUrl: U('1574258495973-c1f6906a8b5b') },
  { id: 'cl-jacket',   english: 'Jacket',   arabic: 'جَاكِيت', transliteration: 'jaakit',  theme: 'clothes', difficulty: 'intermediate', icon: 'zipper',        color: '#FF6B35', photoUrl: U('1551628935-cd5433f0e76b') },
  { id: 'cl-bag',      english: 'Bag',      arabic: 'حَقِيبَة', transliteration: 'haqiiba', theme: 'clothes', difficulty: 'intermediate', icon: 'bag-personal',  color: '#9B5DE5', photoUrl: U('1553062407-98eeb64c6a62') },
  { id: 'cl-watch',    english: 'Watch',    arabic: 'سَاعَة',   transliteration: "saa'a",   theme: 'clothes', difficulty: 'intermediate', icon: 'watch',         color: '#212121', photoUrl: U('1523275335684-37898b6baf30') },
  { id: 'cl-scarf',    english: 'Scarf',    arabic: 'وِشَاح',   transliteration: 'wishaah', theme: 'clothes', difficulty: 'advanced',     icon: 'scarf',         color: '#E84393', photoUrl: U('1543163521-1bf539c55dd2') },
  { id: 'cl-ring',     english: 'Ring',     arabic: 'خَاتَم',   transliteration: 'khaatam', theme: 'clothes', difficulty: 'advanced',     icon: 'ring',          color: '#FFD700', photoUrl: U('1605100804763-247f67b3557e') },
  { id: 'cl-necklace', english: 'Necklace', arabic: 'عِقْد',    transliteration: "'iqd",    theme: 'clothes', difficulty: 'advanced',     icon: 'necklace',      color: '#FFD700', photoUrl: U('1515777755136-e3ff977ec1a3') },
  { id: 'cl-gloves',   english: 'Gloves',   arabic: 'قُفَّازَات',transliteration: 'quffazat',theme: 'clothes', difficulty: 'advanced',     icon: 'ski',           color: '#E84848', photoUrl: U('1561693532-bec4cba4e24e') },
  { id: 'cl-boots',    english: 'Boots',    arabic: 'جَزْمَة',  transliteration: 'jazma',   theme: 'clothes', difficulty: 'advanced',     icon: 'shoe-heel',     color: '#5D4037', photoUrl: U('1542291026-7eec264c27ff') },
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
  const others = WORDS.filter(w => w.id !== correctWord.id && !sameTheme.find(s => s.id === w.id));
  return [...shuffled, ...others.sort(() => Math.random() - 0.5)].slice(0, count);
}
