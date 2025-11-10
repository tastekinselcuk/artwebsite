import { defineStore } from 'pinia'
import { ref } from 'vue'
import ebruSample from '@/assets/ebru-sample.jpg'
import photoSample from '@/assets/photo-sample.jpg'

export const useGalleryStore = defineStore('gallery', () => {
  // Ebru artworks
  const ebruArtworks = ref([
    {
      id: 1,
      title: { en: "Tides of Teal", tr: "Turkuaz Dalgalar" },
      description: {
        en: "A dance of teal and coral pigments on water, creating organic ripples that mirror ocean waves.",
        tr: "Su üzerinde turkuaz ve mercan pigmentlerinin dansı, okyanus dalgalarını yansıtan organik kıvrımlar yaratıyor."
      },
      year: "2024",
      image: ebruSample
    },
    {
      id: 2,
      title: { en: "Golden Flow", tr: "Altın Akış" },
      description: {
        en: "Delicate gold leaf suspended in fluid motion, catching light like captured sunbeams.",
        tr: "Akışkan harekette asılı duran narin altın yapraklar, yakalanmış güneş ışınları gibi ışığı yakalıyor."
      },
      year: "2024",
      image: ebruSample
    },
    {
      id: 3,
      title: { en: "Marble Dreams", tr: "Mermer Rüyalar" },
      description: {
        en: "Abstract patterns emerging from the unpredictable nature of water and ink.",
        tr: "Su ve mürekkebin öngörülemez doğasından ortaya çıkan soyut desenler."
      },
      year: "2023",
      image: ebruSample
    }
  ])

  // Photography
  const photographs = ref([
    {
      id: 1,
      title: { en: "Urban Geometry", tr: "Kentsel Geometri" },
      description: {
        en: "Stark architectural lines create a minimalist composition of light and shadow.",
        tr: "Sert mimari çizgiler, ışık ve gölgenin minimalist bir kompozisyonunu yaratıyor."
      },
      year: "2024",
      image: photoSample
    },
    {
      id: 2,
      title: { en: "Silent Witness", tr: "Sessiz Tanık" },
      description: {
        en: "A solitary figure against monumental structures, exploring themes of scale and isolation.",
        tr: "Anıtsal yapılara karşı yalnız bir figür, ölçek ve izolasyon temalarını keşfediyor."
      },
      year: "2024",
      image: photoSample
    },
    {
      id: 3,
      title: { en: "Light Study No. 3", tr: "Işık Çalışması No. 3" },
      description: {
        en: "Natural light filtered through geometric forms, creating abstract patterns.",
        tr: "Geometrik formlardan süzülen doğal ışık, soyut desenler yaratıyor."
      },
      year: "2023",
      image: photoSample
    }
  ])

  // Add artwork
  const addEbruArtwork = (artwork) => {
    const newId = Math.max(...ebruArtworks.value.map(a => a.id), 0) + 1
    ebruArtworks.value.push({ ...artwork, id: newId })
  }

  const addPhotograph = (photo) => {
    const newId = Math.max(...photographs.value.map(p => p.id), 0) + 1
    photographs.value.push({ ...photo, id: newId })
  }

  // Update artwork
  const updateEbruArtwork = (id, updatedData) => {
    const index = ebruArtworks.value.findIndex(a => a.id === id)
    if (index !== -1) {
      ebruArtworks.value[index] = { ...ebruArtworks.value[index], ...updatedData }
    }
  }

  const updatePhotograph = (id, updatedData) => {
    const index = photographs.value.findIndex(p => p.id === id)
    if (index !== -1) {
      photographs.value[index] = { ...photographs.value[index], ...updatedData }
    }
  }

  // Delete artwork
  const deleteEbruArtwork = (id) => {
    ebruArtworks.value = ebruArtworks.value.filter(a => a.id !== id)
  }

  const deletePhotograph = (id) => {
    photographs.value = photographs.value.filter(p => p.id !== id)
  }

  return {
    ebruArtworks,
    photographs,
    addEbruArtwork,
    addPhotograph,
    updateEbruArtwork,
    updatePhotograph,
    deleteEbruArtwork,
    deletePhotograph
  }
})
