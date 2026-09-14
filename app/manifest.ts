import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '不太正经测试中心',
    short_name: '不太正经测试',
    description: '这里专门测试那些奇奇怪怪的本事。',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f2e7',
    theme_color: '#252b49',
    lang: 'zh-CN',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
