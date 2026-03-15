-- Siparişler tablosu
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  
  -- Ürün Bilgileri
  items JSONB NOT NULL DEFAULT '[]',
  
  -- Fiyatlandırma
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Sevkiyat Adresi
  shipping_full_name TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_district TEXT NOT NULL,
  shipping_postal_code TEXT NOT NULL,
  
  -- Fatura Adresi
  billing_same_as_shipping BOOLEAN DEFAULT TRUE,
  billing_full_name TEXT,
  billing_phone TEXT,
  billing_address TEXT,
  billing_city TEXT,
  billing_district TEXT,
  billing_postal_code TEXT,
  
  -- Ödeme Bilgileri
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  
  -- Sipariş Durumu
  order_status VARCHAR(50) DEFAULT 'pending',
  
  -- Notlar
  notes TEXT,
  
  -- Zaman Bilgileri
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- RLS Politikaları
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar yalnızca kendi siparişlerini görebilir
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- Kullanıcılar kendi siparişlerini oluşturabilir
CREATE POLICY "Users can create their own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar kendi siparişlerini güncelleyebilir
CREATE POLICY "Users can update their own orders"
ON orders FOR UPDATE
USING (auth.uid() = user_id);

-- Kullanıcılar kendi siparişlerini silebilir
CREATE POLICY "Users can delete their own orders"
ON orders FOR DELETE
USING (auth.uid() = user_id);
