import { supabase, getSessionId } from '../lib/supabase';
import type { CartItem } from '../types';

export class CartStore {
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  async getCart(): Promise<CartItem[]> {
    const sessionId = getSessionId();
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('session_id', sessionId);

    if (error) throw error;
    return data as CartItem[];
  }

  async addToCart(productId: string, size: string, quantity: number = 1): Promise<void> {
    const sessionId = getSessionId();

    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('session_id', sessionId)
      .eq('product_id', productId)
      .eq('size', size)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          session_id: sessionId,
          product_id: productId,
          size,
          quantity
        });

      if (error) throw error;
    }

    this.notify();
  }

  async updateQuantity(itemId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.removeFromCart(itemId);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) throw error;
    this.notify();
  }

  async removeFromCart(itemId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    this.notify();
  }

  async clearCart(): Promise<void> {
    const sessionId = getSessionId();
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('session_id', sessionId);

    if (error) throw error;
    this.notify();
  }

  async getCartTotal(): Promise<number> {
    const items = await this.getCart();
    return items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }

  async getCartCount(): Promise<number> {
    const items = await this.getCart();
    return items.reduce((count, item) => count + item.quantity, 0);
  }
}

export const cartStore = new CartStore();
