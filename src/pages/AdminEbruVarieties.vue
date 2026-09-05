<template>
  <div class="min-h-screen bg-muted/20 pb-20">
    <header class="bg-card shadow-sm border-b border-border sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-foreground flex items-center gap-3">
          <span class="p-2 bg-primary/10 rounded-lg text-primary shadow-sm">
            <Layers class="w-6 h-6" />
          </span>
          Ebru Çeşitleri
        </h1>
        <router-link
          to="/admin/dashboard"
          class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Panele Dön
        </router-link>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-card rounded-xl shadow-sm border border-border p-6 sticky top-24">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold text-lg flex items-center gap-2 text-foreground">
              <component :is="isEditing ? Edit2 : Plus" class="w-5 h-5 text-primary" />
              {{ isEditing ? "Çeşidi Düzenle" : "Yeni Çeşit Ekle" }}
            </h2>
            <button
              v-if="isEditing"
              type="button"
              @click="cancelEdit"
              class="text-xs text-red-500 hover:text-red-700 underline"
            >
              İptal
            </button>
          </div>

          <p class="text-xs text-muted-foreground mb-4 leading-relaxed">
            Ana sayfadaki “Ebru Çeşitleri” vitrininde görünür. Başlık, açıklama ve örnek görsel
            yönetebilirsiniz.
          </p>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-muted-foreground">Örnek Görsel</label>
              <label
                class="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden group"
                :class="{ 'border-primary bg-primary/5': previewUrl }"
              >
                <img
                  v-if="previewUrl"
                  :src="previewUrl"
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div v-else class="text-center p-4">
                  <Upload class="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <p class="text-sm font-medium text-foreground">Görsel Seç</p>
                  <p class="text-xs text-muted-foreground">JPG, PNG</p>
                </div>
                <input
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="handleFileSelect"
                  :required="!isEditing && !previewUrl"
                />
              </label>
            </div>

            <div>
              <label class="text-xs font-bold text-muted-foreground uppercase">Başlık (TR / EN)</label>
              <div class="grid grid-cols-2 gap-2 mt-1">
                <input
                  v-model="form.titleTr"
                  required
                  class="p-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Türkçe"
                />
                <input
                  v-model="form.titleEn"
                  required
                  class="p-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="English"
                />
              </div>
            </div>

            <div>
              <label class="text-xs font-bold text-muted-foreground uppercase"
                >Açıklama / Alt başlık (TR / EN)</label
              >
              <div class="space-y-2 mt-1">
                <textarea
                  v-model="form.descTr"
                  rows="3"
                  required
                  class="w-full p-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Türkçe açıklama"
                />
                <textarea
                  v-model="form.descEn"
                  rows="3"
                  required
                  class="w-full p-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="English description"
                />
              </div>
            </div>

            <div>
              <label class="text-xs font-bold text-muted-foreground uppercase">Sıra</label>
              <input
                v-model.number="form.sortOrder"
                type="number"
                min="0"
                class="w-full mt-1 p-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="submit"
              :disabled="store.loading"
              class="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span
                v-if="store.loading"
                class="animate-spin w-4 h-4 border-2 border-white/50 border-t-white rounded-full"
              />
              {{ store.loading ? "İşleniyor..." : isEditing ? "Kaydet" : "Çeşit Ekle" }}
            </button>

            <p
              v-if="successMessage"
              class="text-sm text-green-600 text-center bg-green-50 p-2 rounded"
            >
              {{ successMessage }}
            </p>
            <p v-if="store.error" class="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
              {{ store.error }}
            </p>
          </form>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div class="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
            <h3 class="font-bold text-foreground">Mevcut Çeşitler</h3>
            <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-mono">
              {{ store.varieties.length }} Adet
            </span>
          </div>

          <div v-if="store.loading && !store.varieties.length" class="p-8 text-center text-muted-foreground">
            Yükleniyor...
          </div>

          <div v-else-if="!store.varieties.length" class="p-8 text-center text-muted-foreground">
            Henüz çeşit yok. Soldan ekleyin.
          </div>

          <ul v-else class="divide-y divide-border">
            <li
              v-for="item in store.varieties"
              :key="item.id"
              class="flex gap-4 p-4 hover:bg-muted/20 transition-colors"
              :class="{ 'bg-primary/5': editingId === item.id }"
            >
              <div
                class="w-20 h-20 rounded-lg overflow-hidden bg-muted border border-border shrink-0"
              >
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.title.tr"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-muted-foreground/40 text-xs"
                >
                  Görsel yok
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-display font-semibold text-foreground">{{ item.title.tr }}</p>
                    <p class="text-xs text-muted-foreground">{{ item.title.en }}</p>
                    <p class="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                      {{ item.description.tr }}
                    </p>
                    <p class="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground/70">
                      Sıra: {{ item.sortOrder }}
                    </p>
                  </div>
                  <div class="flex gap-1 shrink-0">
                    <button
                      type="button"
                      @click="startEdit(item)"
                      class="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Düzenle"
                    >
                      <Edit2 class="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      @click="store.deleteVariety(item.id, item.image)"
                      class="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Sil"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { ArrowLeft, Layers, Plus, Edit2, Upload, Trash2 } from "lucide-vue-next";
