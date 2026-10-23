"use client";

import { useEffect, useRef } from "react";

export function InteractiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      // Calculate normalized mouse coords (-1 to 1)
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const render = () => {
      // Smooth lerp interpolation for 60fps fluid lag
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      if (container) {
        container.style.setProperty("--mouse-x", `${currentX * 25}px`);
        container.style.setProperty("--mouse-y", `${currentY * 25}px`);
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Light Mode Atmosphere */}
      <div className="absolute inset-0 bg-[#f8fafc] dark:hidden transition-colors duration-500" />
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-200/40 via-sky-100/30 to-transparent blur-[120px] dark:hidden transition-transform duration-700 ease-out [transform:translate3d(var(--mouse-x,0),var(--mouse-y,0),0)]" />
      <div className="absolute top-[30%] right-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-amber-100/40 via-orange-50/30 to-transparent blur-[140px] dark:hidden transition-transform duration-700 ease-out [transform:translate3d(calc(var(--mouse-x,0)*-1),calc(var(--mouse-y,0)*-1),0)]" />
      <div className="absolute bottom-[-10%] left-[20%] h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-emerald-100/30 via-teal-50/20 to-transparent blur-[130px] dark:hidden transition-transform duration-700 ease-out" />

      {/* Dark Mode Deep Midnight Obsidian Atmosphere */}
      <div className="hidden dark:block absolute inset-0 bg-[#06080d] transition-colors duration-500" />
      <div className="hidden dark:block absolute -top-[15%] left-[10%] h-[650px] w-[650px] rounded-full bg-gradient-to-br from-indigo-600/15 via-violet-600/10 to-transparent blur-[140px] transition-transform duration-700 ease-out [transform:translate3d(var(--mouse-x,0),var(--mouse-y,0),0)]" />
      <div className="hidden dark:block absolute top-[35%] -right-[10%] h-[700px] w-[700px] rounded-full bg-gradient-to-bl from-cyan-500/12 via-blue-600/8 to-transparent blur-[160px] transition-transform duration-700 ease-out [transform:translate3d(calc(var(--mouse-x,0)*-1),calc(var(--mouse-y,0)*-1),0)]" />
      <div className="hidden dark:block absolute -bottom-[10%] left-[25%] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-emerald-500/10 via-teal-600/5 to-transparent blur-[150px] transition-transform duration-700 ease-out" />

      {/* Subtle Micro-Grid Matrix Overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035] [background-size:40px_40px] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]"
      />

      {/* Micro-Noise Film Grain for Physical Tactility */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.018] dark:opacity-[0.028] pointer-events-none mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
