import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpDown, 
  TrendingUp, 
  Zap, 
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Trading() {
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', price: 1924.56, balance: 45.67 },
    { symbol: 'BTC', name: 'Bitcoin', price: 31245.78, balance: 1.23 },
    { symbol: 'USDC', name: 'USD Coin', price: 1.00, balance: 15000 },
    { symbol: 'USDT', name: 'Tether', price: 1.00, balance: 8500 },
    { symbol: 'DAI', name: 'Dai Stablecoin', price: 0.999, balance: 2500 },
  ];

  const arbitrageOpportunities = [
    {
      id: 1,
      pair: 'ETH/USDC',
      profit: 245.67,
      profitPercent: 1.24,
      route: 'Uniswap → Sushiswap',
      confidence: 94,
      estimatedGas: 0.008
    },
    {
      id: 2,
      pair: 'BTC/ETH',
      profit: 127.34,
      profitPercent: 0.89,
      route: 'Balancer → Curve',
      confidence: 87,
      estimatedGas: 0.012
    },
    {
      id: 3,
      pair: 'USDC/DAI',
      profit: 89.12,
      profitPercent: 2.14,
      route: 'Curve → 1inch',
      confidence: 98,
      estimatedGas: 0.005
    }
  ];

  const recentTrades = [
    {
      id: 1,
      type: 'Arbitrage',
      pair: 'ETH/USDC',
      amount: 10.5,
      profit: 125.67,
      status: 'completed',
      timestamp: '2 min ago'
    },
    {
      id: 2,
      type: 'Swap',
      pair: 'BTC/ETH',
      amount: 0.5,
      profit: 45.23,
      status: 'pending',
      timestamp: '5 min ago'
    },
    {
      id: 3,
      type: 'Arbitrage',
      pair: 'USDC/DAI',
      amount: 5000,
      profit: 67.89,
      status: 'completed',
      timestamp: '8 min ago'
    }
  ];

  const handleSwap = async () => {
    setIsExecuting(true);
    // Dummy swap logic
    setTimeout(() => {
      setIsExecuting(false);
    }, 3000);
  };

  const handleArbitrage = async (opportunityId: number) => {
    // Dummy arbitrage execution
    console.log('Executing arbitrage for opportunity:', opportunityId);
  };

  const getFromTokenData = () => tokens.find(t => t.symbol === fromToken) || tokens[0];
  const getToTokenData = () => tokens.find(t => t.symbol === toToken) || tokens[0];

  const calculateToAmount = () => {
    if (!fromAmount) return '0.00';
    const fromTokenData = getFromTokenData();
    const toTokenData = getToTokenData();
    const amount = parseFloat(fromAmount) * (fromTokenData.price / toTokenData.price);
    return amount.toFixed(6);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trading & Arbitrage</h1>
          <p className="text-muted-foreground">Execute swaps and capture arbitrage opportunities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trading Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Swap Interface */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="w-5 h-5" />
                  Token Swap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* From Token */}
                <div className="space-y-2">
                  <Label>From</Label>
                  <div className="flex gap-3">
                    <Select value={fromToken} onValueChange={setFromToken}>
                      <SelectTrigger className="w-32 glass-card border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/10">
                        {tokens.map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            {token.symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="flex-1 glass-card border-white/10"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Balance: {getFromTokenData().balance} {fromToken}
                  </div>
                </div>

                {/* Swap Direction */}
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full glass-card"
                    onClick={() => {
                      const temp = fromToken;
                      setFromToken(toToken);
                      setToToken(temp);
                    }}
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </Button>
                </div>

                {/* To Token */}
                <div className="space-y-2">
                  <Label>To</Label>
                  <div className="flex gap-3">
                    <Select value={toToken} onValueChange={setToToken}>
                      <SelectTrigger className="w-32 glass-card border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/10">
                        {tokens.map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            {token.symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={calculateToAmount()}
                      readOnly
                      className="flex-1 glass-card border-white/10 bg-muted/20"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Balance: {getToTokenData().balance} {toToken}
                  </div>
                </div>

                {/* Swap Details */}
                <div className="space-y-2 p-3 rounded-lg bg-card/20 border border-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Exchange Rate</span>
                    <span>1 {fromToken} = {(getFromTokenData().price / getToTokenData().price).toFixed(6)} {toToken}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Slippage</span>
                    <span>0.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gas Fee</span>
                    <span>~$12.45</span>
                  </div>
                </div>

                <Button 
                  className="w-full btn-gradient-primary"
                  onClick={handleSwap}
                  disabled={!fromAmount || isExecuting}
                >
                  {isExecuting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      Executing Swap...
                    </>
                  ) : (
                    'Execute Swap'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Arbitrage Opportunities */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Arbitrage Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {arbitrageOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="flex items-center justify-between p-4 rounded-lg bg-card/20 border border-white/5">
                      <div className="space-y-1">
                        <div className="font-semibold">{opportunity.pair}</div>
                        <div className="text-sm text-muted-foreground">{opportunity.route}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-success border-success/20">
                            +${opportunity.profit.toFixed(2)}
                          </Badge>
                          <Badge variant="outline">
                            {opportunity.profitPercent}%
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Confidence: {opportunity.confidence}%
                        </div>
                        <Button 
                          size="sm" 
                          className="btn-gradient-accent"
                          onClick={() => handleArbitrage(opportunity.id)}
                        >
                          Execute
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trading Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Trading Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Volume</span>
                  <span className="font-semibold">$12,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Profit</span>
                  <span className="font-semibold text-success">+$567.89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-semibold">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Slippage</span>
                  <span className="font-semibold">0.3%</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Trades */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Recent Trades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-3 rounded-lg bg-card/20 border border-white/5">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{trade.pair}</div>
                      <div className="text-xs text-muted-foreground">{trade.timestamp}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-1">
                        {trade.status === 'completed' ? (
                          <CheckCircle className="w-3 h-3 text-success" />
                        ) : trade.status === 'pending' ? (
                          <Clock className="w-3 h-3 text-accent" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-destructive" />
                        )}
                        <span className="text-xs text-success">+${trade.profit.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{trade.type}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}