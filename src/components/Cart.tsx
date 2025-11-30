import { useEffect, useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { cartStore } from '../store/cartStore';

interface CartProps {
  onClose: () => void;
  onCheckout: () => void;
}

export function Cart({ onClose, onCheckout }: CartProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
    const unsubscribe = cartStore.subscribe(() => {
      loadCart();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartItems = await cartStore.getCart();
      const cartTotal = await cartStore.getCartTotal();
      setItems(cartItems);
      setTotal(cartTotal);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    await cartStore.updateQuantity(itemId, quantity);
  };

  const removeItem = async (itemId: string) => {
    await cartStore.removeFromCart(itemId);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl no-scrollbar" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-4 sm:p-6 flex justify-between items-center rounded-t-3xl safe-area-top">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <ShoppingBag className="w-6 sm:w-8 h-6 sm:h-8 text-white flex-shrink-0" />
            <h2 className="text-lg sm:text-2xl font-bold text-white truncate">Tu Carrito</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors touch-safe active:scale-95 flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <ShoppingBag className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">Tu carrito está vacío</p>
              <button
                onClick={onClose}
                className="mt-3 sm:mt-4 text-pink-500 font-semibold hover:text-pink-600"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-2 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-2xl border-2 border-pink-100"
                >
                  <img
                    src={item.product?.image_url}
                    alt={item.product?.name}
                    className="w-16 sm:w-24 h-16 sm:h-24 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs sm:text-base text-gray-900 mb-1 truncate">
                      {item.product?.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                      Talla: <span className="font-semibold text-pink-600">{item.size}</span>
                    </p>
                    <p className="text-base sm:text-lg font-bold text-pink-600">
                      ${item.product?.price}
                    </p>
                  </div>
                  <div className="flex flex-col justify-between items-end gap-2 flex-shrink-0">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors touch-safe active:scale-95"
                    >
                      <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                    </button>
                    <div className="flex items-center space-x-1 bg-white rounded-lg border-2 border-pink-200">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-pink-50 rounded-l-lg transition-colors touch-safe active:scale-95"
                      >
                        <Minus className="w-3 sm:w-4 h-3 sm:h-4 text-pink-600" />
                      </button>
                      <span className="font-bold text-gray-900 w-6 text-center text-sm sm:text-base">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-pink-50 rounded-r-lg transition-colors touch-safe active:scale-95"
                      >
                        <Plus className="w-3 sm:w-4 h-3 sm:h-4 text-pink-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t-2 border-pink-200 p-4 sm:p-6 bg-gray-50 rounded-b-3xl safe-area-bottom">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <span className="text-base sm:text-lg font-bold text-gray-900">TOTAL:</span>
              <span className="text-2xl sm:text-3xl font-bold text-pink-600">
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] touch-safe active:scale-95"
            >
              PROCEDER AL PAGO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
