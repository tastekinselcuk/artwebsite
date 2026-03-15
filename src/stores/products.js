import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/supabaseClient";

export const useProductStore = defineStore("products", () => {
  // State
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
    { id: "popular", labelKey: "shop.sort.popular" },
    { id: "price-low", labelKey: "shop.sort.priceLow" },
    { id: "price-high", labelKey: "shop.sort.priceHigh" },
    { id: "rating", labelKey: "shop.sort.rating" },
  ]);

  const selectedCategory = ref("all");
  const selectedSort = ref("newest");
  const searchQuery = ref("");
  const priceRange = ref([0, 10000]);

  // Veritabanı satırını Frontend formatına çevirir
  const mapRowToProduct = (row) => ({
    id: row.id,
    titleKey: row.title_key ?? "",
    categoryKey: row.category_key ?? "",
    descriptionKey: row.description_key ?? "",
    price: row.price ?? 0,
    image: row.image ?? "",
    tagKey: row.tag_key ?? "",
    category: row.category ?? "accessories",
    featured: row.featured ?? false,
    stock: row.stock ?? 0,
    rating: row.rating ?? 0,
    reviews: row.reviews ?? 0,
  });

  // Supabase'den ürünleri çek
  const fetchProductsFromSupabase = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: err } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (err) throw err;
      products.value = (data ?? []).map(mapRowToProduct);
    } catch (e) {
      console.error("Fetch Products Error:", e);
      error.value = "Ürünler yüklenirken hata oluştu";
    } finally {
      loading.value = false;
    }
  };

  const filteredProducts = computed(() => {
    let filtered = products.value;

    // Category filter
    if (selectedCategory.value !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory.value);
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange.value[0] && p.price <= priceRange.value[1],
    );

    // Search filter
    if (searchQuery.value) {
      filtered = filtered.filter((p) => p.id.toString().includes(searchQuery.value.toLowerCase()));
    }

    // Sorting
    if (selectedSort.value === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort.value === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (selectedSort.value === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort.value === "popular") {
      filtered.sort((a, b) => b.reviews - a.reviews);
    }

    return filtered;
  });

  const getProductById = (id) => {
    return products.value.find((p) => p.id === id);
  };

  const setCategory = (categoryId) => {
    selectedCategory.value = categoryId;
  };

  const setSort = (sortId) => {
    selectedSort.value = sortId;
  };

  const setSearchQuery = (query) => {
    searchQuery.value = query;
  };

  const setPriceRange = (range) => {
    priceRange.value = range;
  };

  return {
    products,
    loading,
    error,
    categories,
    sortOptions,
    selectedCategory,
    selectedSort,
    searchQuery,
    priceRange,
    filteredProducts,
    getProductById,
    setCategory,
    setSort,
    setSearchQuery,
    setPriceRange,
    fetchProductsFromSupabase,
  };
});
