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
        topColor="#7ab84a"
        bottomColor="#8ed45a"
        intensity={1.4}
        rotationSpeed={0.3}
        glowAmount={0.004}
        pillarWidth={3}
        pillarHeight={0.4}
        noiseIntensity={0.35}
        pillarRotation={25}
        interactive={false}
        mixBlendMode="screen"
        quality="high"
      />
    </div>
  );
}
