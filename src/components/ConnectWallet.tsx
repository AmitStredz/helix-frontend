import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ConnectWalletProps {
  className?: string;
}

export function ConnectWallet({ className }: ConnectWalletProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0.00');

  const handleConnect = async () => {
    // Dummy connection logic
    const dummyAddress = '0x742d35Cc6484C312B5c4e0bD9e6dF2f00FB7e88B';
    const dummyBalance = '2.4567';
    
    setAddress(dummyAddress);
    setBalance(dummyBalance);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress('');
    setBalance('0.00');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <Button 
        variant="connect" 
        size="lg" 
        onClick={handleConnect}
        className={className}
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="glass" 
          size="lg" 
          className={className}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="font-mono">{formatAddress(address)}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 glass-card border-white/10 bg-card/90 backdrop-blur-xl">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Connected Wallet</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="text-xs text-success">Connected</span>
            </div>
          </div>
          <div className="font-mono text-sm">{formatAddress(address)}</div>
          <div className="text-lg font-semibold mt-2">
            {balance} ETH
          </div>
        </div>
        
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          <Copy className="w-4 h-4 mr-2" />
          Copy Address
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleDisconnect} 
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}