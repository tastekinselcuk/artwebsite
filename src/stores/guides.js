import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/supabaseClient";
import { guides as staticGuides } from "@/content/guides";

const emptyLocaleContent = () => ({
  title: "",
  description: "",
  eyebrow: "Rehber",
  lead: "",
  sections: [{ heading: "", body: "" }],
  ctaGallery: "Galeriyi keşfet",
  ctaShop: "Mağazaya git",
});

const mapRow = (row) => ({
  id: row.id,
  slug: row.slug,
  publishedAt: row.published_at,
  image: row.image || "/og-default.jpg",
  isActive: row.is_active ?? true,
  sortOrder: row.sort_order ?? 0,
  tr: {
    ...emptyLocaleContent(),
    eyebrow: "Rehber",
    ...(row.content_tr || {}),
    sections: Array.isArray(row.content_tr?.sections)
      ? row.content_tr.sections
      : [{ heading: "", body: "" }],
  },
  en: {
    ...emptyLocaleContent(),
    eyebrow: "Guide",
    ctaGallery: "Explore the gallery",
    ctaShop: "Visit the shop",
    ...(row.content_en || {}),
    sections: Array.isArray(row.content_en?.sections)
      ? row.content_en.sections
      : [{ heading: "", body: "" }],
  },
});

const mapStatic = (g, index) => ({
  id: `static-${g.slug}`,
  slug: g.slug,
  publishedAt: g.publishedAt,
  image: g.image || "/og-default.jpg",
  isActive: true,
  sortOrder: index + 1,
  tr: g.tr,
  en: g.en,
  _static: true,
});

export const useGuidesStore = defineStore("guides", () => {
  const guides = ref(staticGuides.map(mapStatic));
  const loading = ref(false);
  const error = ref(null);
  const source = ref("static"); // static | supabase

  const activeGuides = computed(() =>
    guides.value
      .filter((g) => g.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder || String(a.slug).localeCompare(b.slug)),
  );

  const localize = (guide, locale) => {
    if (!guide) return null;
    const lang = locale === "en" ? "en" : "tr";
    return {
      slug: guide.slug,
      publishedAt: guide.publishedAt,
      image: guide.image,
      ...guide[lang],
    };
  };

  const listLocalized = (locale, { featured = false, limit = 3 } = {}) => {
    const list = activeGuides.value.map((g) => localize(g, locale));
    return featured ? list.slice(0, limit) : list;
  };

  const getBySlug = (slug) => activeGuides.value.find((g) => g.slug === slug) || null;

  const fetchGuides = async ({ includeInactive = false } = {}) => {
    loading.value = true;
    error.value = null;
    try {
      let query = supabase.from("guides").select("*").order("sort_order", { ascending: true });
      if (!includeInactive) query = query.eq("is_active", true);

      const { data, error: err } = await query;
      if (err) throw err;

      if (data?.length) {
        guides.value = data.map(mapRow);
        source.value = "supabase";
      } else {
        // Tablo boşsa statik seed kalsın (public); admin seed butonu ile doldurulabilir
        guides.value = staticGuides.map(mapStatic);
        source.value = "static";
      }
    } catch (e) {
      console.error("Fetch guides error:", e);
      error.value = "Rehberler yüklenemedi; yerel içerik kullanılıyor.";
      guides.value = staticGuides.map(mapStatic);
      source.value = "static";
    } finally {
      loading.value = false;
    }
  };

  const slugify = (text) =>
    String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);

  const createGuide = async (payload) => {
    loading.value = true;
    error.value = null;
    try {
      const row = {
        slug: payload.slug,
        published_at: payload.publishedAt || new Date().toISOString().slice(0, 10),
        image: payload.image || "/og-default.jpg",
        is_active: payload.isActive !== false,
        sort_order: payload.sortOrder ?? guides.value.length + 1,
        content_tr: payload.tr,
        content_en: payload.en,
      };

      const { data, error: dbError } = await supabase.from("guides").insert([row]).select();
      if (dbError) throw dbError;

      const mapped = mapRow(data[0]);
      if (source.value === "static") {
        guides.value = [mapped];
        source.value = "supabase";
      } else {
        guides.value.push(mapped);
      }
      return mapped;
    } catch (e) {
      console.error("Create guide error:", e);
      error.value = e.message?.includes("duplicate")
        ? "Bu slug zaten kullanılıyor."
        : "Rehber kaydedilemedi. Supabase’de guides tablosu var mı?";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateGuide = async (id, payload) => {
    if (String(id).startsWith("static-")) {
      error.value = "Önce rehberleri veritabanına aktarın (Seed).";
      return false;
    }
    loading.value = true;
    error.value = null;
    try {
      const row = {
        slug: payload.slug,
        published_at: payload.publishedAt,
        image: payload.image || "/og-default.jpg",
        is_active: payload.isActive !== false,
        sort_order: payload.sortOrder ?? 0,
        content_tr: payload.tr,
        content_en: payload.en,
        updated_at: new Date().toISOString(),
      };

      const { data, error: dbError } = await supabase
        .from("guides")
        .update(row)
        .eq("id", id)
        .select();

      if (dbError) throw dbError;
      const mapped = mapRow(data[0]);
      const idx = guides.value.findIndex((g) => g.id === id);
      if (idx !== -1) guides.value[idx] = mapped;
      return true;
    } catch (e) {
      console.error("Update guide error:", e);
      error.value = "Rehber güncellenemedi.";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteGuide = async (id) => {
    if (String(id).startsWith("static-")) {
      error.value = "Statik içerik silinemez; önce seed yapın.";
      return false;
    }
    if (!confirm("Bu rehber yazısını silmek istediğinize emin misiniz?")) return false;

    loading.value = true;
    error.value = null;
    try {
      const { error: dbError } = await supabase.from("guides").delete().eq("id", id);
      if (dbError) throw dbError;
      guides.value = guides.value.filter((g) => g.id !== id);
      return true;
    } catch (e) {
      console.error("Delete guide error:", e);
      error.value = "Silme başarısız.";
      return false;
    } finally {
      loading.value = false;
    }
  };

  /** Statik rehberleri Supabase’e tek seferlik aktar */
  const seedFromStatic = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { count, error: countErr } = await supabase
        .from("guides")
        .select("*", { count: "exact", head: true });
      if (countErr) throw countErr;
      if (count && count > 0) {
        error.value = "Tabloda zaten rehber var; seed atlandı.";
        await fetchGuides({ includeInactive: true });
        return false;
      }

      const rows = staticGuides.map((g, i) => ({
        slug: g.slug,
        published_at: g.publishedAt,
        image: g.image || "/og-default.jpg",
        is_active: true,
        sort_order: i + 1,
        content_tr: g.tr,
        content_en: g.en,
      }));

      const { error: insertErr } = await supabase.from("guides").insert(rows);
      if (insertErr) throw insertErr;

      await fetchGuides({ includeInactive: true });
      return true;
    } catch (e) {
      console.error("Seed guides error:", e);
      error.value =
        "Seed başarısız. Supabase SQL’de 05_create_guides_table.sql dosyasını çalıştırın.";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    guides,
    activeGuides,
    loading,
    error,
    source,
    emptyLocaleContent,
    localize,
    listLocalized,
    getBySlug,
    fetchGuides,
    slugify,
    createGuide,
    updateGuide,
    deleteGuide,
    seedFromStatic,
  };
});
