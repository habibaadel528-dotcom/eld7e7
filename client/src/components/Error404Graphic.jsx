import React from 'react';
import four from '../assets/images/four-404.png';

export const Error404Graphic = () => {
  return (
    <div className="w-full max-w-lg mx-auto flex items-center justify-center my-6 select-none">
      <div className="flex items-end justify-center gap-3 sm:gap-5">
        {/* Left '4' - Image */}
        <img 
          src={four} 
          alt="4" 
          className="h-[120px] sm:h-[160px] md:h-[190px] object-contain" 
          style={{ imageRendering: 'auto' }}
          draggable="false"
        />

        {/* Center '0' Character - SVG */}
        <svg viewBox="0 0 155 210" className="h-[140px] sm:h-[180px] md:h-[210px] flex-shrink-0">
          {/* Main Red Oval Body */}
          <ellipse cx="77" cy="105" rx="72" ry="98" fill="#C53836" />

          {/* Left Large Oval Eye (Tilted White) */}
          <ellipse cx="49" cy="91" rx="26" ry="36" transform="rotate(-15 49 91)" fill="#FFFFFF" />
          
          {/* Left Eye Black Pupil */}
          <circle cx="57" cy="81" r="7" fill="#12121A" />

          {/* Left Eyebrow (Arch) */}
          <path
            d="M 31 45 Q 55 23 67 55"
            fill="none"
            stroke="#12121A"
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* Right Smaller Oval Eye (White) */}
          <ellipse cx="107" cy="101" rx="16" ry="22" transform="rotate(6 107 101)" fill="#FFFFFF" />
          
          {/* Right Eye Black Pupil */}
          <circle cx="101" cy="99" r="5" fill="#12121A" />

          {/* Right Eyebrow */}
          <path
            d="M 93 69 Q 109 63 121 73"
            fill="none"
            stroke="#12121A"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Skeptical Mouth Line */}
          <path
            d="M 79 145 Q 91 131 103 137"
            fill="none"
            stroke="#12121A"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Right '4' - Image */}
        <img 
          src={four} 
          alt="4" 
          className="h-[120px] sm:h-[160px] md:h-[190px] object-contain" 
          style={{ imageRendering: 'auto' }}
          draggable="false"
        />
      </div>
    </div>
  );
};
