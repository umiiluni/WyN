import { useState } from 'react';
import { Product } from '../types';
import { X, ShoppingBag, Package } from 'lucide-react';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = () => {
    onAddToCart(product, selectedSize, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl no-scrollbar" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-rose-400 p-3 sm:p-4 flex justify-between items-center z-10 safe-area-top">
          <h2 className="text-lg sm:text-2xl font-bold text-white">Detalles del Producto</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors touch-safe active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <span className="inline-block text-xs font-semibold text-pink-500 uppercase tracking-wider bg-pink-100 px-3 py-1 rounded-full mb-2 sm:mb-3">
                  {product.category}
                </span>
                <h3 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-3xl sm:text-4xl font-bold text-pink-600">
                  ${product.price}
                </span>
                <span className="text-gray-500 text-sm sm:text-base">MXN</span>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                  SELECCIONA TU TALLA:
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 sm:py-3 rounded-xl font-bold transition-all duration-200 touch-safe active:scale-95 text-sm sm:text-base ${
                        selectedSize === size
                          ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                  CANTIDAD:
                </label>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-pink-600 font-bold transition-colors touch-safe active:scale-95"
                  >
                    -
                  </button>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900 w-8 sm:w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-pink-600 font-bold transition-colors touch-safe active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-xl">
                <Package className="w-4 sm:w-5 h-4 sm:h-5 text-pink-500 flex-shrink-0" />
                <span>
                  {product.stock > 10 ? 'En stock' : `Solo ${product.stock} disponibles`}
                </span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={product.stock === 0}
                className={`w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center space-x-2 touch-safe active:scale-95 ${
                  product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                }`}
              >
                <ShoppingBag className="w-5 sm:w-6 h-5 sm:h-6" />
                <span>{product.stock === 0 ? 'AGOTADO' : 'AGREGAR'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
