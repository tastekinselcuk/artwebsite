-- Ana sayfa "Ebru Çeşitleri" vitrini
CREATE TABLE IF NOT EXISTS ebru_varieties (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title JSONB NOT NULL DEFAULT '{"tr":"","en":""}'::jsonb,
  description JSONB NOT NULL DEFAULT '{"tr":"","en":""}'::jsonb,
  image TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ebru_varieties_sort ON ebru_varieties(sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_ebru_varieties_active ON ebru_varieties(is_active);

ALTER TABLE ebru_varieties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active ebru varieties" ON ebru_varieties;
CREATE POLICY "Public can read active ebru varieties"
ON ebru_varieties FOR SELECT
USING (is_active = TRUE OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can insert ebru varieties" ON ebru_varieties;
CREATE POLICY "Authenticated can insert ebru varieties"
ON ebru_varieties FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can update ebru varieties" ON ebru_varieties;
CREATE POLICY "Authenticated can update ebru varieties"
ON ebru_varieties FOR UPDATE
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can delete ebru varieties" ON ebru_varieties;
CREATE POLICY "Authenticated can delete ebru varieties"
ON ebru_varieties FOR DELETE
USING (auth.role() = 'authenticated');

-- Varsayılan çeşitler (görsel admin panelden eklenebilir)
INSERT INTO ebru_varieties (title, description, sort_order, is_active)
SELECT * FROM (VALUES
  ('{"tr":"Battal Ebru","en":"Battal Ebru"}'::jsonb,
   '{"tr":"En temel form. Boyalar serbest bırakılır; doğal yayılma ve organik halkalar ön plandadır.","en":"The foundational form. Pigments are left to spread freely, creating organic rings and natural blooms."}'::jsonb,
   1, TRUE),
  ('{"tr":"Gelgit Ebru","en":"Gelgit Ebru"}'::jsonb,
   '{"tr":"Biz veya fırça ile ileri-geri hareketlerle oluşturulur. Dalgalı, ritmik çizgiler karakteristiğidir.","en":"Formed with back-and-forth strokes. Wavy, rhythmic lines define its character."}'::jsonb,
   2, TRUE),
  ('{"tr":"Taraklı Ebru","en":"Taraklı Ebru"}'::jsonb,
   '{"tr":"Özel taraklarla çekilerek düzenli, taranmış dokular elde edilir.","en":"Drawn with special combs to create ordered, combed textures."}'::jsonb,
   3, TRUE),
  ('{"tr":"Çiçekli Ebru","en":"Çiçekli Ebru"}'::jsonb,
   '{"tr":"Gelgit veya battal zemin üzerine stilize çiçek motifleri işlenir.","en":"Stylized floral motifs worked over a gelgit or battal ground."}'::jsonb,
   4, TRUE),
  ('{"tr":"Hatip Ebru","en":"Hatip Ebru"}'::jsonb,
   '{"tr":"Merkezden açılan simetrik, madalyon benzeri formlar.","en":"Symmetrical, medallion-like forms opening from the center."}'::jsonb,
   5, TRUE),
  ('{"tr":"Kumlu Ebru","en":"Kumlu Ebru"}'::jsonb,
   '{"tr":"Boyanın kıvamı ve tekne koşullarıyla oluşan grenli, kumsu doku.","en":"A grainy, sand-like texture created through pigment consistency."}'::jsonb,
   6, TRUE)
) AS v(title, description, sort_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM ebru_varieties LIMIT 1);
