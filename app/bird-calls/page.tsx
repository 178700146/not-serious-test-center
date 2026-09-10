import type { Metadata } from 'next';

import StrangeSkillQuiz from '@/components/quizzes/strange-skill-quiz';

export const metadata: Metadata = {
  title: '鸟鸣识别｜不太正经测试中心',
  description: '听野鸟叫声，从四个选项里选出鸟名。',
};

export default function BirdCallsPage() {
  return <StrangeSkillQuiz />;
}
