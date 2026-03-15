Tüm Supabase Tabloları Kurulum Rehberi

========================================

1. # PRODUCTS TABLOSU (Ürünler)

SQL: supabase/migrations/01_create_products_table.sql dosyasını Supabase SQL Editor'da çalıştırın.

CSV Import Adımları:

1. Supabase Dashboard → Tablo → "products" seçin
2. "Insert" → "Import data from CSV" tıklayın
3. supabase/seeds/products.csv dosyasını seçin ve yükleyin

Sütunlar:

- id: Otomatik ID
- title_key: Çevirileme anahtar (ör: "shop.products.silkScarf.title")
- category_key: Kategori anahtarı (ör: "apparel")
- description_key: Açıklama anahtarı
- tag_key: Etiket anahtarı (ör: "New Season")
- price: Fiyat (TRY)
- stock: Stok miktarı
- image: Görsel URL
- category: Kategori ismi (Apparel, Wall Art, Prints, Accessories)
- featured: Öne çıkarmış mı? (TRUE/FALSE)
- rating: Derecelendirme (1-5)
- reviews: Yorum sayısı
- is_active: Aktif mi? (TRUE/FALSE)

======================================== 2. SHOPPING_CARTS TABLOSU (Alışveriş Sepeti)
========================================

SQL: supabase/migrations/02_create_shopping_carts_table.sql dosyasını Supabase SQL Editor'da çalıştırın.

NOT: Bu tablo otomatik olarak dolacaktır. Manuel veri eklemeye gerek yoktur.

Sütunlar:

- id: Otomatik ID
- user_id: Kullanıcı ID (auth.users referansı)
- items: Sepetteki ürünler (JSON formatı)
- total_price: Toplam ürün fiyatı
- tax_amount: Vergi miktarı (18%)
- shipping_cost: Kargo maliyeti
- final_total: Son toplam
- created_at: Oluşturulma tarihi
- updated_at: Güncellenme tarihi

======================================== 3. ORDERS TABLOSU (Siparişler)
========================================

SQL: supabase/migrations/03_create_orders_table.sql dosyasını Supabase SQL Editor'da çalıştırın.

NOT: Bu tablo otomatik olarak dolacaktır. Manuel veri eklemeye gerek yoktur.

Sütunlar:

- id: Otomatik ID
- user_id: Kullanıcı ID (auth.users referansı)
- user_email: Kullanıcı E-postası
- items: Ürünler (JSON)
- subtotal: Ara toplam
- tax: Vergi (18%)
- shipping_cost: Kargo
- total: Toplam
- shipping_full_name: Sevkiyat adı
- shipping_phone: Sevkiyat telefonu
- shipping_address: Sevkiyat adresi
- shipping_city: Sevkiyat şehri
- shipping_district: Sevkiyat ilçesi
- shipping_postal_code: Sevkiyat posta kodu
- billing_same_as_shipping: Fatura adresi sevkiyat ile aynı mı?
- billing\_\* : Fatura adres alanları
- payment_method: Ödeme yöntemi (credit_card, bank_transfer, cash_on_delivery)
- payment_status: Ödeme durumu (pending, completed, failed)
- order_status: Sipariş durumu (pending, processing, shipped, delivered, cancelled)
- notes: Müşteri notları
- created_at: Oluşturulma tarihi
- updated_at: Güncellenme tarihi

========================================
KURULUM ADIM ADIM
========================================

1. Supabase Projesi Açın
   - https://supabase.com adresine gidin
   - Projenize giriş yapın

2. SQL Editor'u Açın
   - Supabase Dashboard → SQL Editor

3. İlk Tablo: Products
   - supabase/migrations/01_create_products_table.sql içeriğini kopyalayın
   - SQL Editor'a yapıştırın
   - "Run" butonuna tıklayın

4. İkinci Tablo: Shopping Carts
   - supabase/migrations/02_create_shopping_carts_table.sql içeriğini kopyalayın
   - SQL Editor'a yapıştırın
   - "Run" butonuna tıklayın

5. Üçüncü Tablo: Orders
   - supabase/migrations/03_create_orders_table.sql içeriğini kopyalayın
   - SQL Editor'a yapıştırın
   - "Run" butonuna tıklayın

6. CSV Verisi İçe Aktarma
   - Supabase Dashboard → Table Editor
   - "products" tablosunu seçin
   - "Insert" butonunu tıklayın
   - "Import data from CSV" seçin
   - supabase/seeds/products.csv dosyasını seçin
   - "Upload" butonuna tıklayın

7. Doğrulama
   - Table Editor'da her tabloyu kontrol edin
   - products tablosunda 6 ürün görülmeli

========================================
ÖLÇEKLI VERİ İÇİN SQL SEED SCRIPTI
========================================

Birden fazla ürün eklemek için SQL kullanabilirsiniz:

INSERT INTO products (title_key, category_key, description_key, tag_key, price, stock, image, category, featured, rating, reviews, is_active)
VALUES
('shop.products.silkScarf.title', 'apparel', 'shop.products.silkScarf.description', 'shop.products.silkScarf.tag', 450.00, 15, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500', 'Apparel & Accessories', true, 5.0, 12, true),
('shop.products.ebruPainting.title', 'wallart', 'shop.products.ebruPainting.description', 'shop.products.ebruPainting.tag', 1200.00, 3, 'https://images.unsplash.com/photo-1549887534-7eb66b829e10?w=500', 'Wall Art', true, 5.0, 8, true),
('shop.products.printSet.title', 'prints', 'shop.products.printSet.description', 'shop.products.printSet.tag', 350.00, 20, 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=500', 'Fine Art Prints', false, 4.8, 5, true);

========================================
RLS (Row Level Security) Notları
========================================

✅ Products Tablosu:

- Herkes aktif ürünleri görebilir (is_active = TRUE)
- Sadece admin (authenticated) ekleyebilir/güncelleyebilir

✅ Shopping Carts Tablosu:

- Kullanıcılar yalnızca kendi sepetlerini görebilir
- Kendi sepetlerini güncelleyebilir/silebilir

✅ Orders Tablosu:

- Kullanıcılar yalnızca kendi siparişlerini görebilir
- Kendi siparişlerini oluşturabilir/güncelleyebilir

========================================
SORUN GİDERME
========================================

Problem: "Permission denied" hatası
Çözüm: RLS politikalarının doğru kurulduğunu kontrol edin. SQL dosyalarını yeniden çalıştırın.

Problem: CSV import "column mismatch" hatası
Çözüm: CSV başlıklarının tablo sütunlarıyla eşleştiğini kontrol edin.

Problem: Tablolar görülmüyor
Çözüm: Sayfayı yenileyin (F5) ve SQL komutlarının başarılı olduğunu kontrol edin.
