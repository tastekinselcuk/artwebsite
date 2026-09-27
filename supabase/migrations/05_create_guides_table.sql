-- Rehber / blog yazıları (TR/EN, mevcut site formatı)
CREATE TABLE IF NOT EXISTS guides (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  slug TEXT NOT NULL UNIQUE,
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  image TEXT DEFAULT '/og-default.jpg',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  content_tr JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_en JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_guides_slug ON guides(slug);
CREATE INDEX IF NOT EXISTS idx_guides_active ON guides(is_active);
CREATE INDEX IF NOT EXISTS idx_guides_sort ON guides(sort_order ASC);

ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active guides" ON guides;
CREATE POLICY "Public can read active guides"
ON guides FOR SELECT
USING (is_active = TRUE OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can insert guides" ON guides;
CREATE POLICY "Authenticated can insert guides"
ON guides FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can update guides" ON guides;
CREATE POLICY "Authenticated can update guides"
ON guides FOR UPDATE
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can delete guides" ON guides;
CREATE POLICY "Authenticated can delete guides"
ON guides FOR DELETE
USING (auth.role() = 'authenticated');
