'use client';

import dynamic from 'next/dynamic';

const ThreeBackground = dynamic(() => import('@/components/three-background'), {
  ssr: false,
});

export default function ThreeBackgroundWrapper() {
  return <ThreeBackground />;
}

