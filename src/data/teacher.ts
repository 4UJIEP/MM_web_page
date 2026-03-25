import type { Teacher } from '../types/teacher';

import teacher1Photo from '../assets/teacher1.png';
import teacher2Photo from '../assets/teacher2.png';
import teacher3Photo from '../assets/teacher3.png';
import teacher4Photo from '../assets/teacher4.png';


export const teachersData: Teacher[] = [
  {
    id: '1',
    lastName: 'Николаев',
    firstName: 'Владимир',
    middleName: 'Борисович',
    photo: teacher1Photo,
    achievements: [
      'Канд. физ.-мат. наук',
      'Доцент кафедры фундаментальной и прикладной математики ФЦТК',
      'Председатель региональной комиссии ЕГЭ по математике (2004-2020 гг.)',
    ],
  },
  {
    id: '2',
    lastName: 'Астафьевич',
    firstName: 'Агалаков',
    middleName: 'Сергей',
    photo: teacher2Photo,
    achievements: [
      'Директор Малого матфака',
      'Доцент кафедры компьютерной математики и программного обеспечения ФЦТК',
      'Математик и программист',
      'Председатель региональной комиссии ЕГЭ по математике (2004-2020 гг.)',
    ],
  },
  {
    id: '3',
    lastName: 'Николаевна',
    firstName: 'Пахомова',
    middleName: 'Ксения',
    photo: teacher3Photo,
    achievements: [
      'Выпускница математического факультета ОмГУ',
      'Автор материалов в журнале "Квантик"',
      'Член методической комиссии регионального этапа Всероссийской олимпиады школьников по математике',
      'Преподаватель групп математики 6-7 классов',
    ],
  },
  {
    id: '4',
    lastName: 'Валерьевна',
    firstName: 'Ушакова',
    middleName: 'Евгения',
    photo: teacher4Photo,
    achievements: [
      'Старший преподаватель компьютерной математики и программного обеспечения',
      'Преподаватель групп по информ → 1',
      'Руководитель направления 1-11 классы',
    ],
  },
  {
    id: '5',
    lastName: 'Астафьевич',
    firstName: 'Агалаков',
    middleName: 'Сергей',
    photo: teacher2Photo,
    achievements: [
      'Директор Малого матфака',
      'Доцент кафедры компьютерной математики и программного обеспечения ФЦТК',
      'Математик и программист',
      'Председатель региональной комиссии ЕГЭ по математике (2004-2020 гг.)',
    ],
  },
];