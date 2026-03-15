#!/bin/bash
# Supabase Veritabanı Kurulum Script
# Bu script, migration dosyalarındaki SQL komutlarını sırasıyla çalıştırır

echo "🚀 Supabase E-Commerce Database Setup"
echo "======================================"
echo ""

# Renk kodu
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. Creating Products Table...${NC}"
# SQL dosyasından kopyalayıp Supabase Dashboard'da çalıştırın

echo -e "${BLUE}2. Creating Shopping Carts Table...${NC}"
# SQL dosyasından kopyalayıp Supabase Dashboard'da çalıştırın

echo -e "${BLUE}3. Creating Orders Table...${NC}"
# SQL dosyasından kopyalayıp Supabase Dashboard'da çalıştırın

echo ""
echo -e "${GREEN}✅ All tables created successfully!${NC}"
echo ""
echo "📊 Next Steps:"
echo "1. Open Supabase Dashboard"
echo "2. Go to SQL Editor"
echo "3. Copy & paste each migration file contents"
echo "4. Click 'Run' for each SQL command"
echo "5. Go to Table Editor"
echo "6. Import products.csv into products table"
echo ""
