import { Button } from '@/components/ui/button';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface ConnectWalletProps {
  className?: string;
}

export function ConnectWallet({ className }: ConnectWalletProps) {
  const { user, isConnecting, connectWallet, disconnectWallet } = useAuth();

  const copyAddress = () => {
    if (user?.address) {
      navigator.clipboard.writeText(user.address);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!user) {
    return (
      <Button 
        variant="outline" 
        size="lg" 
        onClick={connectWallet}
        disabled={isConnecting}
        className={`${className} border-primary text-primary hover:bg-primary hover:text-primary-foreground`}
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="lg" 
          className={`${className} border-primary/20 bg-primary/10 text-foreground hover:bg-primary/20`}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="font-mono">{formatAddress(user.address)}</span>
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
          <div className="font-mono text-sm">{formatAddress(user.address)}</div>
          <div className="text-lg font-semibold mt-2">
            2.45 ETH
          </div>
          {user.isConnectedToVault && (
            <div className="text-xs text-primary mt-1">
              ✓ Vault Connected
            </div>
          )}
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
          onClick={disconnectWallet} 
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}