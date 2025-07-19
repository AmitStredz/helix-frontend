import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Settings,
  TrendingUp,
  Shield,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Percent,
  Users,
  Activity,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { TypewriterText } from "./AnimatedText";
import { FloatingElements, PulsingOrb } from "./FloatingElements";

export function VaultManagement() {
  const { user } = useAuth();
  const [selectedVault, setSelectedVault] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const vaults = [
    {
      id: 1,
      name: "ETH Maximum Yield",
      strategy: "Compound Lending + Uniswap LP",
      apy: 12.4,
      tvl: 2500000,
      deposited: 25.4,
      shares: 1847.23,
      risk: "Medium",
      status: "Active",
    },
    {
      id: 2,
      name: "BTC Cross-Chain Arbitrage",
      strategy: "Multi-Chain Arbitrage",
      apy: 18.7,
      tvl: 1200000,
      deposited: 0.8,
      shares: 892.45,
      risk: "High",
      status: "Active",
    },
    {
      id: 3,
      name: "Stablecoin Farming",
      strategy: "Curve LP + Convex",
      apy: 15.6,
      tvl: 5000000,
      deposited: 10000,
      shares: 10156.78,
      risk: "Low",
      status: "Active",
    },
  ];

  const strategies = [
    {
      name: "Compound Lending",
      risk: "Low",
      apy: "8-12%",
      description: "Lend assets on Compound protocol",
    },
    {
      name: "Uniswap LP",
      risk: "Medium",
      apy: "15-25%",
      description: "Provide liquidity to Uniswap pools",
    },
    {
      name: "Cross-Chain Arbitrage",
      risk: "High",
      apy: "20-35%",
      description: "Arbitrage opportunities across chains",
    },
    {
      name: "Curve LP + Convex",
      risk: "Low",
      apy: "12-18%",
      description: "Stable LP with boosted rewards",
    },
  ];

  const handleDeposit = () => {
    // Dummy deposit logic
    console.log("Depositing", depositAmount, "to vault", selectedVault);
  };

  const handleWithdraw = () => {
    // Dummy withdraw logic
    console.log("Withdrawing", withdrawAmount, "from vault", selectedVault);
  };

  const handleInitializeVault = () => {
    // Dummy vault initialization logic
    console.log("Initializing new vault");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!user) {
    return (
      <div className="text-xl text-muted-foreground text-slide-up">
        Connect to a BNB Wallet to create Vault.
      </div>
    );
  }

  // If not connected to a vault, prompt to initialize
  if (user?.isConnectedToVault === false) {
    return (
      <div className="min-h-screen pt-20 pb-12 relative overflow-hidden">
        <FloatingElements />
        <PulsingOrb className="top-20 left-20" />
        <PulsingOrb className="bottom-20 right-20" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Shield className="w-16 h-16 mx-auto text-primary floating-element" />
              <h1 className="text-4xl font-bold text-slide-up">
                <TypewriterText text="Create Your First Vault" />
              </h1>
              <p className="text-xl text-muted-foreground text-slide-up">
                Set up a secure vault to start earning yields on your crypto assets
              </p>
            </div>

            <Card className="glass-card max-w-lg mx-auto p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    Choose Your Strategy
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Select a yield strategy that matches your risk tolerance
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    "Low Risk - Stable Yields",
                    "Medium Risk - Balanced",
                    "High Risk - Maximum Returns",
                  ].map((strategy, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full h-auto p-4 text-left hover:bg-primary/10"
                    >
                      <div>
                        <div className="font-medium">{strategy}</div>
                        <div className="text-sm text-muted-foreground">
                          {index === 0 && "8-12% APY"}
                          {index === 1 && "12-18% APY"}
                          {index === 2 && "18-35% APY"}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // If connected to a vault, show vault details and deposit/withdraw
  return (
    <div className="min-h-screen pt-20 pb-12 relative overflow-hidden">
      <FloatingElements />
      <PulsingOrb className="top-20 left-20" />
      <PulsingOrb className="bottom-40 right-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 text-slide-up">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Vault Management
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and optimize your crypto vaults
          </p>
        </div>

        {/* Vault Actions (no initialize vault card) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Deposit Funds */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5" />
                Deposit Funds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vault-select">Select Vault</Label>
                <Select value={selectedVault} onValueChange={setSelectedVault}>
                  <SelectTrigger className="glass-card border-white/10">
                    <SelectValue placeholder="Choose vault" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    {vaults.map((vault) => (
                      <SelectItem key={vault.id} value={vault.id.toString()}>
                        {vault.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deposit-amount">Amount</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="glass-card border-white/10"
                />
              </div>
              <Button
                className="w-full btn-gradient-accent"
                onClick={handleDeposit}
                disabled={!selectedVault || !depositAmount}
              >
                Deposit
              </Button>
            </CardContent>
          </Card>

          {/* Withdraw Funds */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5" />
                Withdraw Funds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vault-select-withdraw">Select Vault</Label>
                <Select>
                  <SelectTrigger className="glass-card border-white/10">
                    <SelectValue placeholder="Choose vault" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    {vaults.map((vault) => (
                      <SelectItem key={vault.id} value={vault.id.toString()}>
                        {vault.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="withdraw-amount">Amount</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="glass-card border-white/10"
                />
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleWithdraw}
                disabled={!withdrawAmount}
              >
                Withdraw
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Active Vaults */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Active Vaults
              </span>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                Manage All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {vaults.map((vault) => (
                <Card
                  key={vault.id}
                  className="glass-card hover:bg-card/30 transition-colors"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{vault.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={`${
                          vault.risk === "Low"
                            ? "text-success border-success/20"
                            : vault.risk === "Medium"
                            ? "text-accent border-accent/20"
                            : "text-destructive border-destructive/20"
                        }`}
                      >
                        {vault.risk} Risk
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {vault.strategy}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* APY */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">APY</span>
                      <span className="font-semibold text-success">
                        {vault.apy}%
                      </span>
                    </div>

                    {/* TVL */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">TVL</span>
                      <span className="font-semibold">
                        {formatCurrency(vault.tvl)}
                      </span>
                    </div>

                    {/* Your Deposit */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Your Deposit
                      </span>
                      <span className="font-semibold">{vault.deposited}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Utilization
                        </span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Manage
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Activity className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
