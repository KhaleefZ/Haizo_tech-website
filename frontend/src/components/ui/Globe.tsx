'use client';

import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !canvasRef.current) return;
    let phi = 0;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [0.5, 0.2, 1],
      markers: [
        // Example markers
        { location: [37.7595, -122.4367], size: 0.05 },
        { location: [40.7128, -74.0060], size: 0.05 },
        { location: [11.0168, 76.9558], size: 0.08 }, // Coimbatore
      ],
      // @ts-expect-error cobe types are missing onRender
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => {
      globe.destroy();
    };
  }, [isMounted]);

  if (!isMounted) return <div className="w-full max-w-[500px] aspect-square relative" />;

  return (
    <div className="w-full max-w-[500px] aspect-square relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          contain: 'layout paint size',
          opacity: 1,
          transition: 'opacity 1s ease',
        }}
      />
    </div>
  );
}
