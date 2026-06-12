-- Ensure Ediya Coffee serves cafe menus instead of stale pizza data.
-- Idempotent: safe to run multiple times.

BEGIN;

DO $$
DECLARE
  ediya_store_id bigint;
BEGIN
  SELECT id
  INTO ediya_store_id
  FROM public.stores
  WHERE lower(name) LIKE '%ediya%'
  ORDER BY id
  LIMIT 1;

  IF ediya_store_id IS NOT NULL THEN
    DELETE FROM public.menus
    WHERE store_id = ediya_store_id
      AND (
        lower(name) LIKE '%pizza%'
        OR lower(name) LIKE '%pepperoni%'
        OR lower(name) LIKE '%domino%'
      );

    INSERT INTO public.menus (
      store_id,
      name,
      description,
      price,
      image_url,
      allergy_notice
    )
    SELECT
      ediya_store_id,
      menu.name,
      menu.description,
      menu.price,
      menu.image_url,
      menu.allergy_notice
    FROM (
      VALUES
        (
          'Iced Americano',
          'Fresh espresso over ice with a clean finish.',
          3500,
          'assets/images/food_cafe.png',
          NULL
        ),
        (
          'Cafe Latte',
          'Espresso with steamed milk for a smooth cafe classic.',
          4500,
          'assets/images/food_cafe.png',
          'milk'
        ),
        (
          'Grapefruit Ade',
          'Sparkling grapefruit ade with a bright citrus taste.',
          5200,
          'assets/images/food_cafe.png',
          NULL
        )
    ) AS menu(name, description, price, image_url, allergy_notice)
    WHERE NOT EXISTS (
      SELECT 1
      FROM public.menus existing
      WHERE existing.store_id = ediya_store_id
        AND lower(existing.name) = lower(menu.name)
    );
  END IF;
END $$;

COMMIT;
