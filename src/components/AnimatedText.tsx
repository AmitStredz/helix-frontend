import { useState, useEffect } from 'react';

interface AnimatedTextProps {
  texts: string[];
  className?: string;
  interval?: number;
}

export function AnimatedText({ texts, className = '', interval = 3000 }: AnimatedTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <span className={`inline-block transition-all duration-500 ${className}`}>
      {texts[currentIndex]}
    </span>
  );
}

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export function TypewriterText({ text, className = '', speed = 100 }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={`${className}`}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

interface CountingNumberProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountingNumber({ 
  target, 
  duration = 2000, 
  prefix = '', 
  suffix = '', 
  className = '' 
}: CountingNumberProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const increment = target / (duration / 16); // 60fps
    const timer = setInterval(() => {
      setCurrent(prev => {
        const next = prev + increment;
        if (next >= target) {
          clearInterval(timer);
          return target;
        }
        return next;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <span className={className}>
      {prefix}{Math.floor(current).toLocaleString()}{suffix}
    </span>
  );
}