import { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { supabase } from '../lib/supabase';

interface ProductGridProps {
  onProductClick: (product: Product) => void;
}

export function ProductGrid({ onProductClick }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadProducts();
  }, [filter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('products').select('*');

      if (filter !== 'all') {
        query = query.eq('category', filter);
      }

      const { data, error } = await query.order('featured', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'TODO' },
    { id: 'tops', label: 'TOPS' },
    { id: 'bottoms', label: 'BOTTOMS' },
    { id: 'outerwear', label: 'CHAMARRAS' },
    { id: 'accessories', label: 'ACCESORIOS' },
  ];

  return (
    <div>
      <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 sm:gap-3 justify-center px-2 sm:px-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full font-bold transition-all duration-300 touch-safe text-sm sm:text-base active:scale-95 ${
              filter === cat.id
                ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg scale-100 sm:scale-105'
                : 'bg-white text-gray-700 hover:bg-pink-100 hover:text-pink-600 border-2 border-pink-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 sm:py-20">
          <div className="animate-spin rounded-full h-12 sm:h-16 w-12 sm:w-16 border-4 border-pink-500 border-t-transparent mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onProductClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
