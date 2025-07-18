import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Dashboard } from '@/components/Dashboard';
import { VaultManagement } from '@/components/VaultManagement';
import { Trading } from '@/components/Trading';
import { AIChat } from '@/components/AIChat';

const Index = () => {
  const [activeSection, setActiveSection] = useState('hero');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'vaults':
        return <VaultManagement />;
      case 'trade':
        return <Trading />;
      case 'analytics':
        return <AIChat />;
      default:
        return <Hero onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />
      {renderSection()}
    </div>
  );
};

export default Index;
