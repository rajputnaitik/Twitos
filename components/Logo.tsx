
import React from 'react';

interface LogoProps {
  className?: string;
  isAnimated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = 'w-24 h-24', isAnimated = false }) => {
  return (
    <div className={`${className} ${isAnimated ? 'animate-pulse' : ''}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="22" fill="#1DA1F2"/>
        <g transform="translate(15, 18) scale(1.2)">
            <path d="M22.4,27.3c0,0.4-0.4,0.7-0.7,0.7h-3.4c-0.4,0-0.7-0.4-0.7-0.7v-2.1h4.8V27.3z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M22.4,18.9v4.2h-4.8v-4.2c0-0.4,0.4-0.7,0.7-0.7h3.4C22,18.2,22.4,18.5,22.4,18.9z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M37.9,13.1c-2.4,2.4-5.5,3.8-8.8,3.8c-2.8,0-5.5-0.9-7.7-2.7c-4.1-3.2-5.1-8.9-2.5-13.3c0.1-0.2,0.1-0.5-0.1-0.7
                C18.6,0.1,18.3,0,18.1,0h-2.1c-0.4,0-0.8,0.3-0.9,0.7c-3.3,9.5,0.2,20.1,8.5,25.2c4.1,2.5,8.8,3.3,13.2,2.3
                c0.5-0.1,0.8-0.5,0.8-1v-2.2c0-0.5-0.4-0.9-0.9-0.8c-3,0.6-6-0.3-8.3-2.1c-3.2-2.5-4.8-6.3-4.5-10.1c0.1-0.5-0.2-0.9-0.7-1
                c-0.5-0.1-0.9,0.2-1,0.7c-0.5,2.7,0.4,5.5,2.4,7.4c1.6,1.5,3.8,2.3,6,2.3c2.4,0,4.7-1,6.4-2.8c3.8-4,3.6-10.2-0.5-13.9
                c-0.2-0.2-0.4-0.2-0.6,0c-0.2,0.2-0.2,0.4,0,0.6C41.3,7.9,41.5,13.1,37.9,13.1z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <circle cx="34.8" cy="10" r="2.2" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
        </g>
      </svg>
    </div>
  );
};

export default Logo;
