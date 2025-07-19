import { useState } from "react";
import { ConnectWallet } from "./ConnectWallet";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "dashboard" },
  { name: "Vaults", href: "vaults" },
  { name: "Trade", href: "trade" },
  { name: "Analytics", href: "analytics" },
];

interface NavbarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function Navbar({
  activeSection = "hero",
  onSectionChange,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onSectionChange?.("")}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center pulse-glow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Helix
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* <button
              onClick={() => onSectionChange?.('hero')}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium cursor-pointer",
                activeSection === 'hero' && "text-primary"
              )}
            >
              Home
            </button> */}
            {user &&
              navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => onSectionChange?.(item.href)}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium cursor-pointer",
                    activeSection === item.href && "text-primary"
                  )}
                >
                  {item.name}
                </button>
              ))}
          </div>

          {/* Connect Wallet */}
          <div className="hidden md:block">
            <ConnectWallet />
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 overflow-hidden",
            mobileMenuOpen ? "max-h-screen pb-4" : "max-h-0"
          )}
        >
          <div className="space-y-4 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                onSectionChange?.("hero");
                setMobileMenuOpen(false);
              }}
              className={cn(
                "block text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium",
                activeSection === "hero" && "text-primary"
              )}
            >
              Home
            </button>
            {user &&
              navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    onSectionChange?.(item.href);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "block text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium",
                    activeSection === item.href && "text-primary"
                  )}
                >
                  {item.name}
                </button>
              ))}
            <div className="pt-4">
              <ConnectWallet />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
