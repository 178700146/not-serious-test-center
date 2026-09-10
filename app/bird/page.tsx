import type { Metadata } from 'next';

import BirdQuiz from '@/components/quizzes/bird-quiz';

export const metadata: Metadata = {
  title: '观鸟大师｜不太正经测试中心',
  description: '看野生鸟照片，从四个选项里选出鸟名。',
};

export default function BirdPage() {
  return <BirdQuiz />;
}
