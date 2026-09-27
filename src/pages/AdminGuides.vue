<template>
  <div class="min-h-screen bg-muted/20 pb-20">
    <header class="bg-card shadow-sm border-b border-border sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <h1 class="text-2xl font-bold text-foreground flex items-center gap-3">
          <span class="p-2 bg-primary/10 rounded-lg text-primary shadow-sm">
            <BookOpen class="w-6 h-6" />
          </span>
          Rehber Yazıları
        </h1>
        <div class="flex items-center gap-3">
          <button
            v-if="guidesStore.source === 'static' || !hasDbGuides"
            type="button"
            @click="runSeed"
            :disabled="guidesStore.loading"
            class="text-xs font-medium px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Statik yazıları DB’ye aktar
          </button>
          <router-link
            to="/admin/dashboard"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <ArrowLeft class="w-4 h-4" />
            Panele Dön
          </router-link>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Liste -->
      <aside class="lg:col-span-4 space-y-4">
        <div class="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div class="p-4 border-b border-border flex items-center justify-between">
            <p class="font-semibold text-sm">Yazılar ({{ guidesStore.guides.length }})</p>
            <button
              type="button"
              @click="startCreate"
              class="inline-flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90"
            >
              <Plus class="w-3.5 h-3.5" /> Yeni
            </button>
          </div>
          <ul class="max-h-[70vh] overflow-y-auto divide-y divide-border">
            <li
              v-for="g in guidesStore.guides"
              :key="g.id"
              class="px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors"
              :class="{ 'bg-primary/5 border-l-2 border-l-primary': editingId === g.id }"
              @click="startEdit(g)"
            >
              <p class="text-sm font-medium text-foreground line-clamp-1">{{ g.tr?.title || g.slug }}</p>
              <p class="text-[11px] text-muted-foreground mt-0.5">/rehber/{{ g.slug }}</p>
            </li>
          </ul>
          <p v-if="!guidesStore.guides.length" class="p-6 text-sm text-muted-foreground text-center">
            Henüz yazı yok.
          </p>
        </div>
        <p v-if="guidesStore.error" class="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
          {{ guidesStore.error }}
        </p>
        <p class="text-[11px] text-muted-foreground leading-relaxed">
          Format: slug, SEO title/description, lead, bölümler (heading + body), CTA metinleri — TR/EN.
          Önce Supabase’de
          <code class="text-[10px] bg-muted px-1 rounded">05_create_guides_table.sql</code>
          çalıştırın.
        </p>
      </aside>

      <!-- Editör -->
      <section class="lg:col-span-8">
        <div class="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
          <div class="flex items-center justify-between gap-3">
            <h2 class="font-bold text-lg flex items-center gap-2">
              <component :is="isEditing ? Edit2 : Plus" class="w-5 h-5 text-primary" />
              {{ isEditing ? "Yazıyı Düzenle" : "Yeni Rehber Yazısı" }}
            </h2>
            <button
              v-if="isEditing"
              type="button"
              @click="resetForm"
              class="text-xs text-red-500 underline"
            >
              İptal
            </button>
          </div>

          <!-- Meta -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-bold uppercase text-muted-foreground">Slug (URL)</label>
              <div class="flex gap-2 mt-1">
                <input
                  v-model="form.slug"
                  required
                  class="flex-1 p-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="ebru-nedir"
                />
                <button
                  type="button"
                  @click="form.slug = guidesStore.slugify(form.tr.title || form.en.title)"
                  class="px-2 text-xs border border-border rounded-md hover:bg-muted"
                >
                  Üret
                </button>
              </div>
              <p class="text-[10px] text-muted-foreground mt-1">/rehber/{{ form.slug || "…" }}</p>
            </div>
            <div>
              <label class="text-xs font-bold uppercase text-muted-foreground">Yayın tarihi</label>
              <input
                v-model="form.publishedAt"
                type="date"
                class="mt-1 w-full p-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label class="text-xs font-bold uppercase text-muted-foreground">Kapak / OG görsel URL</label>
              <input
                v-model="form.image"
                class="mt-1 w-full p-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="/og-default.jpg"
              />
            </div>
            <div class="flex items-end gap-4">
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input v-model="form.isActive" type="checkbox" class="rounded border-border" />
                Yayında
              </label>
              <div class="flex-1">
                <label class="text-xs font-bold uppercase text-muted-foreground">Sıra</label>
                <input
                  v-model.number="form.sortOrder"
                  type="number"
                  min="0"
                  class="mt-1 w-full p-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <!-- Dil sekmeleri -->
          <div class="flex gap-2 border-b border-border">
            <button
              v-for="lang in ['tr', 'en']"
              :key="lang"
              type="button"
              @click="activeLang = lang"
              class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
              :class="
                activeLang === lang
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              "
            >
              {{ lang === "tr" ? "Türkçe" : "English" }}
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-xs font-bold uppercase text-muted-foreground">Başlık (SEO H1)</label>
              <input
                v-model="form[activeLang].title"
                required
                class="mt-1 w-full p-2.5 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label class="text-xs font-bold uppercase text-muted-foreground">Meta description</label>
              <textarea
                v-model="form[activeLang].description"
                rows="2"
                class="mt-1 w-full p-2.5 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-bold uppercase text-muted-foreground">Eyebrow</label>
                <input
                  v-model="form[activeLang].eyebrow"
                  class="mt-1 w-full p-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-xs font-bold uppercase text-muted-foreground">CTA Galeri</label>
                  <input
                    v-model="form[activeLang].ctaGallery"
                    class="mt-1 w-full p-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label class="text-xs font-bold uppercase text-muted-foreground">CTA Mağaza</label>
                  <input
                    v-model="form[activeLang].ctaShop"
                    class="mt-1 w-full p-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
            <div>
              <label class="text-xs font-bold uppercase text-muted-foreground">Giriş (lead)</label>
              <textarea
                v-model="form[activeLang].lead"
                rows="3"
                class="mt-1 w-full p-2.5 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
              />
            </div>

            <!-- Sections editor -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-bold uppercase text-muted-foreground">Bölümler</label>
                <button
                  type="button"
                  @click="addSection"
                  class="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Plus class="w-3 h-3" /> Bölüm ekle
                </button>
              </div>
              <div class="space-y-3">
                <div
                  v-for="(section, idx) in form[activeLang].sections"
                  :key="idx"
                  class="rounded-lg border border-border bg-muted/20 p-4 space-y-2"
                >
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-[10px] uppercase tracking-wider text-muted-foreground"
                      >Bölüm {{ idx + 1 }}</span
                    >
                    <button
                      type="button"
                      @click="removeSection(idx)"
                      :disabled="form[activeLang].sections.length <= 1"
                      class="text-xs text-red-500 hover:underline disabled:opacity-40"
                    >
                      Sil
                    </button>
                  </div>
                  <input
                    v-model="section.heading"
                    placeholder="Başlık"
                    class="w-full p-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                  />
                  <textarea
                    v-model="section.body"
                    rows="4"
                    placeholder="Paragraf metni…"
                    class="w-full p-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
            <button
              type="button"
              @click="save"
              :disabled="guidesStore.loading || !canSave"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              <Save class="w-4 h-4" />
              {{ isEditing ? "Güncelle" : "Yayınla" }}
            </button>
            <a
              v-if="form.slug"
              :href="`/rehber/${form.slug}`"
              target="_blank"
              class="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <ExternalLink class="w-3.5 h-3.5" /> Önizle
            </a>
            <button
              v-if="isEditing && !String(editingId).startsWith('static-')"
              type="button"
              @click="remove"
              class="ml-auto text-sm text-red-600 hover:underline"
            >
              Sil
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useGuidesStore } from "@/stores/guides";
import {
  BookOpen,
  ArrowLeft,
  Plus,
  Edit2,
  Save,
  ExternalLink,
} from "lucide-vue-next";

