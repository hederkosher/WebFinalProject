'use client';

import dynamic from 'next/dynamic';

const LightPillar = dynamic(() => import('./LightPillar'), { ssr: false });

export default function LightPillarBackground() {
  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <LightPillar
        topColor="#4ade80"
        bottomColor="#22c55e"
        intensity={1.1}
        rotationSpeed={0.25}
        glowAmount={0.005}
        pillarWidth={3.5}
        pillarHeight={0.45}
        noiseIntensity={0.3}
        pillarRotation={20}
        interactive={false}
        mixBlendMode="screen"
        quality="high"
      />
    </div>
  );
}