import { useEbruVarietiesStore } from "@/stores/ebruVarieties";

const store = useEbruVarietiesStore();

const editingId = ref(null);
const selectedFile = ref(null);
const previewUrl = ref("");
const currentImageUrl = ref("");
const successMessage = ref("");

const form = ref({
  titleTr: "",
  titleEn: "",
  descTr: "",
  descEn: "",
  sortOrder: 1,
});

const isEditing = computed(() => editingId.value !== null);

const resetForm = () => {
  form.value = {
    titleTr: "",
    titleEn: "",
    descTr: "",
    descEn: "",
    sortOrder: store.varieties.length + 1,
  };
  selectedFile.value = null;
  previewUrl.value = "";
  currentImageUrl.value = "";
  editingId.value = null;
};

const cancelEdit = () => {
  resetForm();
  successMessage.value = "";
};

const startEdit = (item) => {
  editingId.value = item.id;
  currentImageUrl.value = item.image || "";
  previewUrl.value = item.image || "";
  selectedFile.value = null;
  form.value = {
    titleTr: item.title.tr,
    titleEn: item.title.en,
    descTr: item.description.tr,
    descEn: item.description.en,
    sortOrder: item.sortOrder,
  };
  successMessage.value = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
};

const handleSubmit = async () => {
  successMessage.value = "";
  let imageUrl = currentImageUrl.value;

  try {
    if (selectedFile.value) {
      imageUrl = await store.uploadImage(selectedFile.value);
    }

    if (isEditing.value) {
      const ok = await store.updateVariety(editingId.value, {
        title: { tr: form.value.titleTr, en: form.value.titleEn },
        description: { tr: form.value.descTr, en: form.value.descEn },
        image: imageUrl || null,
        sort_order: form.value.sortOrder,
      });
      if (ok) {
        successMessage.value = "Çeşit güncellendi.";
        resetForm();
      }
    } else {
      const ok = await store.createVariety({
        titleTr: form.value.titleTr,
        titleEn: form.value.titleEn,
        descTr: form.value.descTr,
        descEn: form.value.descEn,
        image: imageUrl,
        sortOrder: form.value.sortOrder,
      });
      if (ok) {
        successMessage.value = "Çeşit eklendi.";
        resetForm();
      }
    }
  } catch (e) {
    console.error(e);
    store.error = "Görsel yüklenirken hata oluştu.";
  }
};

onMounted(async () => {
  await store.fetchVarieties({ includeInactive: true });
  form.value.sortOrder = store.varieties.length + 1;
});
</script>