const guidesStore = useGuidesStore();

const activeLang = ref("tr");
const editingId = ref(null);
const isEditing = computed(() => editingId.value != null);

const blankForm = () => ({
  slug: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  image: "/og-default.jpg",
  isActive: true,
  sortOrder: (guidesStore.guides.length || 0) + 1,
  tr: guidesStore.emptyLocaleContent(),
  en: {
    ...guidesStore.emptyLocaleContent(),
    eyebrow: "Guide",
    ctaGallery: "Explore the gallery",
    ctaShop: "Visit the shop",
  },
});

const form = reactive(blankForm());

const hasDbGuides = computed(
  () => guidesStore.source === "supabase" && guidesStore.guides.some((g) => !g._static),
);

const canSave = computed(
  () =>
    form.slug &&
    form.tr.title &&
    form.en.title &&
    form.tr.lead &&
    form.en.lead,
);

const cloneContent = (c) =>
  JSON.parse(
    JSON.stringify(
      c || {
        title: "",
        description: "",
        eyebrow: "",
        lead: "",
        sections: [{ heading: "", body: "" }],
        ctaGallery: "",
        ctaShop: "",
      },
    ),
  );

const resetForm = () => {
  editingId.value = null;
  Object.assign(form, blankForm());
  activeLang.value = "tr";
};

const startCreate = () => {
  resetForm();
};

const startEdit = (g) => {
  editingId.value = g.id;
  form.slug = g.slug;
  form.publishedAt = g.publishedAt?.slice?.(0, 10) || g.publishedAt;
  form.image = g.image || "/og-default.jpg";
  form.isActive = g.isActive !== false;
  form.sortOrder = g.sortOrder ?? 0;
  form.tr = cloneContent(g.tr);
  form.en = cloneContent(g.en);
  if (!form.tr.sections?.length) form.tr.sections = [{ heading: "", body: "" }];
  if (!form.en.sections?.length) form.en.sections = [{ heading: "", body: "" }];
  activeLang.value = "tr";
};

const addSection = () => {
  form[activeLang.value].sections.push({ heading: "", body: "" });
};

const removeSection = (idx) => {
  if (form[activeLang.value].sections.length <= 1) return;
  form[activeLang.value].sections.splice(idx, 1);
};

const payloadFromForm = () => ({
  slug: form.slug.trim(),
  publishedAt: form.publishedAt,
  image: form.image,
  isActive: form.isActive,
  sortOrder: form.sortOrder,
  tr: cloneContent(form.tr),
  en: cloneContent(form.en),
});

const save = async () => {
  if (!canSave.value) return;
  if (!form.slug) form.slug = guidesStore.slugify(form.tr.title);

  const payload = payloadFromForm();
  let ok;
  if (isEditing.value && !String(editingId.value).startsWith("static-")) {
    ok = await guidesStore.updateGuide(editingId.value, payload);
  } else {
    const created = await guidesStore.createGuide(payload);
    ok = Boolean(created);
    if (created) editingId.value = created.id;
  }
  if (ok) await guidesStore.fetchGuides({ includeInactive: true });
};

const remove = async () => {
  if (!editingId.value) return;
  const ok = await guidesStore.deleteGuide(editingId.value);
  if (ok) resetForm();
};

const runSeed = async () => {
  const ok = await guidesStore.seedFromStatic();
  if (ok) alert("Statik rehberler veritabanına aktarıldı.");
};

onMounted(() => {
  guidesStore.fetchGuides({ includeInactive: true });
});
</script>
