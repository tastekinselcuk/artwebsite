-- Supabase SQL: Products Table Migration
-- Bu SQL'i Supabase SQL Editor'de çalıştırın

-- 1. Products Tablosu Oluştur
CREATE TABLE IF NOT EXISTS public.products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  
  -- Ürün Bilgileri
  title_key TEXT NOT NULL,
  category_key TEXT NOT NULL,
  description_key TEXT NOT NULL,
  tag_key TEXT,
  
  -- Fiyat ve Stok
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  
  -- Görsel
  image TEXT,
  
  -- Kategori ve Öne Çıkartma
  category VARCHAR(50) NOT NULL DEFAULT 'accessories',
  featured BOOLEAN DEFAULT FALSE,
  
  -- Değerlendirme
  rating DECIMAL(3, 1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  
  -- Durum
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Tarih
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT category_check CHECK (category IN ('apparel', 'wallart', 'prints', 'accessories'))
);

-- 2. Index'ler Oluştur
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON public.products(is_active);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products(created_at DESC);

-- 3. RLS (Row Level Security) Politikaları Ayarla
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Herkese okuma izni ver
CREATE POLICY "Allow public read" ON public.products
  FOR SELECT USING (is_active = TRUE);

-- Sadece Admin'e yazma izni ver (later: auth.uid() = admin_id check yapılabilir)
CREATE POLICY "Allow admin write" ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update" ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin delete" ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Örnek Ürün Verisi Ekle (isteğe bağlı)
INSERT INTO public.products 
  (title_key, category_key, description_key, tag_key, price, stock, image, category, featured, rating, reviews, is_active)
VALUES
  (
    'shop.products.silkScarf.title',
    'shop.products.silkScarf.category',
    'shop.products.silkScarf.description',
    'shop.products.silkScarf.tag',
    2450,
    15,
    'https://images.unsplash.com/photo-1606166325683-e6deb697d301?q=80&w=800&auto=format&fit=crop',
    'apparel',
    TRUE,
    4.8,
    24,
    TRUE
  ),
  (
    'shop.products.ebruPainting.title',
    'shop.products.ebruPainting.category',
    'shop.products.ebruPainting.description',
    'shop.products.ebruPainting.tag',
    8500,
    5,
    'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?q=80&w=800&auto=format&fit=crop',
    'wallart',
    TRUE,
    5.0,
    18,
    TRUE
  ),
  (
    'shop.products.printSet.title',
    'shop.products.printSet.category',
    'shop.products.printSet.description',
    '',
    1200,
    30,
    'https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=800&auto=format&fit=crop',
    'prints',
    TRUE,
    4.6,
    42,
    TRUE
  ),
  (
    'shop.products.ebruNotebook.title',
    'shop.products.ebruNotebook.category',
    'shop.products.ebruNotebook.description',
    'shop.products.ebruNotebook.tag',
    350,
    50,
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop',
    'accessories',
    FALSE,
    4.5,
    15,
    TRUE
  ),
  (
    'shop.products.ebruCanvas.title',
    'shop.products.ebruCanvas.category',
    'shop.products.ebruCanvas.description',
    'shop.products.ebruCanvas.tag',
    3200,
    8,
    'https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?q=80&w=800&auto=format&fit=crop',
    'wallart',
    FALSE,
    4.9,
    31,
    TRUE
  ),
  (
    'shop.products.photographyBook.title',
    'shop.products.photographyBook.category',
    'shop.products.photographyBook.description',
    '',
    2800,
    12,
    'https://images.unsplash.com/photo-1507842217343-583f7270bfba?q=80&w=800&auto=format&fit=crop',
    'prints',
    FALSE,
    4.7,
    22,
    TRUE
  )
ON CONFLICT DO NOTHING;
