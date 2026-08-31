import React from 'react';

interface MbcLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
  showText?: boolean;
}

export const MbcLogo: React.FC<MbcLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'auto',
  showText = true,
}) => {
  const sizeMap = {
    sm: { icon: 32, text: 'text-lg', subtitle: 'text-[9px]', gap: 'gap-2' },
    md: { icon: 42, text: 'text-2xl', subtitle: 'text-xs', gap: 'gap-2.5' },
    lg: { icon: 56, text: 'text-3xl', subtitle: 'text-sm', gap: 'gap-3' },
    xl: { icon: 80, text: 'text-5xl', subtitle: 'text-lg', gap: 'gap-4' },
  };

  const dim = sizeMap[size];

  // Determine text stroke & fill according to theme
  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center ${dim.gap} select-none ${className}`}>
      {/* CMYK Circle Emblem */}
      <svg
        width={dim.icon}
        height={dim.icon}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
      >
        {/* Black Slice (Far Left) */}
        <path
          d="M 55,40 A 90,90 0 0,0 25,120 A 90,90 0 0,0 55,200 L 60,200 L 60,40 Z"
          fill="#18181b"
        />
        {/* Yellow Slice (Mid Left) */}
        <path
          d="M 66,35 L 94,22 L 94,218 L 66,205 Z"
          fill="#facc15"
        />
        {/* Magenta Slice (Center-Right Arc) */}
        <path
          d="M 100,12 C 148,12 178,52 178,120 C 178,188 148,228 100,228 Z"
          fill="#ec4899"
        />
        {/* Cyan Slice (Far Right) */}
        <path
          d="M 185,38 A 90,90 0 0,1 214,120 A 90,90 0 0,1 185,202 Z"
          fill="#0284c7"
        />
      </svg>

      {/* Brand Name & Subtitle */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div
            className={`font-black tracking-tight font-sans italic ${dim.text} ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            mbc
          </div>
          <div
            className={`font-extrabold tracking-[0.3em] uppercase ${dim.subtitle} ${
              isDark ? 'text-indigo-300' : 'text-indigo-600'
            }`}
          >
            PRINT
          </div>
        </div>
      )}
    </div>
  );
};
