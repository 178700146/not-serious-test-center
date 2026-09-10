import type { Metadata } from 'next';

import UltramanSoundQuiz from '@/components/quizzes/ultraman-sound-quiz';

export const metadata: Metadata = {
  title: '奥特曼听声局｜不太正经测试中心',
  description: '听叫声，从四个名字里选出这位光之巨人。',
};

export default function UltramanSoundPage() {
  return <UltramanSoundQuiz />;
}
