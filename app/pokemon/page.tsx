import type { Metadata } from 'next';

import PokemonQuiz from '@/components/quizzes/pokemon-quiz';

export const metadata: Metadata = {
  title: '宝可梦剪影局｜不太正经测试中心',
  description: '看轮廓，从四个名字里猜出它是谁。',
};

export default function PokemonPage() {
  return <PokemonQuiz />;
}
