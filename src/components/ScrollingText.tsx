import { useEffect, useState } from 'react';

interface ScrollingTextProps {
  texts: string[];
  className?: string;
  speed?: number;
}

export function ScrollingText({ texts, className = '', speed = 50 }: ScrollingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, speed * 100);

    return () => clearInterval(interval);
  }, [texts.length, speed]);

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="scroll-text inline-block">
        {texts[currentIndex]}
      </div>
    </div>
  );
}

interface MarqueeTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export function MarqueeText({ text, className = '', speed = 20 }: MarqueeTextProps) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div 
        className="inline-block animate-scroll"
        style={{ 
          animation: `scrollText ${speed}s linear infinite`,
        }}
      >
        {text} • {text} • {text} • {text}
      </div>
    </div>
  );
}

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 150);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className={`${glitching ? 'animate-pulse' : ''}`}>
        {text}
      </span>
      {glitching && (
        <span 
          className="absolute top-0 left-0 text-primary opacity-70"
          style={{ transform: 'translate(2px, 1px)' }}
        >
          {text}
        </span>
      )}
    </span>
  );
}