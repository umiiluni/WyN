import { useState } from 'react';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Product } from './types';
import { cartStore } from './store/cartStore';

function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  const handleAddToCart = async (product: Product, size?: string, quantity?: number) => {
    await cartStore.addToCart(product.id, size || product.sizes[0], quantity || 1);
  };

  const handleCheckout = async () => {
    const total = await cartStore.getCartTotal();
    setCartTotal(total);
    setShowCart(false);
    setShowCheckout(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex flex-col w-full overflow-x-hidden">
      <Header onCartClick={() => setShowCart(true)} />

      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 flex-1 safe-area-left safe-area-right">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 mb-3 sm:mb-4">
            WyN
          </h2>
          <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            Descubre nuestra colección de ropa con mucho estilo.
            Piezas únicas para expresar tu personalidad sin límites de froma autentica.
          </p>
        </div>

        <ProductGrid onProductClick={setSelectedProduct} />
      </main>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {showCart && (
        <Cart
          onClose={() => setShowCart(false)}
          onCheckout={handleCheckout}
        />
      )}

      {showCheckout && (
        <Checkout
          onClose={() => setShowCheckout(false)}
          total={cartTotal}
        />
      )}

      <footer className="bg-gradient-to-r from-pink-500 to-rose-400 text-white py-6 sm:py-8 mt-12 sm:mt-20 safe-area-bottom">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center safe-area-left safe-area-right">
          <p className="font-bold text-base sm:text-lg mb-2">WyN</p>
          <p className="text-pink-100 text-xs sm:text-sm">
            Expresate diferente, usando ropa unica.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
