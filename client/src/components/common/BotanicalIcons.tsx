import React from 'react';

/*
  Modern duotone line icons
  - 32x32 grid, 1.6 rounded stroke
  - Main shapes carry a soft tint (currentColor @ 14%) so every icon
    follows the surrounding text colour automatically
  - Small sparkle / drop accents give each icon a fresh, premium feel
*/

type IconProps = { className?: string };

const TINT = { fill: 'currentColor', fillOpacity: 0.14 } as const;

const Svg: React.FC<IconProps & { children: React.ReactNode }> = ({ className = 'w-7 h-7', children }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

/* ------------------------------------------------------------------ */
/* Value proposition icons                                             */
/* ------------------------------------------------------------------ */

export const NaturalIngredientsIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M7 25C7 14 14 7 26 6C26 18 19.5 25 10 25C8.9 25 7.9 25 7 25Z" {...TINT} />
    <path d="M6 27L19 13" />
    <path d="M14.5 17.5H19.5M17 20.5H21" />
    <path d="M25.5 21V25M23.5 23H27.5" />
  </Svg>
);

export const LabTestedIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M13 5H19" />
    <path d="M10.4 19.5H21.6L23.5 22.6C24.7 24.6 23.3 27 21 27H11C8.7 27 7.3 24.6 8.5 22.6L10.4 19.5Z" {...TINT} stroke="none" />
    <path d="M14 5V12L8.5 22.6C7.3 24.6 8.7 27 11 27H21C23.3 27 24.7 24.6 23.5 22.6L18 12V5" />
    <path d="M10.4 19.5H21.6" />
    <circle cx="14" cy="23.2" r="1" fill="currentColor" stroke="none" />
    <circle cx="18.2" cy="22" r="0.9" fill="currentColor" stroke="none" />
    <path d="M25 4V8M23 6H27" />
  </Svg>
);

export const SafeFormulaIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M16 4L26 8V15C26 21.5 21.8 26.2 16 28C10.2 26.2 6 21.5 6 15V8L16 4Z" {...TINT} />
    <path d="M11.5 16L14.8 19.2L20.5 12.8" />
  </Svg>
);

export const FreeShippingIcon: React.FC<IconProps> = ({ className }) => (
  <Svg className={className}>
    <path d="M16 4L27 9.5V22.5L16 28L5 22.5V9.5L16 4Z" {...TINT} />
    <path d="M5 9.5L16 15L27 9.5" />
    <path d="M16 15V28" />
    <path d="M10.5 6.8L21.5 12.3" />
  </Svg>
);

/* ------------------------------------------------------------------ */
/* Category icons                                                      */
/* ------------------------------------------------------------------ */

export const CategoryIcon: React.FC<{ name: string; className?: string }> = ({
  name,
  className = 'w-8 h-8 text-[#13382B]',
}) => {
  switch (name.trim().toLowerCase()) {
    case 'face care':
      return (
        <Svg className={className}>
          <path d="M16 5C11 5 8 9 8 14.5C8 20.5 11.5 25.5 16 25.5C20.5 25.5 24 20.5 24 14.5C24 9 21 5 16 5Z" {...TINT} />
          <path d="M11.8 14.5C12.6 15.4 13.9 15.4 14.7 14.5" />
          <path d="M17.3 14.5C18.1 15.4 19.4 15.4 20.2 14.5" />
          <path d="M13.5 19.3C14.9 20.5 17.1 20.5 18.5 19.3" />
          <path d="M26 3.5V7.5M24 5.5H28" />
        </Svg>
      );

    case 'body care':
      return (
        <Svg className={className}>
          <rect x="9" y="12" width="14" height="16" rx="4" {...TINT} />
          <path d="M13 12V9H19V12" />
          <path d="M16 9V5H21" />
          <path d="M13 19H19" />
          <path d="M13 22.5H17" />
        </Svg>
      );

    case 'hair care':
      return (
        <Svg className={className}>
          <path d="M10 5C8 10 12 13 10 18C8.6 22 10 25 10 27" />
          <path d="M16 4C14 9 18 12 16 17C14.6 21 16 25 16 28" {...TINT} stroke="currentColor" />
          <path d="M22 5C20 10 24 13 22 18C20.6 22 22 25 22 27" />
        </Svg>
      );

    case 'skincare sets':
      return (
        <Svg className={className}>
          {/* dropper bottle */}
          <rect x="3.5" y="12" width="8" height="15" rx="2.2" {...TINT} />
          <path d="M6 12V8.5H9V12" />
          {/* jar */}
          <rect x="13.5" y="19" width="9" height="8" rx="2" {...TINT} />
          <path d="M14.5 19V17H21.5V19" />
          {/* tube */}
          <path d="M24.5 27V14L26.5 11L28.5 14V27Z" {...TINT} />
        </Svg>
      );

    case 'natural care':
      return (
        <Svg className={className}>
          <path d="M8 27C11 20 16.5 13.5 25 6" />
          <path d="M13.5 21.5C9.5 21.8 7 19 7 15.5C11 15.5 13.7 17.5 13.5 21.5Z" {...TINT} />
          <path d="M17.5 15C14.5 13.8 13.3 10.5 14.3 7.3C17.8 8 19.8 11 17.5 15Z" {...TINT} />
          <path d="M22 11C23.5 14 26 15 28.5 14.5C28 11 25.5 9.5 22 11Z" {...TINT} />
        </Svg>
      );

    case 'night care':
      return (
        <Svg className={className}>
          <g transform="translate(2.8 4) scale(1.05)">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" {...TINT} />
          </g>
          <path d="M24.5 4.5V8.5M22.5 6.5H26.5" />
        </Svg>
      );

    case 'organic range':
    default:
      return (
        <Svg className={className}>
          <circle cx="16" cy="16" r="11.5" {...TINT} />
          <path d="M16 23V15.5" />
          <path d="M16 15.5C16 12.5 14 10.5 11 10.5C11 13.5 12.8 15.5 16 15.5Z" />
          <path d="M16 18C16 15 18 12.8 21.5 12.8C21.5 16 19.3 18 16 18Z" />
        </Svg>
      );
  }
};