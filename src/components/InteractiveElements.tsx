import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Zap, Shield, Star } from 'lucide-react';

interface ParticleProps {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export function ParticleSystem({ className = '' }: { className?: string }) {
  const [particles, setParticles] = useState<ParticleProps[]>([]);

  useEffect(() => {
    const createParticle = (): ParticleProps => ({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 10,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 3 - 1,
      life: 0,
      maxLife: Math.random() * 100 + 50,
    });

    const updateParticles = () => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life + 1,
          }))
          .filter(p => p.life < p.maxLife && p.y > -10)
      );
    };

    const addParticle = () => {
      setParticles(prev => [...prev, createParticle()]);
    };

    const particleInterval = setInterval(addParticle, 200);
    const updateInterval = setInterval(updateParticles, 50);

    return () => {
      clearInterval(particleInterval);
      clearInterval(updateInterval);
    };
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute w-1 h-1 bg-primary rounded-full opacity-50"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: 1 - (particle.life / particle.maxLife),
          }}
        />
      ))}
    </div>
  );
}

export function FloatingStats() {
  const stats = [
    { icon: TrendingUp, value: '+12.5%', label: 'APY' },
    { icon: TrendingDown, value: '-2.1%', label: 'Risk' },
    { icon: Zap, value: '0.3s', label: 'Speed' },
    { icon: Shield, value: '100%', label: 'Secure' },
    { icon: Star, value: '5.0', label: 'Rating' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="absolute glass-card p-3 opacity-20 hover:opacity-40 transition-all duration-500"
          style={{
            left: `${20 + index * 15}%`,
            top: `${30 + (index % 2) * 40}%`,
            animationDelay: `${index * 0.5}s`,
          }}
        >
          <stat.icon className="w-4 h-4 text-primary mb-1" />
          <div className="text-xs font-orbitron text-primary">{stat.value}</div>
          <div className="text-xs text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export function PulsatingDots({ className = '' }: { className?: string }) {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-primary rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </div>
  );
}

export function WaveEffect({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent transform -skew-x-12 animate-gradient-x" />
      </div>
    </div>
  );
}