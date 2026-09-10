import type { Metadata } from 'next';

import StrangeSkillQuiz from '@/components/quizzes/strange-skill-quiz';

export const metadata: Metadata = {
  title: '昆虫侦探｜不太正经测试中心',
  description: '看一眼触角、翅脉和腿，猜出它是谁。',
};

export default function InsectsPage() {
  return <StrangeSkillQuiz />;
}
