import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/supabaseClient";

export const useEbruVarietiesStore = defineStore("ebruVarieties", () => {
  const varieties = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const mapRow = (row) => ({
    id: row.id,
    title: { en: row.title?.en ?? "", tr: row.title?.tr ?? "" },
    description: { en: row.description?.en ?? "", tr: row.description?.tr ?? "" },
    image: row.image ?? "",
    sortOrder: row.sort_order ?? 0,
    isActive: row.is_active ?? true,
  });

  const activeVarieties = computed(() =>
    varieties.value.filter((v) => v.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
  );

  const fetchVarieties = async ({ includeInactive = false } = {}) => {
    loading.value = true;
    error.value = null;
    try {
      let query = supabase.from("ebru_varieties").select("*").order("sort_order", { ascending: true });

      if (!includeInactive) {
        query = query.eq("is_active", true);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      varieties.value = (data ?? []).map(mapRow);
    } catch (e) {
      console.error("Fetch ebru varieties error:", e);
      error.value = "Ebru çeşitleri yüklenemedi.";
    } finally {
      loading.value = false;
    }
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `varieties/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("artwork-images")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("artwork-images").getPublicUrl(fileName);

    return publicUrl;
  };

  const createVariety = async ({ titleTr, titleEn, descTr, descEn, image, sortOrder }) => {
    loading.value = true;
    error.value = null;
    try {
      const payload = {
        title: { tr: titleTr, en: titleEn },
        description: { tr: descTr, en: descEn },
        image: image || null,
        sort_order: sortOrder ?? varieties.value.length + 1,
        is_active: true,
      };

      const { data, error: dbError } = await supabase
        .from("ebru_varieties")
        .insert([payload])
        .select();

      if (dbError) throw dbError;
      varieties.value.push(mapRow(data[0]));
      varieties.value.sort((a, b) => a.sortOrder - b.sortOrder);
      return true;
    } catch (e) {
      console.error("Create variety error:", e);
      error.value = "Çeşit eklenemedi.";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateVariety = async (id, fields) => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: dbError } = await supabase
        .from("ebru_varieties")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select();

      if (dbError) throw dbError;

      const updated = mapRow(data[0]);
      const index = varieties.value.findIndex((v) => v.id === id);
      if (index !== -1) varieties.value[index] = updated;
      varieties.value.sort((a, b) => a.sortOrder - b.sortOrder);
      return true;
    } catch (e) {
      console.error("Update variety error:", e);
      error.value = "Çeşit güncellenemedi.";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteVariety = async (id, imageUrl) => {
    if (!confirm("Bu ebru çeşidini silmek istediğinize emin misiniz?")) return false;

    loading.value = true;
    error.value = null;
    try {
      const { error: dbError } = await supabase.from("ebru_varieties").delete().eq("id", id);
      if (dbError) throw dbError;

      varieties.value = varieties.value.filter((v) => v.id !== id);

      if (imageUrl && imageUrl.includes("artwork-images")) {
        const fileName = imageUrl.split("artwork-images/").pop();
        if (fileName) {
          await supabase.storage.from("artwork-images").remove([fileName]);
        }
      }
      return true;
    } catch (e) {
      console.error("Delete variety error:", e);
      error.value = "Silme işlemi başarısız.";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    varieties,
    activeVarieties,
    loading,
    error,
    fetchVarieties,
    uploadImage,
    createVariety,
    updateVariety,
    deleteVariety,
  };
});
