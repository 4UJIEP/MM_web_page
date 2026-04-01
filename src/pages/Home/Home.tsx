import type { FC } from 'react';
import { Hero } from '../../components/Hero';
import { Courses } from '../../components/Courses';
import { Teachers } from '../../components/Teachers';
import { FAQ } from '../../components/FAQ';

export const Home: FC = () => {
  return (
    <>
      <Hero />
      <Courses />
      <Teachers />
      <FAQ />
    </>
  );
};