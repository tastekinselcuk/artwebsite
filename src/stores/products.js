import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/supabaseClient";

export const useProductStore = defineStore("products", () => {
  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const categories = ref([
    { id: "all", labelKey: "shop.filters.all" },
    { id: "apparel", labelKey: "shop.filters.apparel" },
    { id: "wallart", labelKey: "shop.filters.wallart" },
    { id: "prints", labelKey: "shop.filters.prints" },
    { id: "accessories", labelKey: "shop.filters.accessories" },
  ]);

  const sortOptions = ref([
    { id: "newest", labelKey: "shop.sort.newest" },
    { id: "priceLow", labelKey: "shop.sort.priceLow" },
    { id: "priceHigh", labelKey: "shop.sort.priceHigh" },
    { id: "rating", labelKey: "shop.sort.rating" },
  ]);

  const selectedCategory = ref("all");
  const selectedSort = ref("newest");
  const searchQuery = ref("");
  const priceRange = ref([0, 10000]);

  // JSONB dil formatına uygun eşleme
  const mapRowToProduct = (row) => ({
    id: row.id,
    title: { en: row.title?.en ?? "", tr: row.title?.tr ?? "" },
    description: { en: row.description?.en ?? "", tr: row.description?.tr ?? "" },
    price: row.price ?? 0,
    image: row.image ?? "",
    category: row.category ?? "accessories",
    stock: row.stock ?? 0,
    rating: row.rating ?? 5.0,
    reviews: row.reviews ?? 0,
    isActive: row.is_active ?? true
  });

  // 1. Ürünleri Çek
  const fetchProductsFromSupabase = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: err } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (err) throw err;
      products.value = (data ?? []).map(mapRowToProduct);
    } catch (e) {
      console.error("Fetch Products Error:", e);
      error.value = "Ürünler yüklenirken hata oluştu.";
    } finally {
      loading.value = false;
    }
  };

  // 2. Resim Yükleme
  const uploadImage = async (file) => {
    loading.value = true;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (e) {
      console.error('Upload Error:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // 3. Yeni Ürün Ekle (Create)
  const createProduct = async (productData) => {
    loading.value = true;
    try {
      const dbPayload = {
        title: { en: productData.titleEn, tr: productData.titleTr },
        description: { en: productData.descEn, tr: productData.descTr },
        price: productData.price,
        stock: productData.stock,
        category: productData.category,
        rating: productData.rating,
        image: productData.image,
        is_active: true
      };

      const { data, error: dbError } = await supabase
        .from('products')
        .insert([dbPayload])
        .select();

      if (dbError) throw dbError;

      products.value.unshift(mapRowToProduct(data[0]));
      return true;
    } catch (e) {
      console.error('Create Error:', e);
      error.value = 'Ürün ekleme başarısız.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // 4. Ürün Güncelle (Update)
  const updateProduct = async (id, updatedFields) => {
    loading.value = true;
    try {
      const { data, error: dbError } = await supabase
        .from('products')
        .update(updatedFields)
        .eq('id', id)
        .select();

      if (dbError) throw dbError;

      const updatedItem = mapRowToProduct(data[0]);
      const index = products.value.findIndex(p => p.id === id);
      if (index !== -1) products.value[index] = updatedItem;

      return true;
    } catch (e) {
      console.error('Update Error:', e);
      error.value = 'Ürün güncelleme başarısız.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // 5. Ürün Sil (Delete)
  const deleteProduct = async (id, imageUrl) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return false;

    loading.value = true;
    try {
      const { error: dbError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      products.value = products.value.filter(item => item.id !== id);

      if (imageUrl && imageUrl.includes('product-images')) {
        const fileName = imageUrl.split('product-images/').pop();
        if (fileName) {
          await supabase.storage.from('product-images').remove([fileName]);
        }
      }
      return true;
    } catch (e) {
      console.error('Delete Error:', e);
      error.value = 'Silme işlemi başarısız.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // --- FİLTRELEME, ARAMA VE SIRALAMA MANTIĞI ---
  const filteredProducts = computed(() => {
    // 1. Sadece aktif olanları al
    let filtered = products.value.filter(p => p.isActive);

    // 2. Kategori Filtresi
    if (selectedCategory.value !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory.value);
    }

    // 3. Fiyat Filtresi
    filtered = filtered.filter((p) => p.price >= priceRange.value[0] && p.price <= priceRange.value[1]);

    // 4. Arama Filtresi (Kullanıcı arama yaparsa TR veya EN başlıkta arar)
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter((p) => 
        (p.title?.tr?.toLowerCase().includes(query)) ||
        (p.title?.en?.toLowerCase().includes(query))
      );
    }

    // 5. Sıralama İşlemleri
    if (selectedSort.value === "priceLow") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort.value === "priceHigh") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (selectedSort.value === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort.value === "popular") {
      filtered.sort((a, b) => b.reviews - a.reviews);
    } else if (selectedSort.value === "newest") {
      // ID'si büyük olan son eklenmiştir mantığıyla çalışır
      filtered.sort((a, b) => b.id - a.id); 
    }

    return filtered;
  });

  const getProductById = (id) => {
    return products.value.find((p) => p.id === id);
  };

  const setCategory = (c) => selectedCategory.value = c;
  const setSort = (s) => selectedSort.value = s;
  const setSearchQuery = (q) => searchQuery.value = q;
  const setPriceRange = (r) => priceRange.value = r;

  return {
    products, loading, error, categories, sortOptions,
    selectedCategory, selectedSort, searchQuery, priceRange, filteredProducts,
    getProductById, setCategory, setSort, setSearchQuery, setPriceRange,
    fetchProductsFromSupabase, uploadImage, createProduct, updateProduct, deleteProduct
  };
});