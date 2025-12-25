<template>
  <div class="min-h-screen bg-muted/20 pb-20">
    <header class="bg-card shadow-sm border-b border-border sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-foreground flex items-center gap-3">
          <span class="p-2 bg-teal-100 rounded-lg text-teal-600 shadow-sm">
            <Palette class="w-6 h-6" />
          </span>
          Ebru Yönetimi
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
              <component :is="isEditing ? Edit2 : Plus" class="w-5 h-5 text-teal-600" />
              {{ isEditing ? 'Eseri Düzenle' : 'Yeni Ebru Ekle' }}
            </h2>
            <button
              v-if="isEditing"
              @click="cancelEdit"
              class="text-xs text-red-500 hover:text-red-700 underline"
            >
              İptal Et
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-muted-foreground">Eser Görseli</label>
              <label
                class="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden group"
                :class="{'border-teal-500 bg-teal-50/30': previewUrl}"
              >
                <img v-if="previewUrl" :src="previewUrl" class="absolute inset-0 w-full h-full object-contain p-2" />
                <div v-else class="text-center p-4 group-hover:scale-105 transition-transform">
                  <div class="w-10 h-10 bg-muted rounded-full flex items-center justify-center mx-auto mb-2 text-muted-foreground">
                    <Upload class="w-5 h-5" />
                  </div>
                  <p class="text-sm font-medium text-foreground">
                    {{ isEditing ? 'Görseli Değiştir (İsteğe Bağlı)' : 'Görsel Seç' }}
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
                  <input v-model="form.titleTr" required class="p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-teal-500/20 outline-none" placeholder="Türkçe" />
                  <input v-model="form.titleEn" required class="p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-teal-500/20 outline-none" placeholder="English" />
                </div>
              </div>

              <div>
                <label class="text-xs font-bold text-muted-foreground uppercase">Açıklama (TR / EN)</label>
                <div class="space-y-2 mt-1">
                  <textarea v-model="form.descTr" rows="2" class="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-teal-500/20 outline-none" placeholder="Türkçe Açıklama"></textarea>
                  <textarea v-model="form.descEn" rows="2" class="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-teal-500/20 outline-none" placeholder="English Description"></textarea>
                </div>
              </div>

              <div>
                <label class="text-xs font-bold text-muted-foreground uppercase">Yıl</label>
                <input v-model="form.year" class="w-full mt-1 p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-teal-500/20 outline-none" />
              </div>
            </div>

            <button
              type="submit"
              :disabled="galleryStore.loading"
              class="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
            >
              <span v-if="galleryStore.loading" class="animate-spin w-4 h-4 border-2 border-white/50 border-t-white rounded-full"></span>
              {{ galleryStore.loading ? 'İşleniyor...' : (isEditing ? 'Değişiklikleri Kaydet' : 'Koleksiyona Ekle') }}
            </button>

            <p v-if="successMessage" class="text-sm text-green-600 text-center bg-green-50 p-2 rounded">{{ successMessage }}</p>
            <p v-if="galleryStore.error" class="text-sm text-red-600 text-center bg-red-50 p-2 rounded">{{ galleryStore.error }}</p>
          </form>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div class="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
            <h3 class="font-bold text-foreground">Mevcut Ebru Eserleri</h3>
            <span class="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-mono">
              {{ galleryStore.totalEbruCount }} Adet
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th class="px-4 py-3">Görsel</th>
                  <th class="px-4 py-3">Detaylar</th>
                  <th class="px-4 py-3 text-center">İzlenme</th>
                  <th class="px-4 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr
                  v-for="artwork in galleryStore.ebruArtworks"
                  :key="artwork.id"
                  class="hover:bg-muted/20 transition-colors group"
                  :class="{'bg-teal-50/50': editingId === artwork.id}"
                >
                  <td class="px-4 py-3 w-16">
                    <img :src="artwork.image || 'https://placehold.co/100'" class="w-12 h-12 object-cover rounded shadow-sm border border-border" />
                  </td>
                  <td class="px-4 py-3">
                    <div class="font-medium text-foreground">{{ artwork.title.tr }}</div>
                    <div class="text-xs text-muted-foreground">{{ artwork.title.en }} • {{ artwork.year }}</div>
                  </td>
                  <td class="px-4 py-3 text-center font-mono text-muted-foreground">
                    {{ artwork.views }}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        @click="startEdit(artwork)"
                        class="text-muted-foreground hover:text-teal-600 hover:bg-teal-50 p-2 rounded transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 class="w-4 h-4" />
                      </button>

                      <button
                        @click="galleryStore.deleteArtwork(artwork.id, 'ebru', artwork.image)"
                        class="text-muted-foreground hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                        title="Sil"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
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
import { useGalleryStore } from '@/stores/gallery'
import { ArrowLeft, Plus, Trash2, Palette, Upload, Edit2 } from 'lucide-vue-next'

