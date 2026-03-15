# 🚀 Supabase E-Commerce Setup - Adım Adım Rehber

## ✅ Hata Düzeltildi

JSON syntax hatası (tr.json dosyasında) başarıyla düzeltildi!

---

## 📋 İçindekiler

1. [Veritabanı Tabloları Oluşturma](#veritabanı-tabloları-oluşturma)
2. [CSV Verileri İmport Etme](#csv-verileri-import-etme)
3. [RLS Politikaları Doğrulama](#rls-politikaları-doğrulama)
4. [Test Etme](#test-etme)

---

## 🗄️ Veritabanı Tabloları Oluşturma

### Adım 1: Supabase Dashboard'a Giriş

1. https://supabase.com/dashboard adresine gidin
2. Projenize giriş yapın

### Adım 2: SQL Editor Açın

- Sol panelda **"SQL Editor"** seçin
- **"New Query"** butonuna tıklayın

### Adım 3: Products Tablosu Oluştur

Dosya: `supabase/migrations/01_create_products_table.sql`

Aşağıdaki SQL komutunu kopyalayın:

```sql
-- Ürünler tablosu
CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title_key TEXT NOT NULL,
  category_key TEXT NOT NULL,
  description_key TEXT,
  tag_key TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  category VARCHAR(50) NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 1) DEFAULT 5.0,
  reviews INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- RLS (Row Level Security) Politikaları
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Herkese okuma izni (sadece aktif ürünler)
CREATE POLICY "Public can read active products"
ON products FOR SELECT
USING (is_active = TRUE);

-- Authenticated kullanıcılara yazma izni (admin)
CREATE POLICY "Authenticated users can insert products"
ON products FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products"
ON products FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products"
ON products FOR DELETE
USING (auth.role() = 'authenticated');
```

✅ **"Run"** butonuna tıklayın

### Adım 4: Shopping Carts Tablosu Oluştur

Dosya: `supabase/migrations/02_create_shopping_carts_table.sql`

SQL Editor'da yeni query oluşturup bu kodu çalıştırın:

```sql
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

CREATE POLICY "Users can view their own cart"
ON shopping_carts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart"
ON shopping_carts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart"
ON shopping_carts FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart"
ON shopping_carts FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

✅ **"Run"** butonuna tıklayın

### Adım 5: Orders Tablosu Oluştur

Dosya: `supabase/migrations/03_create_orders_table.sql`

SQL Editor'da yeni query oluşturup bu kodu çalıştırın:

```sql
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

CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
ON orders FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orders"
ON orders FOR DELETE
USING (auth.uid() = user_id);
```

✅ **"Run"** butonuna tıklayın

---

## 📊 CSV Verileri İmport Etme

### Adım 1: Table Editor Açın

- Sol panelda **"Table Editor"** seçin

### Adım 2: Products Tablosu Seç

- Tables listinden **"products"** seçin

### Adım 3: CSV İmport Et

1. **"Insert"** butonuna tıklayın
2. **"Import data from CSV"** seçin
3. **"Choose CSV file"** tıklayıp `supabase/seeds/products.csv` seçin
4. **"Upload"** butonuna tıklayın

✅ 6 ürün başarıyla yüklenmeli

### CSV İçeriği (Referans)

Dosya: `supabase/seeds/products.csv`

```
id,title_key,category_key,description_key,tag_key,price,stock,image,category,featured,rating,reviews,is_active
1,shop.products.silkScarf.title,apparel,shop.products.silkScarf.description,shop.products.silkScarf.tag,450.00,15,https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500,Apparel & Accessories,true,5.0,12,true
2,shop.products.ebruPainting.title,wallart,shop.products.ebruPainting.description,shop.products.ebruPainting.tag,1200.00,3,https://images.unsplash.com/photo-1549887534-7eb66b829e10?w=500,Wall Art,true,5.0,8,true
3,shop.products.printSet.title,prints,shop.products.printSet.description,shop.products.printSet.tag,350.00,20,https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=500,Fine Art Prints,false,4.8,5,true
4,shop.products.ebruNotebook.title,accessories,shop.products.ebruNotebook.description,shop.products.ebruNotebook.tag,89.99,30,https://images.unsplash.com/photo-1507842217343-583f20270319?w=500,Accessories,true,4.9,15,true
5,shop.products.wallArt.title,wallart,shop.products.wallArt.description,shop.products.wallArt.tag,650.00,5,https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=500,Wall Art,false,5.0,6,true
6,shop.products.giftSet.title,accessories,shop.products.giftSet.description,shop.products.giftSet.tag,280.00,25,https://images.unsplash.com/photo-1549887534-7eb66b829e10?w=500,Accessories,false,4.7,9,true
```

---

## 🔐 RLS Politikaları Doğrulama

### Products Tablosu - Politikaları Kontrol Edin

1. Table Editor → **"products"** → **"Policies"** sekmesi
2. 4 politika görülmeli:
   - ✅ Public can read active products
   - ✅ Authenticated users can insert products
   - ✅ Authenticated users can update products
   - ✅ Authenticated users can delete products

### Shopping Carts Tablosu - Politikaları Kontrol Edin

1. Table Editor → **"shopping_carts"** → **"Policies"** sekmesi
2. 4 politika görülmeli:
   - ✅ Users can view their own cart
   - ✅ Users can update their own cart
   - ✅ Users can delete their own cart
   - ✅ Users can insert their own cart

### Orders Tablosu - Politikaları Kontrol Edin

1. Table Editor → **"orders"** → **"Policies"** sekmesi
2. 4 politika görülmeli:
   - ✅ Users can view their own orders
   - ✅ Users can create their own orders
   - ✅ Users can update their own orders
   - ✅ Users can delete their own orders

---

## 🧪 Test Etme

### Test 1: Ürünleri Görüntüle

```bash
npm run dev
```

1. http://localhost:5173/shop adresine gidin
2. 6 ürün görülmeli
3. Filtreler çalışmalı
4. Sepete ürün ekleyebilmeli

### Test 2: Checkout

1. Sepete 2-3 ürün ekleyin
2. "Checkout" butonuna tıklayın
3. Sevkiyat adresi doldur
4. Ödeme yöntemi seç
5. "Place Order" butonuna tıklayın
6. ✅ Sipariş onay sayfası görülmeli
7. Supabase'de orders tablosunda kayıt görülmeli

### Test 3: Sorgu Testi

SQL Editor'da şu komut çalıştırın:

```sql
-- Tüm ürünleri görüntüle
SELECT id, title_key, price, stock FROM products ORDER BY id;

-- Tüm siparişleri görüntüle
SELECT id, user_email, total, order_status FROM orders ORDER BY created_at DESC;

-- Sepet öğelerini görüntüle
SELECT id, user_id, items FROM shopping_carts;
```

---

## 🛠️ Sorun Giderme

### ❌ Hata: "Permission denied"

**Çözüm:**

- RLS politikalarının doğru olduğunu kontrol edin
- Tabloyu silip SQL dosyasını yeniden çalıştırın
- Admin auth.users'ı kontrol edin

### ❌ CSV Upload Hatası

**Çözüm:**

- CSV başlıklarının tablo sütunlarıyla eşleştiğini kontrol edin
- Virgül ayırıcıyı kontrol edin
- Windows'ta: "," kullanın
- Excel'den export: UTF-8 format seçin

### ❌ Ürünler Görülmüyor

**Çözüm:**

- `is_active = TRUE` olduğundan emin olun
- Table Editor'da "products" seç ve satırları kontrol et
- Developer console'da hata mesajını kontrol et

### ❌ Sepete Ürün Eklenmiyor

**Çözüm:**

- Giriş yapıp yapmadığınızı kontrol edin
- Cart store'da loading/error state'ini kontrol edin
- Network tab'ında API çağrılarını kontrol edin

---

## 📱 Başarılı Kurulum Belirtileri

✅ **Hepsi başarılıysa:**

- [ ] Products tablosu 6 ürün içeriyor
- [ ] Shop sayfası ürünleri gösteriyor
- [ ] Filtreleme çalışıyor
- [ ] Sepete ürün eklenebiliyor
- [ ] Checkout formu açılıyor
- [ ] Sipariş başarıyla kaydediliyor
- [ ] Order Success sayfası görülüyor
- [ ] Supabase orders tablosunda kayıt var

---

## 📞 İhtiyaç Duyduğunuzda

- **Supabase Docs:** https://supabase.com/docs
- **Vue 3 Composition API:** https://vuejs.org
- **Pinia Docs:** https://pinia.vuejs.org
- **Tailwind CSS:** https://tailwindcss.com

Sorularınız varsa çekinmeden sorun! 🎉
