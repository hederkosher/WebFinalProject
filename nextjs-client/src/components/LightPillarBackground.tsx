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
        topColor="#669c35"
        bottomColor="#77bb41"
        intensity={1}
        rotationSpeed={0.3}
        glowAmount={0.002}
        pillarWidth={3}
        pillarHeight={0.4}
        noiseIntensity={0.5}
        pillarRotation={25}
        interactive={false}
        mixBlendMode="screen"
        quality="high"
      />
    </div>
  );
}
