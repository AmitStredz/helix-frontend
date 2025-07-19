import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Zap, 
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Settings,
  AlertCircle,
  Activity, 
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedText, CountingNumber, TypewriterText } from './AnimatedText';
import { FloatingElements, PulsingOrb } from './FloatingElements';
import { ScrollingText, GlitchText } from './ScrollingText';
import { ParticleSystem, PulsatingDots, WaveEffect } from './InteractiveElements';

export function Dashboard() {
  const { user } = useAuth();
  const portfolioData = {
    totalValue: 125847.23,
    totalChange: 12.45,
    totalChangePercent: 8.7,
    assets: [
      { name: 'ETH', amount: 45.67, value: 87532.45, apy: 12.4, change: 5.2 },
      { name: 'BTC', amount: 1.23, value: 38314.78, apy: 8.9, change: -2.1 },
      { name: 'USDC', amount: 15000, value: 15000, apy: 15.6, change: 0.1 },
    ],
    vaults: [
      { id: 1, name: 'ETH Yield Vault', deposited: 25.4, apy: 12.4, strategy: 'Compound Lend' },
      { id: 2, name: 'BTC Arbitrage', deposited: 0.8, apy: 18.7, strategy: 'Cross-Chain Arb' },
      { id: 3, name: 'Stablecoin Farm', deposited: 10000, apy: 15.6, strategy: 'Curve LP' },
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Show vault connection prompt if user not connected to vault
  if (user && !user.isConnectedToVault) {
    return (
      <div className="min-h-screen pt-20 pb-12 relative overflow-hidden">
        <FloatingElements />
        <ParticleSystem />
        <PulsingOrb className="top-20 left-20" />
        <PulsingOrb className="bottom-20 right-20" />
        <WaveEffect className="absolute inset-0 opacity-30" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <AlertCircle className="w-16 h-16 mx-auto text-primary floating-element wiggle" />
              <h1 className="text-4xl font-bold text-slide-up font-orbitron">
                <GlitchText text="Vault Connection Required" />
              </h1>
              <p className="text-xl text-muted-foreground text-slide-up">
                <TypewriterText text="Connect to a vault to access your dashboard and start earning yields" />
              </p>
              <div className="mt-4">
                <PulsatingDots />
              </div>
            </div>
            
            <Card className="glass-card max-w-md mx-auto p-8 hover:scale-105 transition-all duration-500">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Get Started</h3>
                  <p className="text-muted-foreground text-sm">
                    Create or connect to an existing vault to begin managing your crypto assets
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full btn-gradient-primary hover:scale-105 transition-all group" size="lg">
                    <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                    Create New Vault
                  </Button>
                  <Button variant="outline" className="w-full hover:scale-105 transition-all glass-morphism" size="lg">
                    <Shield className="w-4 h-4 mr-2" />
                    Connect to Existing Vault
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const scrollingTexts = ['Portfolio Growing', 'Yields Optimizing', 'Risk Managed', 'Profits Flowing'];
  const liveUpdates = ['Live Market Data', 'Real-time Analytics', 'Active Monitoring', 'Smart Alerts'];

  return (
    <div className="min-h-screen pt-20 pb-12 relative overflow-hidden">
      <FloatingElements />
      <ParticleSystem />
      <PulsingOrb className="top-20 left-20" />
      <PulsingOrb className="bottom-40 right-40" />
      <WaveEffect className="absolute inset-0 opacity-20" />
      
      {/* Scrolling ticker at top */}
      <div className="fixed top-16 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-primary/20">
        <ScrollingText 
          texts={liveUpdates}
          className="text-sm text-primary font-mono py-2"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12">
        {/* Enhanced Header */}
        <div className="mb-8 text-slide-up text-center">
          <h1 className="text-4xl font-bold mb-2 font-orbitron">
            Welcome back, <GlitchText text="DeFi Pioneer" />
          </h1>
          <p className="text-muted-foreground mb-4">
            <TypewriterText text="Manage your portfolio and optimize your yields" />
          </p>
          <div className="flex justify-center items-center space-x-4">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <ScrollingText texts={scrollingTexts} className="text-primary font-mono" />
            <PulsatingDots />
          </div>
        </div>

        {/* Enhanced Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Portfolio Value */}
          <Card className="glass-card hover:scale-105 transition-all duration-300 group relative overflow-hidden">
            <WaveEffect className="absolute inset-0 opacity-10" />
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="w-4 h-4 group-hover:text-primary transition-colors group-hover:bounce" />
                Total Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 font-orbitron text-glow">
                <CountingNumber 
                  target={portfolioData.totalValue} 
                  prefix="$" 
                  className="text-primary"
                />
              </div>
              <div className="flex items-center gap-1 text-sm">
                {portfolioData.totalChange > 0 ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span className={portfolioData.totalChange > 0 ? 'text-success' : 'text-destructive'}>
                  {portfolioData.totalChange > 0 ? '+' : ''}{portfolioData.totalChangePercent}%
                </span>
                <span className="text-muted-foreground">24h</span>
              </div>
              <div className="mt-2">
                <Shield className="w-3 h-3 text-green-400 inline mr-1" />
                <span className="text-xs text-green-400">Secured</span>
              </div>
            </CardContent>
          </Card>

          {/* Active Vaults */}
          <Card className="glass-card hover:scale-105 transition-all duration-300 group relative overflow-hidden">
            <WaveEffect className="absolute inset-0 opacity-10" />
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <PieChart className="w-4 h-4 group-hover:text-accent transition-colors group-hover:wiggle" />
                Active Vaults
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 font-orbitron text-glow">
                <CountingNumber 
                  target={portfolioData.vaults.length} 
                  className="text-primary"
                />
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 animate-pulse" />
                <span>Earning yield</span>
              </div>
              <div className="mt-2">
                <Activity className="w-3 h-3 text-yellow-400 inline mr-1 animate-pulse" />
                <span className="text-xs text-yellow-400">Active</span>
              </div>
            </CardContent>
          </Card>

          {/* Average APY */}
          <Card className="glass-card hover:scale-105 transition-all duration-300 group relative overflow-hidden">
            <WaveEffect className="absolute inset-0 opacity-10" />
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="w-4 h-4 group-hover:text-green-400 transition-colors group-hover:bounce" />
                Average APY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 font-orbitron text-glow text-primary">
                15.6%
              </div>
              <div className="flex items-center gap-1 text-sm text-success">
                <ArrowUpRight className="w-4 h-4" />
                <span>Above market</span>
              </div>
              <div className="mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 text-green-400 inline mr-1" />
                <span className="text-xs text-green-400">Trending Up</span>
                <PulsatingDots className="ml-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assets and Vaults */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Asset Breakdown */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Asset Breakdown</span>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {portfolioData.assets.map((asset, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-card/20 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                      {asset.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold">{asset.name}</div>
                      <div className="text-sm text-muted-foreground">{asset.amount} {asset.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(asset.value)}</div>
                    <div className="flex items-center gap-1 text-sm">
                      {asset.change > 0 ? (
                        <ArrowUpRight className="w-3 h-3 text-success" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-destructive" />
                      )}
                      <span className={asset.change > 0 ? 'text-success' : 'text-destructive'}>
                        {asset.change > 0 ? '+' : ''}{asset.change}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Vaults */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Active Vaults</span>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Create Vault
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {portfolioData.vaults.map((vault) => (
                <div key={vault.id} className="p-4 rounded-lg bg-card/20 border border-white/5 hover:bg-card/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{vault.name}</h3>
                    <Badge variant="outline" className="text-success border-success/20">
                      {vault.apy}% APY
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Strategy: {vault.strategy}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Deposited: {vault.deposited}</span>
                    <Button variant="ghost" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}