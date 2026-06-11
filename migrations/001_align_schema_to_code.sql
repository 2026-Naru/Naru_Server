-- Align Supabase schema with what the Express route handlers query.
-- Idempotent: safe to run multiple times.
--
-- Background: some routes (users.ts, stores.ts) reference tables/columns that
-- did not exist in the DB, while orders.ts/exchange.ts use different names for
-- the same data. Where a value is derivable from an existing column we use a
-- GENERATED column to mirror it, so existing routes keep working AND the new
-- queries return correct data without any code change.

BEGIN;

-- ── users: /api/v1/auth reads/writes password_hash ──
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS password_hash character varying;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'password'
  ) THEN
    EXECUTE 'UPDATE public.users SET password_hash = password WHERE password_hash IS NULL';
  END IF;
END $$;

-- ── users: /api/v1/users/me selects balance_usd (balance_krw already exists) ──
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS balance_usd numeric DEFAULT 0;

-- ── reviews: /api/v1/stores/:id/reviews selects `country` ──
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS country character varying;

-- ── reviews: /api/v1/stores/:id/reviews selects and writes review images ──
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS image_url text;

-- ── user_favorites: /api/v1/users/me/favorites (table did not exist) ──
CREATE TABLE IF NOT EXISTS public.user_favorites (
  user_id    bigint NOT NULL REFERENCES public.users(id)  ON DELETE CASCADE,
  store_id   bigint NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  created_at timestamp without time zone DEFAULT now(),
  PRIMARY KEY (user_id, store_id)
);

-- ── orders: /api/v1/users/me/orders selects paid_amount/address/paid_at/type/payment_method
--    Mirror the existing columns where possible so data is correct, not null. ──
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS paid_amount    numeric GENERATED ALWAYS AS (total_amount)     STORED;
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS address        text    GENERATED ALWAYS AS (delivery_address) STORED;
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS paid_at        timestamp without time zone GENERATED ALWAYS AS (ordered_at) STORED;
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS type           character varying DEFAULT 'DELIVERY';
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method character varying;

-- ── order_items: /api/v1/users/me/orders selects unit_price/menu_name/menu_image ──
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS unit_price numeric GENERATED ALWAYS AS (price) STORED;
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS menu_name  character varying;
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS menu_image text;

-- Backfill menu_name/menu_image for existing rows (orders.ts does not set them).
UPDATE public.order_items oi
SET menu_name = m.name, menu_image = m.image_url
FROM public.menus m
WHERE oi.menu_id = m.id AND oi.menu_name IS NULL;

COMMIT;
