import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/supabaseClient'
import { useI18n } from 'vue-i18n'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref([]) // DB'den gelen ham veri
  const loading = ref(false)
  const { locale } = useI18n() // Mevcut dili al

  // 1. Ayarları Çek
  const fetchSettings = async () => {
    if (settings.value.length > 0) return // Zaten yüklüyse tekrar çekme

    loading.value = true
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('key')

    if (!error && data) {
      settings.value = data
    }
    loading.value = false
  }

  // 2. Ayar Güncelle (Admin için)
  const updateSetting = async (key, newValue) => {
    // Önce local state'i güncelle (Hızlı tepki için)
    const index = settings.value.findIndex(s => s.key === key)
    if (index !== -1) {
      settings.value[index].value = newValue
    }

    // Sonra DB'ye yaz
    const { error } = await supabase
      .from('site_settings')
      .update({ value: newValue })
      .eq('key', key)

    return !error
  }

  // 3. Görsel Yükleme Helper
  const uploadSettingImage = async (file) => {
    const fileName = `settings/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('artwork-images').upload(fileName, file)
    if (error) throw error
    const { data } = supabase.storage.from('artwork-images').getPublicUrl(fileName)
    return data.publicUrl
  }

  // --- GETTERLAR (Arayüzde Kullanım İçin) ---

  // Metin Çekici (Otomatik Dil Seçimi Yapar)
  const getText = (key) => {
    const item = settings.value.find(s => s.key === key)
    if (!item) return '...' // Loading placeholder
    // Eğer value içinde tr/en varsa dile göre döndür, yoksa direkt value döndür
    return item.value[locale.value] || item.value.tr || item.value || ''
  }

  // Görsel URL Çekici
  const getImage = (key) => {
    const item = settings.value.find(s => s.key === key)
    return item?.value?.url || ''
  }

  // Layout Config Çekici
  const getLayout = (key) => {
    const item = settings.value.find(s => s.key === key)
    return item?.value?.mode || 'grid'
  }

  // Gruplanmış Ayarlar (Admin Paneli İçin)
  const groupedSettings = computed(() => {
    const groups = {}
    settings.value.forEach(item => {
      if (!groups[item.group_name]) groups[item.group_name] = []
      groups[item.group_name].push(item)
    })
    return groups
  })

  return {
    settings,
    loading,
    fetchSettings,
    updateSetting,
    uploadSettingImage,
    getText,
    getImage,
    getLayout,
    groupedSettings
  }
})
