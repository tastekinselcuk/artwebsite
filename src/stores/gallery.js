import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/supabaseClient'

export const useGalleryStore = defineStore('gallery', () => {
  // State
  const ebruArtworks = ref([])
  const photographs = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Yardımcı: Veritabanı satırını Frontend formatına çevirir
  const mapRowToArtwork = (row) => ({
    id: row.id,
    title: { en: row.title?.en ?? '', tr: row.title?.tr ?? '' },
    description: { en: row.description?.en ?? '', tr: row.description?.tr ?? '' },
    year: row.year ?? '',
    image: row.image ?? '',
    views: row.views ?? 0,
    isForSale: row.is_for_sale ?? false,
    price: row.price ?? 0,
    currency: row.currency ?? 'TRY',
    stock: row.stock ?? 0
  })

  // 1. Ebru Eserlerini Çek
  const fetchEbruFromSupabase = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('artworks')
        .select('*')
        .eq('type', 'ebru')
        .order('created_at', { ascending: false })

      if (err) throw err
      ebruArtworks.value = (data ?? []).map(mapRowToArtwork)
    } catch (e) {
      console.error('Fetch Ebru Error:', e)
      error.value = 'Ebru verileri alınamadı.'
    } finally {
      loading.value = false
    }
  }

  // 2. Fotoğrafları Çek
  const fetchPhotosFromSupabase = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('artworks')
        .select('*')
        .eq('type', 'photo')
        .order('created_at', { ascending: false })

      if (err) throw err
      photographs.value = (data ?? []).map(mapRowToArtwork)
    } catch (e) {
      console.error('Fetch Photo Error:', e)
      error.value = 'Fotoğraf verileri alınamadı.'
    } finally {
      loading.value = false
    }
  }

  // 3. Görüntülenme Sayısını Artır (Ebru)
  const incrementEbruViews = async (id) => {
    const artwork = ebruArtworks.value.find((a) => a.id === id)
    if (!artwork) return

    const { error: err } = await supabase
      .from('artworks')
      .update({ views: (artwork.views || 0) + 1 })
      .eq('id', id)

    if (!err) artwork.views++
  }

  // 4. Görüntülenme Sayısını Artır (Fotoğraf)
  const incrementPhotoViews = async (id) => {
    const photo = photographs.value.find((p) => p.id === id)
    if (!photo) return

    const { error: err } = await supabase
      .from('artworks')
      .update({ views: (photo.views || 0) + 1 })
      .eq('id', id)

    if (!err) photo.views++
  }

  // 5. Storage'a Resim Yükleme
  const uploadImage = async (file) => {
    loading.value = true
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('artwork-images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('artwork-images')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (e) {
      console.error('Upload Error:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // 6. Yeni Eser Oluşturma (Veritabanı Kaydı)
  const createArtwork = async (artworkData) => {
    loading.value = true
    try {
      const dbPayload = {
        type: artworkData.type,
        title: { en: artworkData.titleEn, tr: artworkData.titleTr },
        description: { en: artworkData.descEn, tr: artworkData.descTr },
        year: artworkData.year,
        image: artworkData.imageUrl,
        views: 0,
        // Varsayılan değerler
        is_for_sale: false,
        stock: 1
      }

      const { data, error: dbError } = await supabase
        .from('artworks')
        .insert([dbPayload])
        .select()

      if (dbError) throw dbError

      // Listeyi güncelle
      const newArtwork = mapRowToArtwork(data[0])
      if (artworkData.type === 'ebru') {
        ebruArtworks.value.unshift(newArtwork)
      } else {
        photographs.value.unshift(newArtwork)
      }
      return true
    } catch (e) {
      console.error('Create Error:', e)
      error.value = 'Kayıt işlemi başarısız.'
      return false
    } finally {
      loading.value = false
    }
  }

  // 7. Eser Silme (DB + Storage)
  const deleteArtwork = async (id, type, imageUrl) => {
    if (!confirm('Bu eseri silmek istediğinize emin misiniz?')) return false

    loading.value = true
    try {
      // DB'den sil
      const { error: dbError } = await supabase
        .from('artworks')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      // State'den sil
      if (type === 'ebru') {
        ebruArtworks.value = ebruArtworks.value.filter(item => item.id !== id)
      } else {
        photographs.value = photographs.value.filter(item => item.id !== id)
      }

      // Storage'dan sil (Eğer varsa)
      if (imageUrl && imageUrl.includes('artwork-images')) {
        const fileName = imageUrl.split('artwork-images/').pop()
        if (fileName) {
          await supabase.storage.from('artwork-images').remove([fileName])
        }
      }
      return true
    } catch (e) {
      console.error('Delete Error:', e)
      error.value = 'Silme işlemi başarısız.'
      return false
    } finally {
      loading.value = false
    }
  }

  // 8. Eser Güncelleme Fonksiyonu
  const updateArtwork = async (id, type, updatedFields) => {
    loading.value = true
    try {
      // Supabase Update İşlemi
      // updatedFields şunları içerebilir: { title: {...}, description: {...}, year: '...', image: '...' }
      const { data, error: dbError } = await supabase
        .from('artworks')
        .update(updatedFields)
        .eq('id', id)
        .select()

      if (dbError) throw dbError

      // Başarılıysa Local State'i güncelle
      const updatedItem = mapRowToArtwork(data[0])

      if (type === 'ebru') {
        const index = ebruArtworks.value.findIndex(i => i.id === id)
        if (index !== -1) ebruArtworks.value[index] = updatedItem
      } else {
        const index = photographs.value.findIndex(i => i.id === id)
        if (index !== -1) photographs.value[index] = updatedItem
      }

      return true
    } catch (e) {
      console.error('Update Error:', e)
      error.value = 'Güncelleme başarısız.'
      return false
    } finally {
      loading.value = false
    }
  }

  // --- Computed İstatistikler ---
  const totalEbruCount = computed(() => ebruArtworks.value.length)
  const totalPhotoCount = computed(() => photographs.value.length)

  const totalViews = computed(() => {
    const ebruViews = ebruArtworks.value.reduce((sum, item) => sum + (item.views || 0), 0)
    const photoViews = photographs.value.reduce((sum, item) => sum + (item.views || 0), 0)
    return ebruViews + photoViews
  })

  const topViewedArtwork = computed(() => {
    const all = [...ebruArtworks.value, ...photographs.value]
    if (all.length === 0) return null
    return all.sort((a, b) => (b.views || 0) - (a.views || 0))[0]
  })

  return {
    // State
    ebruArtworks,
    photographs,
    loading,
    error,
    // Actions
    fetchEbruFromSupabase,
    fetchPhotosFromSupabase,
    incrementEbruViews,
    incrementPhotoViews,
    uploadImage,
    createArtwork,
    deleteArtwork,
    updateArtwork,
    // Getters
    totalEbruCount,
    totalPhotoCount,
    totalViews,
    topViewedArtwork,
  }
})
