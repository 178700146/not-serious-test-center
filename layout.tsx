import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '不太正经测试中心',
  description: '这里专门测试那些奇奇怪怪的本事。',
  openGraph: {
    title: '不太正经测试中心',
    description: '这里专门测试那些奇奇怪怪的本事。',
    url: 'https://not-serious-test-center.kind-song-3636.chatgpt.site',
    siteName: '不太正经测试中心',
    images: ['https://not-serious-test-center.kind-song-3636.chatgpt.site/og.png'],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '不太正经测试中心',
    description: '这里专门测试那些奇奇怪怪的本事。',
    images: ['https://not-serious-test-center.kind-song-3636.chatgpt.site/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
