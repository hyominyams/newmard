import React, { forwardRef } from "react";

const WorldMap = forwardRef(function WorldMap(_, ref) {
  return (
    <svg
      ref={ref}
      className="absolute inset-0 h-full w-full scale-[1.02]"
      viewBox="0 0 1200 600"
      width="1200"
      height="600"
      focusable="false"
      aria-hidden="true"
      role="img"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="ocean" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0b1220" />
          <stop offset="100%" stopColor="#0f1f3a" />
        </linearGradient>
        <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.18" />
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#93c5fd" opacity="0.16" />
        </pattern>
      </defs>

      <rect width="1200" height="600" fill="url(#ocean)" />
      <rect width="1200" height="600" fill="url(#dots)" opacity="0.6" />

      <g filter="url(#soft)">
        <path
          d="M120 250 C 170 160, 310 140, 360 220 C 410 300, 360 360, 290 360 C 210 360, 90 330, 120 250 Z"
          fill="url(#land)"
        />
        <path
          d="M430 190 C 520 120, 690 130, 740 220 C 790 310, 760 390, 650 400 C 540 410, 430 300, 430 190 Z"
          fill="url(#land)"
        />
        <path
          d="M800 260 C 870 210, 980 220, 1030 280 C 1080 340, 1040 410, 950 410 C 860 410, 770 340, 800 260 Z"
          fill="url(#land)"
        />
        <path
          d="M930 450 C 970 420, 1040 430, 1065 470 C 1090 510, 1060 540, 1010 540 C 960 540, 900 500, 930 450 Z"
          fill="url(#land)"
          opacity="0.9"
        />
      </g>

      <g opacity="0.26">
        <path
          d="M140 252 C 190 175, 305 160, 350 225 C 395 290, 352 345, 295 345 C 225 345, 110 320, 140 252 Z"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="2"
        />
        <path
          d="M450 200 C 540 135, 675 145, 720 220 C 765 295, 740 370, 650 382 C 560 395, 450 300, 450 200 Z"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="2"
        />
        <path
          d="M820 270 C 890 225, 975 235, 1018 285 C 1060 335, 1030 390, 950 392 C 870 395, 790 332, 820 270 Z"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
});

export default WorldMap;

