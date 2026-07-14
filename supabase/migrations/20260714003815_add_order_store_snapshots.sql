-- Preserve the store shown at checkout even when a catalog store id is absent.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS store_name character varying,
  ADD COLUMN IF NOT EXISTS store_image text;

-- Recover snapshots for existing orders that still have a menu relationship.
UPDATE public.orders AS orders
SET
  store_id = COALESCE(orders.store_id, snapshot.store_id),
  store_name = COALESCE(orders.store_name, snapshot.store_name),
  store_image = COALESCE(orders.store_image, snapshot.store_image)
FROM (
  SELECT DISTINCT ON (order_items.order_id)
    order_items.order_id,
    stores.id AS store_id,
    stores.name AS store_name,
    stores.image_url AS store_image
  FROM public.order_items AS order_items
  JOIN public.menus AS menus ON menus.id = order_items.menu_id
  JOIN public.stores AS stores ON stores.id = menus.store_id
  ORDER BY order_items.order_id, order_items.id
) AS snapshot
WHERE orders.id = snapshot.order_id;

-- Fill snapshots for orders that already have a direct store id.
UPDATE public.orders AS orders
SET
  store_name = COALESCE(orders.store_name, stores.name),
  store_image = COALESCE(orders.store_image, stores.image_url)
FROM public.stores AS stores
WHERE orders.store_id = stores.id;
