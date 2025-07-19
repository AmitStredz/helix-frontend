import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MetaMaskSDK } from '@metamask/sdk';
import { toast } from "@/components/ui/use-toast";
import { isAddress, formatEther, BrowserProvider } from "ethers";

interface User {
  address: string;
  isConnectedToVault: boolean;
  chainId: string;
  balance: string;
  vaultConnected: boolean;
  vaultAddress: string | null;
}

interface AuthContextType {
  user: User | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

interface VaultConnectionResult {
  isConnected: boolean;
  secondaryAddress: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// BNB Smart Chain configuration
const BNB_CHAIN_ID = '0x38'; // 56 in decimal
const BACKEND_API_URL = 'http://192.168.1.248:3000/api'; // Replace with your real backend URL

// Real API call to check vault connection
const checkVaultConnectionAPI = async (address: string, returnFullData = false): Promise<boolean | VaultConnectionResult> => {
  if (!address) {
    console.log("wallet address not found.");
  }
  try {
    const response = await fetch(`${BACKEND_API_URL}/users/check?walletAddress=${address}`);
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    console.log("data: ", data);
    if (returnFullData) return data.isConnected ? { isConnected: true, secondaryAddress: data.user.secondaryAddress } : { isConnected: false, secondaryAddress: null };
    return !!data.isConnected;
  } catch (error) {
    console.error('API call failed:', error);
    return returnFullData ? { isConnected: false, secondaryAddress: null } : false;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sdk, setSdk] = useState<MetaMaskSDK | null>(null);

  // Initialize MetaMask SDK
  useEffect(() => {
    const metaMaskSDK = new MetaMaskSDK({
      dappMetadata: {
        name: 'CryptoVault',
        url: window.location.host,
      },
    });
    setSdk(metaMaskSDK);
  }, []);

  // Get current chain ID
  const getCurrentChainId = async (): Promise<string | null> => {
    if (!sdk?.getProvider()) return null;
    try {
      return await sdk.getProvider()?.request({ method: 'eth_chainId' }) as string;
    } catch (error) {
      console.error('Failed to get chain ID:', error);
      return null;
    }
  };

  // Get wallet balance
  const getBalance = async (address: string): Promise<string> => {
    try {
      const provider = new BrowserProvider(sdk!.getProvider());
      const balance = await provider.getBalance(address);
      return formatEther(balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      return '0';
    }
  };

  // Check if on BNB chain
  const isOnBNBChain = async (): Promise<boolean> => {
    const chainId = await getCurrentChainId();
    return chainId === BNB_CHAIN_ID;
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!sdk) {
      toast({
        title: "Error",
        description: "MetaMask not initialized",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);

    try {
      // Connect to MetaMask
      const accounts = await sdk.connect();
      
      if (!accounts || accounts.length === 0) {
        toast({
          title: "Connection Failed",
          description: "No accounts found",
          variant: "destructive"
        });
        return;
      }

      const address = accounts[0];

      // Validate address
      if (!isAddress(address)) {
        toast({
          title: "Invalid Address",
          description: "Connected address is not valid",
          variant: "destructive"
        });
        return;
      }

      // Check if on BNB chain
      if (!(await isOnBNBChain())) {
        toast({
          title: "Wrong Network",
          description: "Please connect to BNB Smart Chain",
          variant: "destructive"
        });
        return;
      }

      // Get wallet data
      const chainId = await getCurrentChainId() || BNB_CHAIN_ID;
      const balance = await getBalance(address);

      // Fetch vault connection status from backend
      const vaultData = await checkVaultConnectionAPI(address, true);
      let isConnectedToVault = false;
      let vaultConnected = false;
      let vaultAddress: string | null = null;
      if (typeof vaultData === 'object' && vaultData !== null && 'isConnected' in vaultData) {
        isConnectedToVault = !!vaultData.isConnected;
        vaultConnected = !!vaultData.isConnected;
        vaultAddress = vaultData.isConnected ? vaultData.secondaryAddress : null;
      }
      const newUser: User = {
        address,
        isConnectedToVault,
        chainId,
        balance,
        vaultConnected,
        vaultAddress
      };

      setUser(newUser);

      // Save to localStorage
      localStorage.setItem('wallet_address', address);

      toast({
        title: "Connected",
        description: `Wallet ${address.slice(0, 6)}...${address.slice(-4)} connected`,
        variant: "default"
      });

    } catch (error: unknown) {
      console.error('Connection failed:', error);
      
      let message = "Failed to connect wallet";
      if (typeof error === "object" && error && "code" in error && (error as { code: number }).code === 4001) {
        message = "Connection rejected by user";
      } else if (typeof error === "object" && error && "code" in error && (error as { code: number }).code === -32002) {
        message = "Connection request pending in MetaMask";
      }

      toast({
        title: "Connection Failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setUser(null);
    localStorage.removeItem('wallet_address');
    
    toast({
      title: "Disconnected",
      description: "Wallet disconnected",
      variant: "default"
    });
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const savedAddress = localStorage.getItem('wallet_address');
      
      if (savedAddress && sdk) {
        try {
          const accounts = await sdk.getProvider()?.request({ 
            method: 'eth_accounts' 
          }) as string[];
          
          if (accounts && accounts.length > 0 && accounts[0] === savedAddress) {
            if (await isOnBNBChain()) {
              const chainId = await getCurrentChainId() || BNB_CHAIN_ID;
              const balance = await getBalance(savedAddress);
              
              // Fetch vault connection status from backend
              const vaultData = await checkVaultConnectionAPI(savedAddress, true);
              let isConnectedToVault = false;
              let vaultConnected = false;
              let vaultAddress: string | null = null;
              if (typeof vaultData === 'object' && vaultData !== null && 'isConnected' in vaultData) {
                isConnectedToVault = !!vaultData.isConnected;
                vaultConnected = !!vaultData.isConnected;
                vaultAddress = vaultData.isConnected ? vaultData.secondaryAddress : null;
              }
              setUser({
                address: savedAddress,
                isConnectedToVault,
                chainId,
                balance,
                vaultConnected,
                vaultAddress
              });
            } else {
              localStorage.removeItem('wallet_address');
            }
          } else {
            localStorage.removeItem('wallet_address');
          }
        } catch (error) {
          console.error('Failed to restore connection:', error);
          localStorage.removeItem('wallet_address');
        }
      }
    };

    if (sdk) {
      checkConnection();
    }
  }, [sdk]);

  // Listen for account changes
  useEffect(() => {
    if (!sdk?.getProvider()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0 || (user && accounts[0] !== user.address)) {
        disconnectWallet();
      }
    };

    const handleChainChanged = (chainId: string) => {
      if (user && chainId !== BNB_CHAIN_ID) {
        toast({
          title: "Wrong Network",
          description: "Please switch to BNB Smart Chain",
          variant: "destructive"
        });
        disconnectWallet();
      }
    };

    sdk.getProvider()?.on('accountsChanged', handleAccountsChanged);
    sdk.getProvider()?.on('chainChanged', handleChainChanged);

    return () => {
      sdk.getProvider()?.removeListener('accountsChanged', handleAccountsChanged);
      sdk.getProvider()?.removeListener('chainChanged', handleChainChanged);
    };
  }, [sdk, user]);

  return (
    <AuthContext.Provider value={{
      user,
      isConnecting,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}