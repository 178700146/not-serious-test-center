import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '不太正经测试中心',
  description: '这里专门测试那些奇奇怪怪的本事。',
  openGraph: {
    title: '不太正经测试中心',
    description: '这里专门测试那些奇奇怪怪的本事。',
    url: 'https://notatest.cn',
    siteName: '不太正经测试中心',
    images: ['https://notatest.cn/og.png'],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '不太正经测试中心',
    description: '这里专门测试那些奇奇怪怪的本事。',
    images: ['https://notatest.cn/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
