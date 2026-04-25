<template>
  <div class="min-h-screen bg-muted/20 pb-20">
    <header class="bg-card shadow-sm border-b border-border sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-foreground flex items-center gap-3">
          <span class="p-2 bg-primary/10 rounded-lg text-primary shadow-sm">
            <ShoppingBag class="w-6 h-6" />
          </span>
          {{ t("admin.shop.title") || "Mağaza Yönetimi" }}
        </h1>
        <router-link
          to="/admin/dashboard"
          class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {{ t("admin.login.backToHome") || "Ana Sayfaya Dön" }}
        </router-link>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">

      <div class="lg:col-span-1 space-y-6">
        <div class="bg-card rounded-xl shadow-sm border border-border p-6 sticky top-24">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold text-lg flex items-center gap-2 text-foreground">
              <component :is="isEditing ? Edit2 : Plus" class="w-5 h-5 text-primary" />
              {{ isEditing ? (t("admin.shop.editTitle") || "Ürünü Düzenle") : (t("admin.shop.addTitle") || "Yeni Ürün Ekle") }}
            </h2>
            <button
              v-if="isEditing"
              @click="cancelEdit"
              class="text-xs text-red-500 hover:text-red-700 underline font-medium"
            >
              {{ t("admin.shop.cancel") || "İptal" }}
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-muted-foreground">{{ t("admin.shop.imageUrl") || "Görsel Seç" }}</label>
              <label
                class="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden group"
                :class="{'border-primary bg-primary/5': previewUrl}"
              >
                <img v-if="previewUrl" :src="previewUrl" class="absolute inset-0 w-full h-full object-contain p-2" />
                <div v-else class="text-center p-4 group-hover:scale-105 transition-transform">
                  <div class="w-10 h-10 bg-muted rounded-full flex items-center justify-center mx-auto mb-2 text-muted-foreground">
                    <Upload class="w-5 h-5" />
                  </div>
                  <p class="text-sm font-medium text-foreground">
                    {{ isEditing ? 'Görseli Değiştir' : 'Görsel Seç' }}
                  </p>
                  <p class="text-xs text-muted-foreground">JPG, PNG (Max 5MB)</p>
                </div>
                <input type="file" class="hidden" @change="handleFileSelect" accept="image/*" :required="!isEditing && !previewUrl" />
              </label>
            </div>

            <div class="space-y-3">
              <div>
                <label class="text-xs font-bold text-muted-foreground uppercase">Başlık (TR / EN)</label>
                <div class="grid grid-cols-2 gap-2 mt-1">
                  <input v-model="form.titleTr" required class="p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Türkçe" />
                  <input v-model="form.titleEn" required class="p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="English" />
                </div>
              </div>

              <div>
                <label class="text-xs font-bold text-muted-foreground uppercase">Açıklama (TR / EN)</label>
                <div class="space-y-2 mt-1">
                  <textarea v-model="form.descTr" rows="2" class="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none" placeholder="Türkçe Açıklama"></textarea>
                  <textarea v-model="form.descEn" rows="2" class="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none" placeholder="English Description"></textarea>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-muted-foreground uppercase">{{ t("admin.shop.price") || "Fiyat" }}</label>
                <input v-model.number="form.price" type="number" step="0.01" required class="w-full mt-1 p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label class="text-xs font-bold text-muted-foreground uppercase">{{ t("admin.shop.stock") || "Stok" }}</label>
                <input v-model.number="form.stock" type="number" required class="w-full mt-1 p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-muted-foreground uppercase">{{ t("admin.shop.category") || "Kategori" }}</label>
                <select v-model="form.category" class="w-full mt-1 p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                  <option value="apparel">Giyim (Apparel)</option>
                  <option value="wallart">Duvar Sanatı (Wall Art)</option>
                  <option value="prints">Baskı (Prints)</option>
                  <option value="accessories">Aksesuar (Accessories)</option>
                </select>
              </div>
              <div>
                <label class="text-xs font-bold text-muted-foreground uppercase">{{ t("admin.shop.rating") || "Puan" }}</label>
                <input v-model.number="form.rating" type="number" min="0" max="5" step="0.1" class="w-full mt-1 p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>

            <button
              type="submit"
              :disabled="productStore.loading"
              class="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-bold disabled:opacity-50 shadow-md flex items-center justify-center gap-2 mt-4"
            >
              <span v-if="productStore.loading" class="animate-spin w-4 h-4 border-2 border-white/50 border-t-white rounded-full"></span>
              {{ productStore.loading ? 'İşleniyor...' : (isEditing ? (t("admin.shop.update") || "Güncelle") : (t("admin.shop.add") || "Ekle")) }}
            </button>

            <p v-if="successMessage" class="text-sm font-medium text-green-600 text-center bg-green-50 p-2 rounded-lg">{{ successMessage }}</p>
            <p v-if="productStore.error" class="text-sm font-medium text-red-600 text-center bg-red-50 p-2 rounded-lg">{{ productStore.error }}</p>
          </form>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div class="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
            <h3 class="font-bold text-foreground">Ürünler</h3>
            <span class="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-mono font-bold">
              {{ productStore.products.length }} Ürün
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th class="px-4 py-3">Görsel & Başlık</th>
                  <th class="px-4 py-3">Kategori</th>
                  <th class="px-4 py-3 text-center">Fiyat / Stok</th>
                  <th class="px-4 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr
                  v-for="product in productStore.products"
                  :key="product.id"
                  class="hover:bg-muted/20 transition-colors group"
                  :class="{'bg-primary/5': editingId === product.id}"
                >
                  <td class="px-4 py-3 flex items-center gap-3">
                    <img :src="product.image || 'https://placehold.co/100'" class="w-12 h-12 object-cover rounded border border-border shrink-0" />
                    <div>
                      <div class="font-medium text-foreground line-clamp-1">
                        {{ product.title?.tr || (typeof product.title === 'string' ? product.title : 'İsimsiz') }}
                      </div>
                      <div class="text-xs text-muted-foreground line-clamp-1">
                        {{ product.title?.en || '' }}
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 bg-muted rounded text-xs font-medium">{{ t(`shop.filters.${product.category || 'all'}`) }}</span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <div class="font-medium">{{ formatPrice(product.price) }}</div>
                    <div :class="[product.stock > 0 ? 'text-green-600' : 'text-red-500', 'text-xs font-bold']">
                      {{ product.stock }} Adet
                    </div>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-1">
                      <button
                        @click="startEdit(product)"
                        class="text-muted-foreground hover:text-primary hover:bg-primary/10 p-2 rounded transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 class="w-4 h-4" />
                      </button>
                      <button
                        @click="productStore.deleteProduct(product.id, product.image)"
                        class="text-muted-foreground hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                        title="Sil"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="productStore.products.length === 0">
                  <td colspan="4" class="px-4 py-12 text-center text-muted-foreground">
                    <ShoppingBag class="w-8 h-8 mx-auto mb-2 opacity-30" />
                    {{ t("admin.shop.noProducts") || "Hiç ürün bulunamadı." }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProductStore } from '@/stores/products'
