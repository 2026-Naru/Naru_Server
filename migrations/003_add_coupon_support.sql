-- Add coupon tables and user assignment constraints for order discounts.
-- Idempotent: safe to run multiple times.

BEGIN;

CREATE TABLE IF NOT EXISTS public.coupons (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name character varying,
  discount_amount numeric DEFAULT 0,
  expires_at timestamp without time zone
);

CREATE TABLE IF NOT EXISTS public.user_coupons (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id bigint REFERENCES public.users(id) ON DELETE CASCADE,
  coupon_id bigint REFERENCES public.coupons(id) ON DELETE CASCADE,
  is_used boolean DEFAULT false,
  used_at timestamp without time zone
);

CREATE UNIQUE INDEX IF NOT EXISTS user_coupons_user_coupon_unique
  ON public.user_coupons (user_id, coupon_id);

DO $$
DECLARE
  coupons_sequence text;
  user_coupons_sequence text;
BEGIN
  SELECT pg_get_serial_sequence('public.coupons', 'id')
    INTO coupons_sequence;
  IF coupons_sequence IS NOT NULL THEN
    EXECUTE format(
      'SELECT setval(%L, COALESCE((SELECT MAX(id) FROM public.coupons), 0) + 1, false)',
      coupons_sequence
    );
  END IF;

  SELECT pg_get_serial_sequence('public.user_coupons', 'id')
    INTO user_coupons_sequence;
  IF user_coupons_sequence IS NOT NULL THEN
    EXECUTE format(
      'SELECT setval(%L, COALESCE((SELECT MAX(id) FROM public.user_coupons), 0) + 1, false)',
      user_coupons_sequence
    );
  END IF;
END $$;

INSERT INTO public.coupons (name, discount_amount, expires_at)
SELECT 'Welcome Coupon', 3000, now() + interval '90 days'
WHERE NOT EXISTS (
  SELECT 1 FROM public.coupons WHERE name = 'Welcome Coupon'
);

INSERT INTO public.coupons (name, discount_amount, expires_at)
SELECT 'First Order Discount', 5000, now() + interval '90 days'
WHERE NOT EXISTS (
  SELECT 1 FROM public.coupons WHERE name = 'First Order Discount'
);

INSERT INTO public.coupons (name, discount_amount, expires_at)
SELECT 'Free Delivery Coupon', 2000, now() + interval '90 days'
WHERE NOT EXISTS (
  SELECT 1 FROM public.coupons WHERE name = 'Free Delivery Coupon'
);

COMMIT;
