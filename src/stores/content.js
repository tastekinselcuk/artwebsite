import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/supabaseClient'

export const useContentStore = defineStore('content', () => {
  const loading = ref(false)

  // Site genelindeki içerikleri burada tutacağız
  // Örn: contents.value['ebru_page'] bize ebru sayfası verilerini verecek
  const contents = ref({})

  // 1. İçerikleri Çek (Sayfa yüklenince çalışacak)
  const fetchContents = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('site_contents')
        .select('*')

      if (error) throw error

      // Gelen veriyi { 'ebru_page': {...}, 'photography_page': {...} } formatına çevir
      data.forEach(item => {
        contents.value[item.section_key] = item.content
      })

    } catch (e) {
      console.error('İçerik çekme hatası:', e)
    } finally {
      loading.value = false
    }
  }

  // 2. İçerik Güncelle
  const updateContent = async (key, newContent) => {
    loading.value = true
    try {
      const { error } = await supabase
        .from('site_contents')
        .update({ content: newContent })
        .eq('section_key', key)

      if (error) throw error

      // Local state'i de güncelle (Sayfa yenilemeye gerek kalmasın)
      contents.value[key] = newContent
      return true
    } catch (e) {
      console.error('Güncelleme hatası:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  // 3. Banner/Statik Resim Yükleme
  const uploadBanner = async (file) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `banners/${Date.now()}.${fileExt}` // 'banners' klasörü altına

      const { error: uploadError } = await supabase.storage
        .from('artwork-images') // Aynı bucket'ı kullanabiliriz
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('artwork-images')
        .getPublicUrl(fileName)

      return data.publicUrl
    } catch (e) {
      console.error('Resim yükleme hatası:', e)
      throw e
    }
  }

  return {
    contents,
    loading,
    fetchContents,
    updateContent,
    uploadBanner
  }
})
