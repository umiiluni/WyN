import { ShoppingCart, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cartStore } from '../store/cartStore';

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadCartCount();
    const unsubscribe = cartStore.subscribe(() => {
      loadCartCount();
    });
    return () => {
      // call unsubscribe and ignore its return value (some stores return boolean)
      unsubscribe();
    };
  }, []);

  const loadCartCount = async () => {
    const count = await cartStore.getCartCount();
    setCartCount(count);
  };

  return (
    <header className="bg-gradient-to-r from-pink-500 via-rose-400 to-pink-400 shadow-lg sticky top-0 z-50 safe-area-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 safe-area-left safe-area-right">
        <div className="flex justify-between items-center py-3 sm:py-4 gap-2 sm:gap-4">
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse flex-shrink-0" />
            <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight truncate">
              WyN
            </h1>
          </div>

          <button
            onClick={onCartClick}
            className="relative bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-3 sm:px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-1 sm:space-x-2 border-2 border-white/50 touch-safe flex-shrink-0 active:scale-95"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-semibold hidden sm:inline">Carrito</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-pink-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
