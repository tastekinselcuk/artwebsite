-- Alışveriş Sepeti tablosu
CREATE TABLE IF NOT EXISTS shopping_carts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]',
  total_price DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  final_total DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- İndeksler
CREATE INDEX idx_shopping_carts_user_id ON shopping_carts(user_id);
CREATE INDEX idx_shopping_carts_updated_at ON shopping_carts(updated_at DESC);

-- RLS Politikaları
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar yalnızca kendi sepetlerini görebilir
CREATE POLICY "Users can view their own cart"
ON shopping_carts FOR SELECT
USING (auth.uid() = user_id);

-- Kullanıcılar yalnızca kendi sepetlerini güncelleyebilir
CREATE POLICY "Users can update their own cart"
ON shopping_carts FOR UPDATE
USING (auth.uid() = user_id);

-- Kullanıcılar yalnızca kendi sepetlerini silebilir
CREATE POLICY "Users can delete their own cart"
ON shopping_carts FOR DELETE
USING (auth.uid() = user_id);

-- Kullanıcılar yalnızca kendi sepetin oluşturabilir
CREATE POLICY "Users can insert their own cart"
ON shopping_carts FOR INSERT
WITH CHECK (auth.uid() = user_id);
