import type { Metadata } from 'next';

import MushroomQuiz from '@/components/quizzes/mushroom-quiz';

export const metadata: Metadata = {
  title: '蘑菇大师｜不太正经测试中心',
  description: '看图判断蘑菇有毒还是无毒。',
};

export default function MushroomPage() {
  return <MushroomQuiz />;
}
