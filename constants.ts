
import { Behavior } from './types';

export const POKEMON_COUNT = 500;
export const POKEMON_SPRITE_URL = (id: number) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export const POSITIVE_BEHAVIORS: Behavior[] = [
  { label: '積極參與', labelEn: 'good participation', points: 1 },
  { label: '專心上課', labelEn: 'well focused', points: 1 },
  { label: '安靜閱讀', labelEn: 'quiet reading', points: 1 },
  { label: '安靜吃飯', labelEn: 'quiet eating', points: 1 },
  { label: '配合做課間操', labelEn: 'participating in exercises', points: 1 },
  { label: '尊重容老師！', labelEn: 'respect miss iong!', points: 3 },
  { label: '你簡直太棒了🥳👍！', labelEn: 'you are simply amazing 🥳👍!', points: 10 },
];

export const NEGATIVE_BEHAVIORS: Behavior[] = [
  { label: '態度欠佳', labelEn: 'bad attitude', points: -1 },
  { label: '過於吵鬧', labelEn: 'noisy', points: -1 },
  { label: '離開座位', labelEn: 'leaving seat', points: -1 },
  { label: '不專心', labelEn: 'not paying attention', points: -1 },
  { label: '課上聊天', labelEn: 'chatting in class', points: -1 },
  { label: '對容老師無禮', labelEn: 'disrespectful to miss iong', points: -3 },
  { label: '你太過分/離譜了😡！', labelEn: 'you have gone too far 😡!', points: -10 },
];

const createClass = (name: string, studentNames: string[]): any => ({
  id: name.replace(/\s/g, '_'),
  name,
  students: studentNames.map((n, i) => ({
    id: `${name}_${i + 1}`,
    name: n,
    studentNumber: i + 1,
    pokemonId: Math.floor(Math.random() * POKEMON_COUNT) + 1,
    totalScore: 0,
    posCount: 0,
    negCount: 0
  }))
});

export const INITIAL_CLASSES = [
  createClass('四乙普通話', ['陳沁儀', '陳信豪', '周詩蕎', '鄭瑩瑩', '鄭泓昊', '蔣沁妍', '甘子賢', '關子謙', '謝欣晏', '黃楚堯', '黃翰皓', '容毓俊', '李可欣', '陸皆橋', '馬超芸', '麥嘉俐', '牟智杰', '潘思涵', '蕭珈睿', '黃一進', '王美琳', '趙梓琳', '趙慕辰']),
  createClass('四乙 英文', ['陳沁儀', '陳信豪', '周詩蕎', '鄭瑩瑩', '鄭泓昊', '蔣沁妍', '甘子賢', '關子謙', '謝欣晏', '黃楚堯', '黃翰皓', '容毓俊', '李可欣', '陸皆橋', '馬超芸', '麥嘉俐', '牟智杰', '潘思涵', '蕭珈睿', '黃一進', '王美琳', '趙梓琳', '趙慕辰']),
  createClass('五乙普通話', ['歐陽卓軒', '陳至濠', '謝穎琳', '鄭智泓', '鄭澳因', '陳靜妍', '陳浩', '霍菁', '黃羲辰', '郭芷晴', '林安娜', '劉樂澄', '李梓樂', '李天恩', '梁康妮', '梁語翹', '梁智中', '梁賢正', '梁伽藍', '梁凱嵐', '劉一鳴', '盧子君', '呂建羲', '馬梓倫', '吳子軒', '吳梓浩', '吳穎詩', '彭賢信', '施泓軒', '蕭昊恩', '蘇健羽', '田浩成', '唐敏裕', '黃浩藍']),
  createClass('四丙 普通話', ['曾子朗', '鄭翊翔', '陳梓晴', '許芝霖', '康安娜', '胡栩豪', '黃璐媛', '黃詩皓', '嚴穎兒', '林晉毅', '林雅妍', '林寶堅', '李凱聰', '梁語穎', '龍紀潼', '盧航俊', '盧俊俐', '莫芷晴', '歐陽健豐', '邱佳茵', '余樂恆', '鍾倬民', '鍾倬承']),
  createClass('四丙公民', ['曾子朗', '鄭翊翔', '陳梓晴', '許芝霖', '康安娜', '胡栩豪', '黃璐媛', '黃詩皓', '嚴穎兒', '林晉毅', '林雅妍', '林寶堅', '李凱聰', '梁語穎', '龍紀潼', '盧航俊', '盧俊俐', '莫芷晴', '歐陽健豐', '邱佳茵', '余樂恆', '鍾倬民', '鍾倬承']),
  createClass('三乙英文', ['陳芷柔', '陳沛詩', '鄭穎彤', '張晉熙', '朱善恆', '馮子陽', '傅玥寧', '高宇皓', '何梓瑤', '何金霏', '何冠奇', '黃欣彤', '黎芷楹', '黎子滔', '林子洋', '林曉棟', '雷翊權', '李祤軒', '梁子泓', '梁皓宸', '梁依晴', '廖巧澄', '駱峻霆', '伍嘉豪', '蕭家軒', '譚灝楊', '丁子皓', '黃芊諭', '王美樂', '許君豪', '周海嵐', '朱麗媛']),
  createClass('三乙普通話', ['陳芷柔', '陳沛詩', '鄭穎彤', '張晉熙', '朱善恆', '馮子陽', '傅玥寧', '高宇皓', '何梓瑤', '何金霏', '何冠奇', '黃欣彤', '黎芷楹', '黎子滔', '林子洋', '林曉棟', '雷翊權', '李祤軒', '梁子泓', '梁皓宸', '梁依晴', '廖巧澄', '駱峻霆', '伍嘉豪', '蕭家軒', '譚灝楊', '丁子皓', '黃芊諭', '王美樂', '許君豪', '周海嵐', '朱麗媛']),
];
