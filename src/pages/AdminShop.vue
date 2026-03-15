<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <h1 class="text-3xl font-display font-bold text-foreground">
        {{ t("admin.shop.title") || "Shop Management" }}
      </h1>
      <button
        @click="showAddModal = true"
        class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
      >
        <Plus class="w-5 h-5" />
        {{ t("admin.shop.addNew") || "Add Product" }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="productStore.loading" class="p-6 text-center">
      <div class="inline-block">
        <div class="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
      <p class="text-muted-foreground mt-4">{{ t("common.loading") || "Loading..." }}</p>
    </div>

    <!-- Error State -->
    <div v-if="productStore.error" class="p-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {{ productStore.error }}
      </div>
    </div>

    <!-- Products Table -->
    <div v-if="!productStore.loading && productStore.products.length > 0" class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-muted border-b border-border">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold">Image</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Title Key</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Category</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Price</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Stock</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Rating</th>
            <th class="px-6 py-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in productStore.products"
            :key="product.id"
            class="border-b border-border hover:bg-muted/50 transition-colors"
          >
            <td class="px-6 py-4">
              <img
                :src="product.image"
                :alt="product.titleKey"
                class="w-12 h-12 rounded object-cover"
              />
            </td>
            <td class="px-6 py-4 text-sm text-foreground">{{ product.titleKey }}</td>
            <td class="px-6 py-4 text-sm">
              <span class="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">{{
                product.category
              }}</span>
            </td>
            <td class="px-6 py-4 text-sm font-medium">{{ formatPrice(product.price) }}</td>
            <td class="px-6 py-4 text-sm">
              <span
                :class="[product.stock > 0 ? 'text-green-600' : 'text-red-600', 'font-medium']"
                >{{ product.stock }}</span
              >
            </td>
            <td class="px-6 py-4 text-sm">
              <div class="flex items-center gap-1">
                <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{{ product.rating }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm">
              <div class="flex gap-2">
                <button
                  @click="editProduct(product)"
                  class="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                >
                  {{ t("admin.edit") || "Edit" }}
                </button>
                <button
                  @click="deleteProduct(product.id)"
                  class="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                >
                  {{ t("admin.delete") || "Delete" }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div
      v-if="!productStore.loading && productStore.products.length === 0"
      class="p-12 text-center"
    >
      <ShoppingBag class="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
      <p class="text-muted-foreground">{{ t("admin.shop.noProducts") || "No products yet" }}</p>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-card rounded-lg max-w-md w-full p-6 border border-border">
        <h2 class="text-xl font-display font-bold text-foreground mb-4">
          {{ editingProduct ? t("admin.shop.editTitle") : t("admin.shop.addTitle") }}
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Title Key</label>
            <input
              v-model="formData.title_key"
              type="text"
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Price (TRY)</label>
            <input
              v-model.number="formData.price"
              type="number"
              step="0.01"
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Stock</label>
            <input
              v-model.number="formData.stock"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Category</label>
            <select
              v-model="formData.category"
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="apparel">Apparel</option>
              <option value="wallart">Wall Art</option>
              <option value="prints">Prints</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Rating</label>
            <input
              v-model.number="formData.rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-1">
              <input v-model="formData.featured" type="checkbox" class="mr-2" />
              Featured Product
            </label>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              @click="showAddModal = false"
              class="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              {{ t("admin.cancel") || "Cancel" }}
            </button>
            <button
              @click="saveProduct"
              class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {{ editingProduct ? t("admin.update") : t("admin.add") || "Add" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useProductStore } from "@/stores/products";
import { Plus, Star, ShoppingBag } from "lucide-vue-next";

const { t } = useI18n();
const productStore = useProductStore();

const showAddModal = ref(false);
const editingProduct = ref(null);
const formData = ref({
  title_key: "",
  category_key: "",
  description_key: "",
  price: 0,
  stock: 0,
  category: "accessories",
  featured: false,
  rating: 0,
});

const formatPrice = (price) => {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price);
};

const editProduct = (product) => {
  editingProduct.value = product;
  formData.value = { ...product };
  showAddModal.value = true;
};

const saveProduct = async () => {
  // TODO: Implement save to Supabase
  console.log("Save product:", formData.value);
  showAddModal.value = false;
};

const deleteProduct = async (id) => {
  if (confirm("Are you sure?")) {
    // TODO: Implement delete from Supabase
    console.log("Delete product:", id);
  }
};

// Fetch products
productStore.fetchProductsFromSupabase();
</script>