const galleryStore = useGalleryStore()
const fileInput = ref(null)
const previewUrl = ref(null)
const successMessage = ref('')

// Edit Modu Değişkenleri
const isEditing = ref(false)
const editingId = ref(null)
const currentImageUrl = ref(null) // Edit modunda eski resim URL'ini tutar

const form = ref({
  titleTr: '', titleEn: '', descTr: '', descEn: '',
  year: new Date().getFullYear().toString()
})

onMounted(() => {
  galleryStore.fetchEbruFromSupabase()
})

// DÜZENLEME MODUNU BAŞLAT
const startEdit = (artwork) => {
  isEditing.value = true
  editingId.value = artwork.id
  currentImageUrl.value = artwork.image

  // Formu doldur
  form.value = {
    titleTr: artwork.title.tr,
    titleEn: artwork.title.en,
    descTr: artwork.description.tr,
    descEn: artwork.description.en,
    year: artwork.year
  }

  // Önizlemeyi ayarla
  previewUrl.value = artwork.image
  fileInput.value = null // Dosya inputunu sıfırla

  // Sayfayı yukarı kaydır (Telefondan girenler için)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// DÜZENLEMEYİ İPTAL ET
const cancelEdit = () => {
  isEditing.value = false
  editingId.value = null
  currentImageUrl.value = null
  resetForm()
}

const resetForm = () => {
  form.value = { titleTr: '', titleEn: '', descTr: '', descEn: '', year: new Date().getFullYear().toString() }
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
  // Eğer edit modundaysak ve resim seçilmediyse sorun yok.
  // Ama yeni ekliyorsak resim şart.
  if (!isEditing.value && !fileInput.value) {
    return alert('Lütfen bir görsel seçin.')
  }

  successMessage.value = ''

  try {
    let finalImageUrl = currentImageUrl.value // Varsayılan olarak eski resim

    // Eğer YENİ bir dosya seçildiyse yükle
    if (fileInput.value) {
      finalImageUrl = await galleryStore.uploadImage(fileInput.value)
    }

    if (isEditing.value) {
      // --- GÜNCELLEME İŞLEMİ ---
      const success = await galleryStore.updateArtwork(editingId.value, 'ebru', {
        title: { en: form.value.titleEn, tr: form.value.titleTr },
        description: { en: form.value.descEn, tr: form.value.descTr },
        year: form.value.year,
        image: finalImageUrl // Yeni yüklendiyse yenisi, yoksa eskisi
      })

      if (success) {
        successMessage.value = 'Eser başarıyla güncellendi!'
        cancelEdit() // Formu temizle ve moddan çık
      }

    } else {
      // --- YENİ EKLEME İŞLEMİ ---
      const success = await galleryStore.createArtwork({
        type: 'ebru',
        titleTr: form.value.titleTr,
        titleEn: form.value.titleEn,
        descTr: form.value.descTr,
        descEn: form.value.descEn,
        year: form.value.year,
        imageUrl: finalImageUrl
      })

      if (success) {
        successMessage.value = 'Eser başarıyla eklendi!'
        resetForm()
      }
    }

    // Mesajı temizle
    setTimeout(() => { successMessage.value = '' }, 3000)

  } catch (e) {
    console.error(e)
  }
}
</script>
