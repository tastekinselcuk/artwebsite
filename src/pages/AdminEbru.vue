<template>
  <div class="min-h-screen bg-muted/20">
    <!-- Header -->
    <header class="bg-card shadow-sm border-b border-border">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <router-link
            to="/admin/dashboard"
            class="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
          </router-link>
          <h1 class="text-2xl font-display font-bold text-foreground">{{ t('admin.ebru.title') }}</h1>
        </div>
        <button
          @click="showAddModal = true"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:shadow-lg transition-all"
        >
          <Plus class="w-5 h-5" />
          {{ t('admin.ebru.addNew') }}
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="artwork in galleryStore.ebruArtworks"
          :key="artwork.id"
          class="bg-card rounded-xl overflow-hidden shadow-sm border border-border"
        >
          <div class="aspect-square bg-muted">
            <img :src="artwork.image" :alt="artwork.title.en" class="w-full h-full object-cover" />
          </div>
          <div class="p-4">
            <h3 class="font-display font-semibold text-lg text-foreground mb-1">
              {{ artwork.title.en }}
            </h3>
            <p class="text-sm text-muted-foreground mb-3">{{ artwork.year }}</p>
            <div class="flex gap-2">
              <button
                @click="editArtwork(artwork)"
                class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all"
              >
                <Edit2 class="w-4 h-4" />
                {{ t('admin.ebru.edit') }}
              </button>
              <button
                @click="deleteArtwork(artwork.id)"
                class="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
              >
                <Trash2 class="w-4 h-4" />
                {{ t('admin.ebru.delete') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showAddModal || editingArtwork"
        class="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex items-center justify-center p-6"
        @click="closeModal"
      >
        <div
          class="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div class="p-6 border-b border-border flex items-center justify-between">
            <h2 class="text-2xl font-display font-bold">
              {{ editingArtwork ? t('admin.ebru.editTitle') : t('admin.ebru.addTitle') }}
            </h2>
            <button @click="closeModal" class="p-2 hover:bg-muted rounded-lg transition-colors">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="saveArtwork" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">{{ t('admin.ebru.titleEn') }}</label>
              <input
                v-model="formData.title.en"
                type="text"
                required
                class="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">{{ t('admin.ebru.titleTr') }}</label>
              <input
                v-model="formData.title.tr"
                type="text"
                required
                class="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">{{ t('admin.ebru.descriptionEn') }}</label>
              <textarea
                v-model="formData.description.en"
                required
                rows="3"
                class="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">{{ t('admin.ebru.descriptionTr') }}</label>
              <textarea
                v-model="formData.description.tr"
                required
                rows="3"
                class="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">{{ t('admin.ebru.year') }}</label>
              <input
                v-model="formData.year"
                type="text"
                required
                class="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">{{ t('admin.ebru.imageUrl') }}</label>
              <input
                v-model="formData.image"
                type="text"
                required
                class="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-all"
              >
                {{ t('admin.ebru.cancel') }}
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:shadow-lg transition-all"
              >
                {{ editingArtwork ? t('admin.ebru.update') : t('admin.ebru.add') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGalleryStore } from '@/stores/gallery'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Plus, Edit2, Trash2, X } from 'lucide-vue-next'
import ebruSample from '@/assets/ebru-sample.jpg'

const galleryStore = useGalleryStore()
const { t } = useI18n()
const showAddModal = ref(false)
const editingArtwork = ref(null)

const formData = ref({
  title: { en: '', tr: '' },
  description: { en: '', tr: '' },
  year: '',
  image: ebruSample
})

const resetForm = () => {
  formData.value = {
    title: { en: '', tr: '' },
    description: { en: '', tr: '' },
    year: '',
    image: ebruSample
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingArtwork.value = null
  resetForm()
}

const editArtwork = (artwork) => {
  editingArtwork.value = artwork
  formData.value = { ...artwork }
}

const saveArtwork = () => {
  if (editingArtwork.value) {
    galleryStore.updateEbruArtwork(editingArtwork.value.id, formData.value)
  } else {
    galleryStore.addEbruArtwork(formData.value)
  }
  closeModal()
}

const deleteArtwork = (id) => {
  if (confirm(t('admin.ebru.deleteConfirm'))) {
    galleryStore.deleteEbruArtwork(id)
  }
}
</script>
