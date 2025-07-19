import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MetaMaskSDK } from '@metamask/sdk';
import { toast } from "@/components/ui/use-toast";
import { isAddress } from "ethers";

interface User {
  address: string;
  isConnectedToVault: boolean;
  chainId: string;
}

interface AuthContextType {
  user: User | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  checkVaultConnection: () => Promise<void>;
  switchToBNBChain: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// BNB Smart Chain configuration
const BNB_CHAIN_CONFIG = {
  chainId: '0x38', // 56 in decimal
  chainName: 'BNB Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com/'],
};

const BACKEND_API_URL = 'https://api.cryptovault.demo'; // Dummy API URL

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sdk, setSdk] = useState<MetaMaskSDK | null>(null);

  useEffect(() => {
    const initSDK = () => {
      const metaMaskSDK = new MetaMaskSDK({
        dappMetadata: {
          name: 'CryptoVault',
          url: window.location.host,
        },
        // Remove infuraAPIKey as it's not needed for BNB Smart Chain
      });
      setSdk(metaMaskSDK);
    };

    initSDK();
  }, []);

  const getCurrentChainId = async (): Promise<string | null> => {
    if (!sdk?.getProvider()) return null;
    
    try {
      const chainId = await sdk.getProvider()?.request({ 
        method: 'eth_chainId' 
      }) as string;
      return chainId;
    } catch (error) {
      console.error('Failed to get chain ID:', error);
      return null;
    }
  };

  const switchToBNBChain = async (): Promise<void> => {
    if (!sdk?.getProvider()) return;

    try {
      // First try to switch to BNB chain
      await sdk.getProvider()?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BNB_CHAIN_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // If the chain doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await sdk.getProvider()?.request({
            method: 'wallet_addEthereumChain',
            params: [BNB_CHAIN_CONFIG],
          });
        } catch (addError) {
          console.error('Failed to add BNB chain:', addError);
          throw new Error('Failed to add BNB Smart Chain to wallet');
        }
      } else {
        console.error('Failed to switch to BNB chain:', switchError);
        throw new Error('Failed to switch to BNB Smart Chain');
      }
    }
  };

  const validateBNBChain = async (): Promise<boolean> => {
    const currentChainId = await getCurrentChainId();
    return currentChainId === BNB_CHAIN_CONFIG.chainId;
  };

  const connectWallet = async () => {
    if (!sdk) {
      toast({
        title: "Connection Error",
        description: "MetaMask SDK not initialized. Please refresh the page.",
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
          description: "Make sure you are using BNB chain.",
          variant: "destructive"
        });
        return;
      }

      const address = accounts[0];
      
      // Validate address format
      if (!isAddress(address)) {
        toast({
          title: "Invalid Wallet Address",
          description: "Connected address is not valid. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Check if we're on BNB Smart Chain
      const isOnBNBChain = await validateBNBChain();
      
      if (!isOnBNBChain) {
        // Show toast asking to switch to BNB chain
        toast({
          title: "Wrong Network",
          description: "Please switch to BNB Smart Chain to continue.",
          variant: "destructive"
        });

        try {
          await switchToBNBChain();
          
          // Verify the switch was successful
          const isBNBAfterSwitch = await validateBNBChain();
          if (!isBNBAfterSwitch) {
            toast({
              title: "Network Switch Failed",
              description: "Failed to switch to BNB Smart Chain. Please switch manually.",
              variant: "destructive"
            });
            return;
          }

          toast({
            title: "Network Switched",
            description: "Successfully switched to BNB Smart Chain.",
            variant: "default"
          });
        } catch (error) {
          console.error('Chain switch error:', error);
          toast({
            title: "Network Switch Failed",
            description: "Please manually switch to BNB Smart Chain in MetaMask.",
            variant: "destructive"
          });
          return;
        }
      }

      // Get current chain ID for user object
      const chainId = await getCurrentChainId() || BNB_CHAIN_CONFIG.chainId;
      
      // Check vault connection
      const isConnectedToVault = await checkVaultConnectionAPI(address);
      
      const newUser: User = {
        address,
        isConnectedToVault,
        chainId
      };

      setUser(newUser);
      
      // Store in localStorage for persistence
      localStorage.setItem('wallet_address', address);
      localStorage.setItem('wallet_chainId', chainId);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        variant: "default"
      });

    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      
      let errorMessage = "Failed to connect wallet. Please try again.";
      
      if (error.code === 4001) {
        errorMessage = "Connection rejected by user.";
      } else if (error.code === -32002) {
        errorMessage = "Connection request is already pending. Please check MetaMask.";
      }
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setUser(null);
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('wallet_chainId');
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
      variant: "default"
    });
  };

  const checkVaultConnection = async () => {
    if (!user?.address) return;
    
    try {
      const isConnectedToVault = await checkVaultConnectionAPI(user.address);
      setUser(prev => prev ? { ...prev, isConnectedToVault } : null);
    } catch (error) {
      console.error('Failed to check vault connection:', error);
      toast({
        title: "Connection Check Failed",
        description: "Failed to check vault connection status.",
        variant: "destructive"
      });
    }
  };

  // Dummy API call - replace with real backend integration
  const checkVaultConnectionAPI = async (address: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, make actual API call:
      // const response = await fetch(`${BACKEND_API_URL}/vault/check/${address}`);
      // const data = await response.json();
      // return data.isConnected;
      
      // Dummy logic for demo
      return Math.random() > 0.5;
    } catch (error) {
      console.error('API call failed:', error);
      return false;
    }
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      const savedAddress = localStorage.getItem('wallet_address');
      const savedChainId = localStorage.getItem('wallet_chainId');
      
      if (savedAddress && sdk) {
        try {
          // Check if MetaMask still has this account connected
          const accounts = await sdk.getProvider()?.request({ 
            method: 'eth_accounts' 
          }) as string[];
          
          if (accounts && accounts.length > 0 && accounts[0] === savedAddress) {
            // Verify we're still on BNB chain
            const currentChainId = await getCurrentChainId();
            
            if (currentChainId === BNB_CHAIN_CONFIG.chainId) {
              const isConnectedToVault = await checkVaultConnectionAPI(savedAddress);
              setUser({ 
                address: savedAddress, 
                isConnectedToVault,
                chainId: currentChainId
              });
            } else {
              // Wrong chain, clear stored data
              localStorage.removeItem('wallet_address');
              localStorage.removeItem('wallet_chainId');
              toast({
                title: "Wrong Network",
                description: "Please connect to BNB Smart Chain to restore your session.",
                variant: "destructive"
              });
            }
          } else {
            // Account no longer connected, clear stored data
            localStorage.removeItem('wallet_address');
            localStorage.removeItem('wallet_chainId');
          }
        } catch (error) {
          console.error('Failed to check existing connection:', error);
          localStorage.removeItem('wallet_address');
          localStorage.removeItem('wallet_chainId');
        }
      }
    };

    if (sdk) {
      checkExistingConnection();
    }
  }, [sdk]);

  // Listen for account and chain changes
  useEffect(() => {
    if (!sdk?.getProvider()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        disconnectWallet();
      } else if (user && accounts[0] !== user.address) {
        // User switched accounts
        disconnectWallet();
        toast({
          title: "Account Changed",
          description: "Please reconnect with the new account.",
          variant: "default"
        });
      }
    };

    const handleChainChanged = async (chainId: string) => {
      if (user) {
        if (chainId !== BNB_CHAIN_CONFIG.chainId) {
          // User switched away from BNB chain
          toast({
            title: "Wrong Network",
            description: "Please switch back to BNB Smart Chain to continue using the app.",
            variant: "destructive"
          });
          setUser(prev => prev ? { ...prev, chainId } : null);
        } else {
          // User switched back to BNB chain
          setUser(prev => prev ? { ...prev, chainId } : null);
          toast({
            title: "Network Restored",
            description: "You're now connected to BNB Smart Chain.",
            variant: "default"
          });
        }
      }
    };

    // Add event listeners
    sdk.getProvider()?.on('accountsChanged', handleAccountsChanged);
    sdk.getProvider()?.on('chainChanged', handleChainChanged);

    // Cleanup
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
      disconnectWallet,
      checkVaultConnection,
      switchToBNBChain
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