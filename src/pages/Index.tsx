import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProducts, useCategories } from '@/hooks/useProducts';
import ProductList from '@/components/ProductList';
import { Button } from '@/components/ui/button';
import { ShoppingBag, LogOut, RefreshCw, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isProductsError,
    refetch: refetchProducts,
    isFetching,
  } = useProducts();
  
  const { data: categories } = useCategories();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Signed out',
      description: 'You have been successfully logged out.',
    });
  };

  const handleRefresh = () => {
    refetchProducts();
    toast({
      title: 'Refreshing...',
      description: 'Fetching latest product data.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  Product Store
                </h1>
                <p className="text-xs text-muted-foreground">
                  Manage your inventory
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Connection status indicator */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground">
                <Wifi className="w-3 h-3" />
                <span>Auto-sync enabled</span>
              </div>

              {/* Refresh button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isFetching}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              {/* User info & logout */}
              <div className="flex items-center gap-2 pl-3 border-l border-border">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">{user}</p>
                  <p className="text-xs text-muted-foreground">Logged in</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  <span className="ml-2 hidden sm:inline">Sign out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            All Products
          </h2>
          <p className="text-muted-foreground">
            Browse, search, and manage your product catalog
          </p>
        </div>

        <ProductList
          products={products}
          categories={categories}
          isLoading={isLoadingProducts}
          isError={isProductsError}
          refetch={refetchProducts}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Data powered by{' '}
            <a
              href="https://fakestoreapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Fake Store API
            </a>
            {' '}• Auto-refreshes on window focus
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
