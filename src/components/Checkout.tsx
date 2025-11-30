import { useState } from 'react';
import { X, CreditCard, MapPin, User, Mail, Phone } from 'lucide-react';
import { supabase, getSessionId } from '../lib/supabase';
import { cartStore } from '../store/cartStore';

interface CheckoutProps {
  onClose: () => void;
  total: number;
}

export function Checkout({ onClose, total }: CheckoutProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sessionId = getSessionId();
      const cartItems = await cartStore.getCart();

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          session_id: sessionId,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          total_amount: total,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product?.name || '',
        product_price: item.product?.price || 0,
        quantity: item.quantity,
        size: item.size,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      await cartStore.clearCart();
      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Hubo un error al procesar tu pedido. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl safe-area-top safe-area-bottom">
          <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-bounce">
            <svg
              className="w-10 sm:w-12 h-10 sm:h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            ¡Pedido Confirmado!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            Gracias por tu compra. Recibirás un email de confirmación pronto.
          </p>
          <p className="text-xs sm:text-sm text-pink-600 font-semibold">
            Cerrando en 3 segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl no-scrollbar" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-rose-400 p-4 sm:p-6 flex justify-between items-center z-10 rounded-t-3xl safe-area-top">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <CreditCard className="w-6 sm:w-8 h-6 sm:h-8 text-white flex-shrink-0" />
            <h2 className="text-lg sm:text-2xl font-bold text-white truncate">Finalizar Compra</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors touch-safe active:scale-95 flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-4 sm:space-y-6">
          <div>
            <label className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-gray-700 mb-2">
              <User className="w-4 sm:w-5 h-4 sm:h-5 text-pink-500 flex-shrink-0" />
              <span>NOMBRE COMPLETO</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none transition-colors text-sm sm:text-base"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-gray-700 mb-2">
              <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-pink-500 flex-shrink-0" />
              <span>EMAIL</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none transition-colors text-sm sm:text-base"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-gray-700 mb-2">
              <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-pink-500 flex-shrink-0" />
              <span>TELÉFONO</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none transition-colors text-sm sm:text-base"
              placeholder="555-123-4567"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-gray-700 mb-2">
              <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-pink-500 flex-shrink-0" />
              <span>DIRECCIÓN DE ENVÍO</span>
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none transition-colors resize-none text-sm sm:text-base"
              placeholder="Calle, número, colonia, ciudad, código postal"
            />
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 sm:p-6 rounded-2xl border-2 border-pink-200">
            <div className="flex justify-between items-center mb-3 sm:mb-4 text-sm sm:text-base">
              <span className="text-gray-700 font-semibold">Subtotal:</span>
              <span className="text-gray-900 font-bold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-3 sm:mb-4 text-sm sm:text-base">
              <span className="text-gray-700 font-semibold">Envío:</span>
              <span className="text-green-600 font-bold">GRATIS</span>
            </div>
            <div className="border-t-2 border-pink-200 pt-3 sm:pt-4">
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-lg font-bold text-gray-900">TOTAL:</span>
                <span className="text-2xl sm:text-3xl font-bold text-pink-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed touch-safe active:scale-95"
          >
            {loading ? 'PROCESANDO...' : 'CONFIRMAR PEDIDO'}
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-500 safe-area-bottom">
            Al confirmar tu pedido aceptas nuestros términos y condiciones
          </p>
        </form>
      </div>
    </div>
  );
}
