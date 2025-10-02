import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();

  const handleNavigation = (path: string) => {
    // Add your navigation logic here (e.g., using react-router)
    console.log(`Navigating to: ${path}`);
  };

  return (
    <div className="min-h-screen bg-warm-gradient">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo/Brand */}
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <h2 className="text-2xl font-bold text-primary">📚 My Library</h2>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden md:flex space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => handleNavigation('/')}
                  className="text-gray-700 hover:text-primary"
                >
                  Home
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => handleNavigation('/about')}
                  className="text-gray-700 hover:text-primary"
                >
                  About
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => handleNavigation('/finder')}
                  className="text-gray-700 hover:text-primary"
                >
                  Finder
                </Button>
              </div>
            </div>

            {/* Right side - User info and Sign out */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome, {user?.username}!
              </span>
              <Button onClick={logout} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-x-2 flex">
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('/')}
              size="sm"
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('/about')}
              size="sm"
            >
              About
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('/finder')}
              size="sm"
            >
              Finder
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;