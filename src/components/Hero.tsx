import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface HeroProps {
  onSectionChange?: (section: string) => void;
}

export function Hero({ onSectionChange }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Next-Gen DeFi Platform</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">
              Maximize Your
            </span>
            <br />
            <span className="text-foreground">Crypto Yields</span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Leverage advanced AI-powered strategies, cross-chain arbitrage, and intelligent vault management 
            to optimize your crypto portfolio returns.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              variant="gradient" 
              size="xl" 
              className="w-full sm:w-auto"
              onClick={() => onSectionChange?.('dashboard')}
            >
              Launch App
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="glass" size="xl" className="w-full sm:w-auto">
              View Documentation
            </Button>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="glass-card p-6 hover:scale-105 transition-transform duration-300">
              <Shield className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure Vaults</h3>
              <p className="text-muted-foreground text-sm">
                Battle-tested smart contracts with multi-signature security
              </p>
            </Card>

            <Card className="glass-card p-6 hover:scale-105 transition-transform duration-300">
              <TrendingUp className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Strategies</h3>
              <p className="text-muted-foreground text-sm">
                Machine learning algorithms optimize yield farming strategies
              </p>
            </Card>

            <Card className="glass-card p-6 hover:scale-105 transition-transform duration-300">
              <Zap className="w-8 h-8 text-success mb-4" />
              <h3 className="text-lg font-semibold mb-2">Cross-Chain</h3>
              <p className="text-muted-foreground text-sm">
                Execute arbitrage across multiple blockchain networks
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}