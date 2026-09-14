import type { Metadata } from 'next';

import ReactionSpeedQuiz from '@/components/quizzes/reaction-speed-quiz';

export const metadata: Metadata = {
  title: '反应速度局｜不太正经测试中心',
  description: '基础版变黄就按，进阶版出现就按，五轮总反应时间直接相加。',
};

export default function ReactionSpeedPage() {
  return <ReactionSpeedQuiz />;
}
