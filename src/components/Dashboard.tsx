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
  Shield,
  Copy,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedText, CountingNumber, TypewriterText } from './AnimatedText';
import { FloatingElements, PulsingOrb } from './FloatingElements';
import { ScrollingText, GlitchText } from './ScrollingText';
import { ParticleSystem, PulsatingDots, WaveEffect } from './InteractiveElements';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export function Dashboard() {
  const { user } = useAuth();

  // Compact Wallet Details Card
  const renderWalletDetails = () => {
    if (!user) return null;
    return (
      <Card className="mb-6 max-w-2xl mx-auto p-3 rounded-xl shadow flex flex-col md:flex-row items-center gap-4 bg-card/80 border border-primary/10">
        <Shield className="w-8 h-8 text-primary shrink-0" />
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Address</span>
            <span className="font-mono truncate flex items-center gap-1">
              {user.address.slice(0, 6)}...{user.address.slice(-4)}
              <Button size="icon" variant="ghost" onClick={() => navigator.clipboard.writeText(user.address)} title="Copy Address">
                <Copy className="w-3 h-3" />
              </Button>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">BNB Balance</span>
            <span className="font-mono flex items-center gap-1">
              {user.balance} BNB
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Network</span>
            <span className="font-mono">
              {user.chainId === '0x38' ? 'BNB Smart Chain' : user.chainId === '0x1' ? 'Ethereum Mainnet' : user.chainId}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Chain ID</span>
            <span className="font-mono">{user.chainId}</span>
          </div>
        </div>
      </Card>
    );
  };

  const scrollingTexts = ['Portfolio Growing', 'Yields Optimizing', 'Risk Managed', 'Profits Flowing'];
  const liveUpdates = ['Live Market Data', 'Real-time Analytics', 'Active Monitoring', 'Smart Alerts'];

  return (
    <div className="min-h-screen pt-32 pb-12 relative overflow-hidden">
      <FloatingElements />
      <ParticleSystem />
      <PulsingOrb className="top-20 left-20" />
      <PulsingOrb className="bottom-40 right-40" />
      <WaveEffect className="absolute inset-0 opacity-20" />
      {/* Wallet Details Card */}
      {renderWalletDetails()}
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
                  target={125847.23} 
                  prefix="$" 
                  className="text-primary"
                />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-success">+8.7%</span>
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
                  target={3} 
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
              {/* This section needs to be updated to reflect the new portfolioData structure */}
              {/* For now, it will show a placeholder or be removed if portfolioData is removed */}
              <div className="text-center py-8">
                <p>Asset Breakdown data not available in this version.</p>
              </div>
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
              {/* This section needs to be updated to reflect the new portfolioData structure */}
              {/* For now, it will show a placeholder or be removed if portfolioData is removed */}
              <div className="text-center py-8">
                <p>Active Vaults data not available in this version.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}