<template>
  <div class="min-h-screen bg-muted/20 pb-20">
    <header class="bg-card shadow-sm border-b border-border sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-foreground flex items-center gap-3">
          <Settings class="w-6 h-6 text-primary" />
          Site Ayarları & İçerik
        </h1>
        <router-link to="/admin/dashboard" class="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2">
          <ArrowLeft class="w-4 h-4" /> Panele Dön
        </router-link>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-6 py-8 animate-fade-in">

      <div v-if="settingsStore.loading" class="py-12 text-center text-muted-foreground">
        Ayarlar yükleniyor...
      </div>

      <div v-else class="space-y-8">

        <div class="flex gap-2 overflow-x-auto pb-2 border-b border-border">
          <button
            v-for="(items, groupName) in settingsStore.groupedSettings"
            :key="groupName"
            @click="activeTab = groupName"
            class="px-4 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap"
            :class="activeTab === groupName ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'"
          >
            {{ groupLabels[groupName] || groupName }}
          </button>
        </div>

        <div class="bg-card rounded-xl shadow-sm border border-border p-6 space-y-8">

          <div v-for="setting in settingsStore.groupedSettings[activeTab]" :key="setting.key" class="space-y-3 pb-6 border-b border-border last:border-0">

            <div class="flex justify-between items-start">
              <label class="font-bold text-foreground">{{ setting.label }}</label>
              <span class="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">{{ setting.key }}</span>
            </div>

            <div v-if="setting.input_type === 'text'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <span class="text-xs text-muted-foreground uppercase font-bold">Türkçe</span>
                <input
                  :value="setting.value.tr"
                  @input="e => updateField(setting, 'tr', e.target.value)"
                  class="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div class="space-y-1">
                <span class="text-xs text-muted-foreground uppercase font-bold">English</span>
                <input
                  :value="setting.value.en"
                  @input="e => updateField(setting, 'en', e.target.value)"
                  class="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            <div v-else-if="setting.input_type === 'textarea'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div class="space-y-1">
                <span class="text-xs text-muted-foreground uppercase font-bold">Türkçe</span>
                <textarea
                  :value="setting.value.tr"
                  @input="e => updateField(setting, 'tr', e.target.value)"
                  rows="3"
                  class="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                ></textarea>
              </div>
              <div class="space-y-1">
                <span class="text-xs text-muted-foreground uppercase font-bold">English</span>
                <textarea
                  :value="setting.value.en"
                  @input="e => updateField(setting, 'en', e.target.value)"
                  rows="3"
                  class="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                ></textarea>
              </div>
            </div>

            <div v-else-if="setting.input_type === 'image'" class="flex items-center gap-6">
              <div class="w-32 h-20 bg-muted rounded-lg overflow-hidden border border-border flex-shrink-0 relative group">
                 <img :src="setting.value.url" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <input type="text" :value="setting.value.url" disabled class="w-full p-2 mb-2 bg-muted text-muted-foreground text-xs rounded border border-border" />
                <label class="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                   <Upload class="w-4 h-4" /> Yeni Görsel Yükle
                   <input type="file" class="hidden" accept="image/*" @change="e => handleImageUpload(e, setting)" />
                </label>
              </div>
            </div>

            <div v-else-if="setting.input_type === 'layout_select'" class="grid grid-cols-2 sm:grid-cols-3 gap-4">

              <button
                @click="updateLayout(setting, 'grid')"
                class="relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center group"
                :class="setting.value.mode === 'grid' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'"
              >
                <div class="w-full aspect-video bg-muted rounded grid grid-cols-2 gap-1 p-1">
                  <div class="bg-foreground/20 rounded"></div>
                  <div class="bg-foreground/20 rounded"></div>
                  <div class="bg-foreground/20 rounded"></div>
                  <div class="bg-foreground/20 rounded"></div>
                </div>
                <span class="text-xs font-bold">Standart Grid</span>
                <div v-if="setting.value.mode === 'grid'" class="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"></div>
              </button>

              <button
                @click="updateLayout(setting, 'masonry')"
                class="relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center group"
                :class="setting.value.mode === 'masonry' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'"
              >
                <div class="w-full aspect-video bg-muted rounded flex gap-1 p-1 items-start overflow-hidden">
                  <div class="w-1/2 space-y-1">
                     <div class="h-8 bg-foreground/20 rounded"></div>
                     <div class="h-12 bg-foreground/20 rounded"></div>
                  </div>
                  <div class="w-1/2 space-y-1">
                     <div class="h-12 bg-foreground/20 rounded"></div>
                     <div class="h-6 bg-foreground/20 rounded"></div>
                  </div>
                </div>
                <span class="text-xs font-bold">Masonry / Pinterest</span>
                <div v-if="setting.value.mode === 'masonry'" class="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"></div>
              </button>

            </div>

          </div>

          <div class="flex justify-end pt-4">
             <span class="text-xs text-muted-foreground italic flex items-center gap-1">
               <CheckCircle2 class="w-3 h-3 text-green-500" /> Değişiklikler otomatik kaydedilir
             </span>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { Settings, ArrowLeft, Upload, CheckCircle2 } from 'lucide-vue-next'

const settingsStore = useSettingsStore()
const activeTab = ref('home')

const groupLabels = {
  home: 'Anasayfa',
  ebru: 'Ebru Sanatı',
  photography: 'Fotoğrafçılık',
  general: 'Genel Ayarlar'
}

onMounted(() => {
  settingsStore.fetchSettings()
})

// Metin güncelleme (Debounce eklenebilir)
const updateField = (setting, lang, newValue) => {
  const updatedValue = { ...setting.value, [lang]: newValue }
  settingsStore.updateSetting(setting.key, updatedValue)
}

// Layout güncelleme
const updateLayout = (setting, mode) => {
  const updatedValue = { ...setting.value, mode: mode }
  settingsStore.updateSetting(setting.key, updatedValue)
}

// Görsel güncelleme
const handleImageUpload = async (event, setting) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    const url = await settingsStore.uploadSettingImage(file)
    const updatedValue = { ...setting.value, url: url }
    await settingsStore.updateSetting(setting.key, updatedValue)
  } catch (e) {
    console.error("Görsel yükleme hatası", e)
    alert("Yükleme başarısız")
  }
}
</script>