import { ArrowLeft, Plus, Trash2, ShoppingBag, Upload, Edit2 } from 'lucide-vue-next'

const { t } = useI18n()
const productStore = useProductStore()
const fileInput = ref(null)
const previewUrl = ref(null)
const successMessage = ref('')

const isEditing = ref(false)
const editingId = ref(null)
const currentImageUrl = ref(null)

const form = ref({
  titleTr: '', titleEn: '', descTr: '', descEn: '',
  price: 0, stock: 1, category: 'accessories', rating: 5.0
})

const formatPrice = (price) => {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price || 0);
}

onMounted(() => {
  productStore.fetchProductsFromSupabase()
})

// GÜVENLİK (Fallback): Düzenlemeye başlarken objeyi garantilemek
const startEdit = (product) => {
  isEditing.value = true
  editingId.value = product.id
  currentImageUrl.value = product.image

  form.value = {
    // Eğer eskiden kalan bir metinse (string) onu TR'ye ata, obje ise .tr'yi al
    titleTr: product.title?.tr || (typeof product.title === 'string' ? product.title : ''),
    titleEn: product.title?.en || '',
    descTr: product.description?.tr || (typeof product.description === 'string' ? product.description : ''),
    descEn: product.description?.en || '',
    price: product.price || 0,
    stock: product.stock || 0,
    category: product.category || 'accessories',
    rating: product.rating || 5.0
  }

  previewUrl.value = product.image
  fileInput.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEdit = () => {
  isEditing.value = false
  editingId.value = null
  currentImageUrl.value = null
  resetForm()
}

const resetForm = () => {
  form.value = { 
    titleTr: '', titleEn: '', descTr: '', descEn: '', 
    price: 0, stock: 1, category: 'accessories', rating: 5.0 
  }
  fileInput.value = null
  previewUrl.value = null
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    fileInput.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  if (!isEditing.value && !fileInput.value) {
    return alert('Lütfen bir görsel seçin.')
  }

  successMessage.value = ''

  try {
    let finalImageUrl = currentImageUrl.value

    if (fileInput.value) {
      finalImageUrl = await productStore.uploadImage(fileInput.value)
    }

    if (isEditing.value) {
      const success = await productStore.updateProduct(editingId.value, {
        title: { en: form.value.titleEn, tr: form.value.titleTr },
        description: { en: form.value.descEn, tr: form.value.descTr },
        price: form.value.price,
        stock: form.value.stock,
        category: form.value.category,
        rating: form.value.rating,
        image: finalImageUrl
      })

      if (success) {
        successMessage.value = 'Ürün başarıyla güncellendi!'
        cancelEdit()
      }
    } else {
      const success = await productStore.createProduct({
        ...form.value,
        image: finalImageUrl
      })

      if (success) {
        successMessage.value = 'Ürün başarıyla eklendi!'
        resetForm()
      }
    }

    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (e) {
    console.error(e)
  }
}
</script>