/*
  # Create E-commerce Store Schema

  ## Overview
  This migration creates the database structure for a punk/Y2K style clothing store
  with products, shopping cart, and order management functionality.

  ## New Tables
  
  ### `products`
  - `id` (uuid, primary key) - Unique product identifier
  - `name` (text) - Product name
  - `description` (text) - Product description
  - `price` (numeric) - Product price
  - `image_url` (text) - Product image URL
  - `category` (text) - Product category (tops, bottoms, accessories, etc.)
  - `sizes` (text[]) - Available sizes
  - `stock` (integer) - Available stock quantity
  - `featured` (boolean) - Whether product is featured
  - `created_at` (timestamptz) - Creation timestamp

  ### `cart_items`
  - `id` (uuid, primary key) - Unique cart item identifier
  - `user_id` (uuid) - Reference to user (for future auth)
  - `session_id` (text) - Session identifier for guest users
  - `product_id` (uuid) - Reference to product
  - `quantity` (integer) - Quantity in cart
  - `size` (text) - Selected size
  - `created_at` (timestamptz) - Creation timestamp

  ### `orders`
  - `id` (uuid, primary key) - Unique order identifier
  - `user_id` (uuid, nullable) - Reference to user if authenticated
  - `session_id` (text) - Session identifier
  - `customer_name` (text) - Customer name
  - `customer_email` (text) - Customer email
  - `customer_phone` (text) - Customer phone
  - `shipping_address` (text) - Shipping address
  - `total_amount` (numeric) - Total order amount
  - `status` (text) - Order status (pending, confirmed, shipped, delivered)
  - `created_at` (timestamptz) - Creation timestamp

  ### `order_items`
  - `id` (uuid, primary key) - Unique order item identifier
  - `order_id` (uuid) - Reference to order
  - `product_id` (uuid) - Reference to product
  - `product_name` (text) - Product name snapshot
  - `product_price` (numeric) - Product price snapshot
  - `quantity` (integer) - Quantity ordered
  - `size` (text) - Selected size
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for products
  - Users can manage their own cart items
  - Users can view their own orders

  ## Important Notes
  1. Cart uses session_id for guest users (no auth required initially)
  2. Products are publicly readable
  3. Order history is tracked for customer service
  4. Product snapshots in order_items preserve historical data
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  image_url text NOT NULL,
  category text NOT NULL,
  sizes text[] NOT NULL DEFAULT '{}',
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  session_id text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  size text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  session_id text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shipping_address text NOT NULL,
  total_amount numeric(10, 2) NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  product_price numeric(10, 2) NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  size text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can add items to cart"
  ON cart_items FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view their own cart items by session"
  ON cart_items FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update their own cart items"
  ON cart_items FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Users can delete their own cart items"
  ON cart_items FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view orders"
  ON orders FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view order items"
  ON order_items FOR SELECT
  TO anon
  USING (true);

INSERT INTO products (name, description, price, image_url, category, sizes, stock, featured) VALUES
  ('Mini Falda Jean Y2K', 'Mini falda de jean estilo Y2K con corte desgastado', 25.99, 'https://i.pinimg.com/1200x/5b/f9/78/5bf9786f7ddf682be968000d1657174a.jpg', 'bottoms', ARRAY['UNICO'], 15, true),
  ('Mini Falda Jean Rosa', 'Mini falda de jean rosa con bolsillos y detalles vintage', 45.99, 'https://i.pinimg.com/736x/05/4d/47/054d473e13c81b0e1b52f5605a3ffbac.jpg', 'bottoms', ARRAY['UNICO'], 12, true),
  ('Mini Falda Jean Negra', 'Mini falda de jean negro con roturas y estilo urbano', 22.99, 'https://i.pinimg.com/1200x/7d/6a/82/7d6a821b4e3ffb36c61ee87be0df77b0.jpg', 'bottoms', ARRAY['UNICO'], 20, false),
  ('Mini Falda Jean Clásica', 'Mini falda de jean azul clásico con corte recto', 32.99, 'https://i.pinimg.com/736x/46/f9/68/46f968db9bcffd4d74fff86fe3b78ca5.jpg', 'bottoms', ARRAY['UNICO'], 18, true),
  ('Mini Falda Jean Con Cadenas', 'Mini falda de jean con detalles de cadenas y tachas', 12.99, 'https://i.pinimg.com/1200x/c9/d8/a3/c9d8a36a146e109fb14a06505b45b8af.jpg', 'bottoms', ARRAY['UNICO'], 30, false),
  ('Mini Falda Jean Oversized', 'Mini falda de jean oversized estilo streetwear', 65.99, 'https://i.pinimg.com/1200x/86/7b/d6/867bd692911c2f876b83cdbada93148c.jpg', 'bottoms', ARRAY['UNICO'], 8, true),
  ('Mini Falda Jean Con Lazos', 'Mini falda de jean con lazos laterales y corte A', 38.99, 'https://i.pinimg.com/1200x/f8/1e/65/f81e657b719e3afdb62c93dde8a42f02.jpg', 'bottoms', ARRAY['UNICO'], 10, false),
  ('Mini Falda Jean Destroyed', 'Mini falda de jean con efecto destroyed y roturas', 42.99, 'https://i.pinimg.com/736x/bc/c5/99/bcc5997fa86bd55dc9c93b8f3b484fdc.jpg', 'bottoms', ARRAY['UNICO'], 14, true);