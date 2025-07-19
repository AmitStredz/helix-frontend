import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, TrendingUp, Users } from "lucide-react";
import { AnimatedText, TypewriterText } from './AnimatedText';
import { ScrollingText, MarqueeText, GlitchText } from './ScrollingText';
import { ParticleSystem, FloatingStats, WaveEffect } from './InteractiveElements';
import { FloatingElements } from './FloatingElements';

interface HeroProps {
  onSectionChange?: (section: string) => void;
}

export function Hero({ onSectionChange }: HeroProps) {
  const heroTexts = ['DeFi Revolution', 'Cross-Chain Trading', 'Smart Arbitrage', 'Yield Optimization'];
  const marqueeText = 'CRYPTOVAULT • NEXT-GEN DEFI • CROSS-CHAIN TRADING • SMART ARBITRAGE • YIELD MAXIMIZATION';

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced animated background */}
      <FloatingElements />
      <ParticleSystem />
      <FloatingStats />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float morphing"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float morphing" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-gradient-x"></div>
        <WaveEffect className="absolute inset-0" />
      </div>
      
      {/* Scrolling text at top */}
      <div className="absolute top-4 left-0 right-0 z-10">
        <MarqueeText 
          text={marqueeText}
          className="text-sm font-mono text-primary/60"
          speed={30}
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <Badge variant="outline" className="mb-6 text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors animate-pulse">
          🚀 <AnimatedText texts={['Next-Gen DeFi', 'AI-Powered', 'Cross-Chain', 'Smart Trading']} />
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slide-up">
          <GlitchText 
            text="CryptoVault"
            className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x font-orbitron text-glow"
          />
        </h1>
        
        <div className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
          <TypewriterText 
            text="Maximize your crypto yields with AI-powered strategies"
            speed={50}
          />
        </div>
        
        <div className="text-lg md:text-xl text-primary/80 mb-8">
          <ScrollingText 
            texts={heroTexts}
            className="font-mono"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            size="lg" 
            onClick={() => onSectionChange?.('dashboard')}
            className="btn-gradient-primary group hover:scale-105 transition-all duration-300 bounce"
          >
            <Zap className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
            Launch App
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all hover:scale-105 glass-morphism"
          >
            <Shield className="mr-2 h-4 w-4" />
            View Documentation
          </Button>
        </div>

        {/* Enhanced feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: "Secure Vaults", desc: "Military-grade security", color: "text-green-400" },
            { icon: Zap, title: "Lightning Fast", desc: "Sub-second execution", color: "text-yellow-400" },
            { icon: TrendingUp, title: "High Yields", desc: "Maximize your returns", color: "text-primary" },
            { icon: Users, title: "Community", desc: "Join 10k+ traders", color: "text-accent" }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 hover:bg-card/60 transition-all duration-300 group hover:scale-105 hover:rotate-1 cursor-pointer"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <feature.icon className={`w-8 h-8 ${feature.color} mb-4 group-hover:scale-110 group-hover:wiggle transition-transform`} />
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}