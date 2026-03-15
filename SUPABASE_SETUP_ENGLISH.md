# 🚀 Supabase E-Commerce Setup - Step by Step Guide

## ✅ Error Fixed

JSON syntax error in tr.json file has been successfully fixed!

---

## 📋 Table of Contents

1. [Creating Database Tables](#creating-database-tables)
2. [Importing CSV Data](#importing-csv-data)
3. [Verifying RLS Policies](#verifying-rls-policies)
4. [Testing](#testing)

---

## 🗄️ Creating Database Tables

### Step 1: Login to Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Sign in to your project

### Step 2: Open SQL Editor

- Click **"SQL Editor"** in the left sidebar
- Click **"New Query"** button

### Step 3: Create Products Table

File: `supabase/migrations/01_create_products_table.sql`

Copy and paste the following SQL command:

```sql
-- Products table
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

-- Indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- RLS (Row Level Security) Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public can read active products
CREATE POLICY "Public can read active products"
ON products FOR SELECT
USING (is_active = TRUE);

-- Authenticated users can insert products
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

✅ Click **"Run"** button

### Step 4: Create Shopping Carts Table

File: `supabase/migrations/02_create_shopping_carts_table.sql`

Create a new query and run this code:

```sql
-- Shopping Carts table
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

-- Indexes
CREATE INDEX idx_shopping_carts_user_id ON shopping_carts(user_id);
CREATE INDEX idx_shopping_carts_updated_at ON shopping_carts(updated_at DESC);

-- RLS Policies
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

✅ Click **"Run"** button

### Step 5: Create Orders Table

File: `supabase/migrations/03_create_orders_table.sql`

Create a new query and run this code:

```sql
-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,

  -- Product Information
  items JSONB NOT NULL DEFAULT '[]',

  -- Pricing
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,

  -- Shipping Address
  shipping_full_name TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_district TEXT NOT NULL,
  shipping_postal_code TEXT NOT NULL,

  -- Billing Address
  billing_same_as_shipping BOOLEAN DEFAULT TRUE,
  billing_full_name TEXT,
  billing_phone TEXT,
  billing_address TEXT,
  billing_city TEXT,
  billing_district TEXT,
  billing_postal_code TEXT,

  -- Payment Information
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',

  -- Order Status
  order_status VARCHAR(50) DEFAULT 'pending',

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- RLS Policies
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

✅ Click **"Run"** button

---

## 📊 Importing CSV Data

### Step 1: Open Table Editor

- Click **"Table Editor"** in the left sidebar

### Step 2: Select Products Table

- Select **"products"** from the tables list

### Step 3: Import CSV

1. Click **"Insert"** button
2. Select **"Import data from CSV"**
3. Click **"Choose CSV file"** and select `supabase/seeds/products.csv`
4. Click **"Upload"** button

✅ 6 products should be successfully loaded

### CSV Content (Reference)

File: `supabase/seeds/products.csv`

```csv
id,title_key,category_key,description_key,tag_key,price,stock,image,category,featured,rating,reviews,is_active
1,shop.products.silkScarf.title,apparel,shop.products.silkScarf.description,shop.products.silkScarf.tag,450.00,15,https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500,Apparel & Accessories,true,5.0,12,true
2,shop.products.ebruPainting.title,wallart,shop.products.ebruPainting.description,shop.products.ebruPainting.tag,1200.00,3,https://images.unsplash.com/photo-1549887534-7eb66b829e10?w=500,Wall Art,true,5.0,8,true
3,shop.products.printSet.title,prints,shop.products.printSet.description,shop.products.printSet.tag,350.00,20,https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=500,Fine Art Prints,false,4.8,5,true
4,shop.products.ebruNotebook.title,accessories,shop.products.ebruNotebook.description,shop.products.ebruNotebook.tag,89.99,30,https://images.unsplash.com/photo-1507842217343-583f20270319?w=500,Accessories,true,4.9,15,true
5,shop.products.wallArt.title,wallart,shop.products.wallArt.description,shop.products.wallArt.tag,650.00,5,https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=500,Wall Art,false,5.0,6,true
6,shop.products.giftSet.title,accessories,shop.products.giftSet.description,shop.products.giftSet.tag,280.00,25,https://images.unsplash.com/photo-1549887534-7eb66b829e10?w=500,Accessories,false,4.7,9,true
```

---

## 🔐 Verifying RLS Policies

### Products Table - Check Policies

1. Table Editor → **"products"** → **"Policies"** tab
2. You should see 4 policies:
   - ✅ Public can read active products
   - ✅ Authenticated users can insert products
   - ✅ Authenticated users can update products
   - ✅ Authenticated users can delete products

### Shopping Carts Table - Check Policies

1. Table Editor → **"shopping_carts"** → **"Policies"** tab
2. You should see 4 policies:
   - ✅ Users can view their own cart
   - ✅ Users can update their own cart
   - ✅ Users can delete their own cart
   - ✅ Users can insert their own cart

### Orders Table - Check Policies

1. Table Editor → **"orders"** → **"Policies"** tab
2. You should see 4 policies:
   - ✅ Users can view their own orders
   - ✅ Users can create their own orders
   - ✅ Users can update their own orders
   - ✅ Users can delete their own orders

---

## 🧪 Testing

### Test 1: View Products

```bash
npm run dev
```

1. Go to http://localhost:5173/shop
2. You should see 6 products
3. Filters should work
4. You should be able to add products to cart

### Test 2: Checkout

1. Add 2-3 products to cart
2. Click "Checkout" button
3. Fill in shipping address
4. Select payment method
5. Click "Place Order" button
6. ✅ You should see order confirmation page
7. You should see order saved in Supabase orders table

### Test 3: SQL Query Test

Run this command in SQL Editor:

```sql
-- View all products
SELECT id, title_key, price, stock FROM products ORDER BY id;

-- View all orders
SELECT id, user_email, total, order_status FROM orders ORDER BY created_at DESC;

-- View shopping carts
SELECT id, user_id, items FROM shopping_carts;
```

---

## 🛠️ Troubleshooting

### ❌ Error: "Permission denied"

**Solution:**

- Verify RLS policies are correct
- Delete the table and rerun the SQL file
- Check admin auth.users

### ❌ CSV Upload Error

**Solution:**

- Verify CSV headers match table columns
- Check comma delimiter
- Windows: use ","
- Excel export: select UTF-8 format

### ❌ Products Not Displaying

**Solution:**

- Make sure `is_active = TRUE`
- Check products table in Table Editor and verify rows
- Check developer console for error messages

### ❌ Can't Add Products to Cart

**Solution:**

- Verify you're logged in
- Check cart store's loading/error state
- Check Network tab for API calls

---

## ✅ Successful Setup Indicators

**If everything works:**

- [ ] Products table contains 6 products
- [ ] Shop page displays products
- [ ] Filtering works
- [ ] Products can be added to cart
- [ ] Checkout form opens
- [ ] Order is successfully saved
- [ ] Order Success page displays
- [ ] Order record exists in Supabase orders table

---

## 📞 Resources

- **Supabase Docs:** https://supabase.com/docs
- **Vue 3 Composition API:** https://vuejs.org
- **Pinia Docs:** https://pinia.vuejs.org
- **Tailwind CSS:** https://tailwindcss.com

Feel free to ask if you have any questions! 🎉
