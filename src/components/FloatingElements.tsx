import { useEffect, useState } from 'react';
import { Bitcoin, Zap, TrendingUp, Shield, DollarSign } from 'lucide-react';

interface FloatingIcon {
  id: number;
  Icon: any;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

export function FloatingElements() {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);

  const iconTypes = [Bitcoin, Zap, TrendingUp, Shield, DollarSign];

  useEffect(() => {
    const initialIcons: FloatingIcon[] = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      Icon: iconTypes[Math.floor(Math.random() * iconTypes.length)],
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 20 + 15,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.3 + 0.1,
    }));

    setIcons(initialIcons);

    const animateIcons = () => {
      setIcons(prev => prev.map(icon => ({
        ...icon,
        x: (icon.x + icon.speed) % window.innerWidth,
        y: icon.y + Math.sin(icon.x * 0.01) * 0.5,
      })));
    };

    const interval = setInterval(animateIcons, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map(icon => {
        const { Icon } = icon;
        return (
          <Icon
            key={icon.id}
            className="absolute text-primary transition-all duration-1000"
            style={{
              left: `${icon.x}px`,
              top: `${icon.y}px`,
              width: `${icon.size}px`,
              height: `${icon.size}px`,
              opacity: icon.opacity,
            }}
          />
        );
      })}
    </div>
  );
}

export function PulsingOrb({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute rounded-full bg-primary/20 pulse-glow ${className}`} 
         style={{ 
           width: '200px', 
           height: '200px',
           filter: 'blur(40px)'
         }} 
    />
  );
}