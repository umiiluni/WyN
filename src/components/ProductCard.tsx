import { Product } from '../types';
import { ShoppingBag, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border-2 border-pink-200 active:scale-95 cursor-pointer">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {product.featured && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            <span className="hidden sm:inline">DESTACADO</span>
          </div>
        )}
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-rose-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ¡ÚLTIMAS {product.stock}!
          </div>
        )}
      </div>

      <div className="p-3 sm:p-5">
        <div className="mb-2">
          <span className="text-xs font-semibold text-pink-500 uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {product.name}
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
          <div>
            <span className="text-xl sm:text-2xl font-bold text-pink-600">
              ${product.price}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 justify-end">
            {product.sizes.slice(0, 2).map((size) => (
              <span
                key={size}
                className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded-md font-medium"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 2 && (
              <span className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded-md font-medium">
                +{product.sizes.length - 2}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className={`w-full py-2 sm:py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-1 sm:space-x-2 touch-safe active:scale-95 text-sm sm:text-base ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          <ShoppingBag className="w-4 sm:w-5 h-4 sm:h-5" />
          <span className="hidden sm:inline">{product.stock === 0 ? 'AGOTADO' : 'AGREGAR'}</span>
          <span className="sm:hidden">{product.stock === 0 ? 'AGOTADO' : 'AGREGAR'}</span>
        </button>
      </div>
    </div>
  );
}
