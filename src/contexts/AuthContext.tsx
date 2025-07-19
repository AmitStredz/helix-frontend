import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MetaMaskSDK } from '@metamask/sdk';

interface User {
  address: string;
  isConnectedToVault: boolean;
}

interface AuthContextType {
  user: User | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  checkVaultConnection: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        infuraAPIKey: 'demo-key', // In production, use real Infura key
      });
      setSdk(metaMaskSDK);
    };

    initSDK();
  }, []);

  const connectWallet = async () => {
    if (!sdk) return;
    
    setIsConnecting(true);
    try {
      const accounts = await sdk.connect();
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        
        // Call backend API to check vault connection (dummy implementation)
        const isConnectedToVault = await checkVaultConnectionAPI(address);
        
        setUser({
          address,
          isConnectedToVault
        });
        
        // Store in localStorage for persistence
        localStorage.setItem('wallet_address', address);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setUser(null);
    localStorage.removeItem('wallet_address');
  };

  const checkVaultConnection = async () => {
    if (!user?.address) return;
    
    try {
      const isConnectedToVault = await checkVaultConnectionAPI(user.address);
      setUser(prev => prev ? { ...prev, isConnectedToVault } : null);
    } catch (error) {
      console.error('Failed to check vault connection:', error);
    }
  };

  // Dummy API call - replace with real backend integration
  const checkVaultConnectionAPI = async (address: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Dummy logic - return true for demo purposes
    // In production, this would check if the address has any active vaults
    return Math.random() > 0.5; // Random for demo
  };

  // Check for existing connection on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('wallet_address');
    if (savedAddress && sdk) {
      // Verify the connection is still valid
      sdk.getProvider()?.request({ method: 'eth_accounts' })
        .then((accounts: any) => {
          if (accounts && accounts.length > 0 && accounts[0] === savedAddress) {
            checkVaultConnectionAPI(savedAddress).then(isConnectedToVault => {
              setUser({ address: savedAddress, isConnectedToVault });
            });
          } else {
            localStorage.removeItem('wallet_address');
          }
        })
        .catch(() => {
          localStorage.removeItem('wallet_address');
        });
    }
  }, [sdk]);

  return (
    <AuthContext.Provider value={{
      user,
      isConnecting,
      connectWallet,
      disconnectWallet,
      checkVaultConnection
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