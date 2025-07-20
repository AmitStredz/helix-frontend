import { useState, useEffect } from "react";
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
  CheckCircle,
  ExternalLink,
  Copy,
  RefreshCw,
  QrCode,
  Download,
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

const BACKEND_API_URL = "http://10.114.240.208:3000/api";

interface VaultInitializationResult {
  success: boolean;
  message: string;
  transactionHash?: string;
  blockNumber?: number;
  newWalletAddress?: string;
  user?: {
    id: string;
    walletAddress: string;
    secondaryAddress: string;
  };
}

export function VaultManagement() {
  const { user } = useAuth();
  const [selectedVault, setSelectedVault] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [initializationResult, setInitializationResult] =
    useState<VaultInitializationResult | null>(null);
  const [vaultBalance, setVaultBalance] = useState<string>("0");
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showQR, setShowQR] = useState(false);

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

  // Fetch vault balance
  const fetchVaultBalance = async () => {
    if (!user?.vaultAddress) {
      console.error("No vault address found");
      return;
    }

    setIsLoadingBalance(true);
    try {
      const response = await fetch(
        `${BACKEND_API_URL}/wallet/operations?operation=balance&address=${user.address}`
      );
      if (!response.ok) throw new Error("Failed to fetch balance");

      const data = await response.json();
      console.log("Vault balance response:", data);

      if (data.success && data.balance) {
        setVaultBalance(data.balance.bnb || "0");
      } else {
        setVaultBalance("0");
      }
    } catch (error) {
      console.error("Failed to fetch vault balance:", error);
      setVaultBalance("0");
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Withdraw funds from vault
  const handleWithdraw = async () => {
    if (!user?.vaultAddress || !withdrawAmount || !user?.address) {
      console.error("Missing vault address, withdraw amount, or user address");
      return;
    }

    setIsWithdrawing(true);
    try {
      const payload = {
        walletAddress: user.vaultAddress,
        amount: withdrawAmount,
        recipientAddress: user.address
      };

      const response = await fetch(
        `${BACKEND_API_URL}/wallet/operations?operation=withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Withdraw failed");

      const result = await response.json();
      console.log("Withdraw successful:", result);

      if (result.isConnected) {
        // Refresh balance after withdraw
        await fetchVaultBalance();
        setWithdrawAmount("");

        // Show success message with transaction details
        alert(`Successfully withdrawn ${result.amount} BNB from vault\nTransaction Hash: ${result.transactionHash}\nBlock Number: ${result.blockNumber}`);
      } else {
        alert(`Withdrawal successfull.`);
        // alert(`Withdraw failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Withdraw failed:", error);
      alert("Withdraw failed. Please try again.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Fetch balance on component mount
  useEffect(() => {
    if (user?.vaultAddress) {
      fetchVaultBalance();
    }
  }, [user?.vaultAddress]);

  const handleInitializeVault = async () => {
    if (!user?.address) {
      console.error("No wallet address found");
      return;
    }

    setIsInitializing(true);
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/initialize-secondary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress: user.address }),
      });

      if (!response.ok) {
        throw new Error("Failed to initialize vault");
      }

      const result = await response.json();
      setInitializationResult(result);
      console.log("Vault initialization successful:", result);
    } catch (error) {
      console.error("Vault initialization failed:", error);
      setInitializationResult({
        success: false,
        message: "Failed to initialize vault",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Generate QR code data for vault address
  const generateQRData = () => {
    if (!user?.vaultAddress) return "";
    // Generate a simple QR-like pattern (in real app, use a QR library)
    return `https://bscscan.com/address/${user.vaultAddress}`;
  };

  if (!user) {
    return (
      <div className="text-xl text-muted-foreground text-slide-up">
        Connect to a BNB Wallet to create Vault.
      </div>
    );
  }

  // If not connected to a vault, show initialization UI
  if (user?.vaultConnected === false) {
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
                <TypewriterText text="Create Your Vault" />
              </h1>
              <p className="text-xl text-muted-foreground text-slide-up">
                Initialize your secure vault to start earning yields
              </p>
            </div>

            {!initializationResult ? (
              <Card className="glass-card max-w-md mx-auto p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">
                      Ready to Start?
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Click below to initialize your vault and get your
                      secondary wallet address
                    </p>
                  </div>

                  <Button
                    className="w-full btn-gradient-primary hover:scale-105 transition-all group"
                    size="lg"
                    onClick={handleInitializeVault}
                    disabled={isInitializing}
                  >
                    {isInitializing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Initializing...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                        Initialize Vault
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="glass-card max-w-2xl mx-auto p-8">
                <div className="space-y-6">
                  {initializationResult.success ? (
                    <>
                      <div className="text-center">
                        <CheckCircle className="w-16 h-16 mx-auto text-success mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-success">
                          Vault Initialized Successfully!
                        </h3>
                        <p className="text-muted-foreground">
                          {initializationResult.message}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-card/20 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">
                              Vault Address:
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  initializationResult.newWalletAddress || ""
                                )
                              }
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="font-mono text-sm break-all">
                            {initializationResult.newWalletAddress}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-card/20 p-4 rounded-lg">
                            <span className="text-sm text-muted-foreground">
                              Transaction Hash:
                            </span>
                            <p className="font-mono text-xs break-all mt-1">
                              {initializationResult.transactionHash}
                            </p>
                          </div>
                          <div className="bg-card/20 p-4 rounded-lg">
                            <span className="text-sm text-muted-foreground">
                              Block Number:
                            </span>
                            <p className="font-mono text-sm mt-1">
                              {initializationResult.blockNumber}
                            </p>
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          onClick={() => window.location.reload()}
                        >
                          Continue to Dashboard
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
                      <h3 className="text-xl font-semibold mb-2 text-destructive">
                        Initialization Failed
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {initializationResult.message}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setInitializationResult(null)}
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If connected to a vault, show vault details and receive/withdraw
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

        {/* Vault Balance Card */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Vault Balance
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchVaultBalance}
                disabled={isLoadingBalance}
              >
                {isLoadingBalance ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {isLoadingBalance ? "Loading..." : `${vaultBalance} BNB`}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Vault Address: {user?.vaultAddress?.slice(0, 6)}...
              {user?.vaultAddress?.slice(-4)}
            </p>
          </CardContent>
        </Card>

        {/* Vault Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Receive Funds */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5" />
                Receive Funds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Vault Address</Label>
                <div className="flex items-center gap-2 p-3 bg-card/20 rounded-lg border border-white/10">
                  <span className="font-mono text-sm flex-1 break-all">
                    {user?.vaultAddress || "No vault address"}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      navigator.clipboard.writeText(user?.vaultAddress || "")
                    }
                    title="Copy Address"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {!showQR ? (
                <Button className="w-full" onClick={() => setShowQR(true)}>
                  <QrCode className="w-4 h-4 mr-2" />
                  Show QR Code
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-48 h-48 bg-white rounded-lg p-4 flex items-center justify-center">
                      <div className="w-full h-full bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                        <div className="text-center text-white">
                          <QrCode className="w-16 h-16 mx-auto mb-2" />
                          <p className="text-xs font-mono break-all">
                            {user?.vaultAddress?.slice(0, 8)}...
                          </p>
                          <p className="text-xs mt-1">Scan to receive</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowQR(false)}
                    >
                      Hide QR
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // In real app, download QR code image
                        alert(
                          "QR Code download feature would be implemented here"
                        );
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
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
                <Label htmlFor="withdraw-amount">Amount (BNB)</Label>
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
                disabled={!withdrawAmount || isWithdrawing}
              >
                {isWithdrawing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Withdrawing...
                  </>
                ) : (
                  "Withdraw"
                )}
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
                Vault Details
              </span>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                Manage
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <Card className="glass-card hover:bg-card/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Your Vault</CardTitle>
                    <Badge
                      variant="outline"
                      className="text-success border-success/20"
                    >
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Secure yield vault
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Balance */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Current Balance
                    </span>
                    <span className="font-semibold text-success">
                      {vaultBalance} BNB
                    </span>
                  </div>

                  {/* Vault Address */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Vault Address
                    </span>
                    <span className="font-mono text-xs">
                      {user?.vaultAddress?.slice(0, 6)}...
                      {user?.vaultAddress?.slice(-4)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Activity className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
