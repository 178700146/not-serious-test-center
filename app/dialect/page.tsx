import type { Metadata } from 'next';

import DialectQuiz from '@/components/quizzes/dialect-quiz';

export const metadata: Metadata = {
  title: '方言捕手｜不太正经测试中心',
  description: '听一段方言，自己写下你猜的省份。',
};

export default function DialectPage() {
  return <DialectQuiz />;
}
