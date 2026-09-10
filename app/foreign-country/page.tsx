import type { Metadata } from 'next';

import StrangeSkillQuiz from '@/components/quizzes/strange-skill-quiz';

export const metadata: Metadata = {
  title: '外语猜国家｜不太正经测试中心',
  description: '听一小句陌生话，猜它从哪个国家来。',
};

export default function ForeignCountryPage() {
  return <StrangeSkillQuiz />;
}
