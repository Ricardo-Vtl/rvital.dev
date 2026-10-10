"use client";

export function GrainOverlay() {
  return (
    <div className="grain-overlay pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-[0.02]">
      <svg
        className="h-full w-full"
        aria-hidden="true"
        style={{ animation: "grain 8s steps(10) infinite" }}
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}
