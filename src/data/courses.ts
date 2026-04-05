import type { Course } from '../types/course';

import mathImage from '../assets/kid_chess.png';
import chessImage from '../assets/kid_chess.png';
import itImage from '../assets/kid_chess.png';
import cuboroImage from '../assets/kid_chess.png';

export const coursesData: Course[] = [
  {
    id: 'math',
    slug: 'mathematics',
    title: 'Математика',
    badge: '1-11 классы',
    badgeColor: '#ABF5CC',
    duration: '2 часа',
    difficulty: 'Немало',
    lessonsCount: 24,
    image: mathImage,
  },
  {
    id: 'chess',
    slug: 'chess',
    title: 'Шахматы',
    badge: 'Для всех возрастов',
    badgeColor: '#D9BAFF',
    duration: '2 часа',
    difficulty: 'Немало',
    lessonsCount: 24,
    image: chessImage,
  },
  {
    id: 'it',
    slug: 'informatics',
    title: 'Информатика',
    badge: '3-11 классы',
    badgeColor: '#96CDFF',
    duration: '2 часа',
    difficulty: 'Немало',
    lessonsCount: 24,
    image: itImage,
  },
  {
    id: 'cuboro',
    slug: 'cuboro',
    title: 'Куборо',
    badge: 'Для всех возрастов',
    badgeColor: '#FFD88A',
    duration: '2 часа',
    difficulty: 'Немало',
    lessonsCount: 24,
    image: cuboroImage,
  },
];