<template>
  <div class="min-h-screen bg-muted/20 pb-20 p-6">
    <div class="max-w-4xl mx-auto">

      <h1 class="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
        <Settings class="w-8 h-8 text-teal-600" />
        Site İçerik Yönetimi
      </h1>

      <div class="flex gap-4 mb-6 border-b border-border">
        <button
          @click="activeTab = 'ebru_page'"
          class="pb-2 px-4 font-medium transition-colors border-b-2"
          :class="activeTab === 'ebru_page' ? 'border-teal-600 text-teal-600' : 'border-transparent text-muted-foreground hover:text-foreground'"
        >
          Ebru Sayfası
        </button>
        <button
          @click="activeTab = 'photography_page'"
          class="pb-2 px-4 font-medium transition-colors border-b-2"
          :class="activeTab === 'photography_page' ? 'border-teal-600 text-teal-600' : 'border-transparent text-muted-foreground hover:text-foreground'"
        >
          Fotoğraf Sayfası
        </button>
      </div>

      <div v-if="contentStore.loading && !currentData" class="text-center py-12">
        <p>Veriler yükleniyor...</p>
      </div>

      <div v-else class="bg-card rounded-xl shadow-sm border border-border p-8 animate-fade-in">

        <form @submit.prevent="handleSave" class="space-y-8">

          <div class="space-y-4">
            <h3 class="font-bold text-lg border-b border-border pb-2">Sayfa Başlıkları</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-muted-foreground mb-1 block">Başlık (Türkçe)</label>
                <input v-model="form.title_tr" class="w-full p-2 bg-background border border-border rounded-md" />
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground mb-1 block">Title (English)</label>
                <input v-model="form.title_en" class="w-full p-2 bg-background border border-border rounded-md" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-muted-foreground mb-1 block">Alt Başlık (Türkçe)</label>
                <textarea v-model="form.subtitle_tr" rows="3" class="w-full p-2 bg-background border border-border rounded-md"></textarea>
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground mb-1 block">Subtitle (English)</label>
                <textarea v-model="form.subtitle_en" rows="3" class="w-full p-2 bg-background border border-border rounded-md"></textarea>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="font-bold text-lg border-b border-border pb-2">Kapak Görseli</h3>
            <div class="flex items-start gap-6">
              <div v-if="form.banner_url" class="w-32 h-20 rounded-lg overflow-hidden border border-border shrink-0">
                <img :src="form.banner_url" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <input type="file" @change="handleFileChange" accept="image/*" class="text-sm" />
                <p class="text-xs text-muted-foreground mt-1">Yeni bir resim seçerseniz kaydet butonuna bastığınızda yüklenecektir.</p>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="font-bold text-lg border-b border-border pb-2">Galeri Düzeni</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                class="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50"
                :class="form.layout_style === 'grid' ? 'border-teal-600 bg-teal-50' : 'border-border'"
              >
                <input type="radio" v-model="form.layout_style" value="grid" class="w-4 h-4 text-teal-600" />
                <div>
                  <div class="font-bold">Instagram Tarzı (Grid)</div>
                  <div class="text-xs text-muted-foreground">Kare kutular, düzenli sıralama.</div>
                </div>
                <LayoutGrid class="ml-auto w-5 h-5 text-muted-foreground" />
              </label>

              <label
                class="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50"
                :class="form.layout_style === 'masonry' ? 'border-teal-600 bg-teal-50' : 'border-border'"
              >
                <input type="radio" v-model="form.layout_style" value="masonry" class="w-4 h-4 text-teal-600" />
                <div>
                  <div class="font-bold">Pinterest Tarzı (Masonry)</div>
                  <div class="text-xs text-muted-foreground">Girintili çıkıntılı, dinamik sıralama.</div>
                </div>
                <Columns class="ml-auto w-5 h-5 text-muted-foreground" />
              </label>
            </div>
          </div>

          <button
            type="submit"
            :disabled="contentStore.loading"
            class="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span v-if="contentStore.loading" class="animate-spin w-4 h-4 border-2 border-white/50 border-t-white rounded-full"></span>
            {{ contentStore.loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}
          </button>

          <p v-if="message" class="text-center text-green-600 font-medium bg-green-50 p-2 rounded">{{ message }}</p>

        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useContentStore } from '@/stores/content'
import { Settings, LayoutGrid, Columns } from 'lucide-vue-next'

const contentStore = useContentStore()
const activeTab = ref('ebru_page') // Varsayılan sekme
const message = ref('')
const selectedFile = ref(null)

// Form verileri
const form = ref({
  title_tr: '', title_en: '',
  subtitle_tr: '', subtitle_en: '',
  layout_style: 'grid',
  banner_url: ''
})

onMounted(async () => {
  await contentStore.fetchContents()
  loadFormData()
})

// Sekme değişince formu doldur
watch(activeTab, () => {
  loadFormData()
  message.value = ''
  selectedFile.value = null
})

const loadFormData = () => {
  // Store'dan o anki sayfanın verisini çek
  const data = contentStore.contents[activeTab.value]
  if (data) {
    // Verileri kopyala (Referans kopmasın diye spread operator kullanıyoruz)
    form.value = { ...data }
  }
}

const handleFileChange = (e) => {
  selectedFile.value = e.target.files[0]
}

const handleSave = async () => {
  message.value = ''

  try {
    // 1. Resim varsa yükle
    if (selectedFile.value) {
      const url = await contentStore.uploadBanner(selectedFile.value)
      form.value.banner_url = url
    }

    // 2. Veritabanını güncelle
    const success = await contentStore.updateContent(activeTab.value, form.value)

    if (success) {
      message.value = 'Ayarlar başarıyla güncellendi!'
      setTimeout(() => message.value = '', 3000)
    }
  } catch (e) {
    alert('Hata oluştu')
  }
}
</script>
