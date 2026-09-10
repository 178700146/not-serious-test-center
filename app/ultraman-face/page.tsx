import type { Metadata } from 'next';

import UltramanFaceQuiz from '@/components/quizzes/ultraman-face-quiz';

export const metadata: Metadata = {
  title: '奥特曼认脸局｜不太正经测试中心',
  description: '看形象，选出这位光之巨人的名字。',
};

export default function UltramanFacePage() {
  return <UltramanFaceQuiz />;
}
