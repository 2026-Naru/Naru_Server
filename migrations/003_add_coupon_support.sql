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

COMMIT;
