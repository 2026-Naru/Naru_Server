import express from 'express';
import { supabase } from '../utils/supabase';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

const ORDER_STATUS_GAUGE: Record<string, number> = {
  PAID: 10,
  COOKING: 35,
  DELIVERING: 75,
  COMPLETED: 100,
  CANCELED: 0,
};

const ORDER_STATUSES = Object.keys(ORDER_STATUS_GAUGE);

// POST /api/v1/orders  [auth]
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const {
      type = 'DELIVERY',
      deliveryAddress,
      cartItemIds,
      totalAmount,
      items,
    } = req.body;

    if (!['DELIVERY', 'PICKUP'].includes(type)) {
      return res.status(400).json({ success: false, message: 'type은 DELIVERY 또는 PICKUP이어야 합니다.' });
    }

    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', req.userId!)
      .maybeSingle();

    let cartItems: any[] = [];
    if (cart) {
      let cartQuery = supabase
        .from('cart_items')
        .select('id, menu_id, quantity, menus(id, name, price, image_url, store_id)')
        .eq('cart_id', cart.id);

      if (Array.isArray(cartItemIds) && cartItemIds.length > 0) {
        cartQuery = cartQuery.in('id', cartItemIds);
      }

      const { data, error: cartError } = await cartQuery;
      if (cartError) {
        return res.status(400).json({ success: false, message: '장바구니 조회 실패', error: cartError.message });
      }
      cartItems = data ?? [];
    }

    const directItems = Array.isArray(items)
      ? items
          .map((item) => ({
            menuId: item?.menuId == null ? null : Number(item.menuId),
            storeId: item?.storeId == null ? null : Number(item.storeId),
            name:
              typeof item?.name === 'string'
                ? item.name
                : typeof item?.menuName === 'string'
                  ? item.menuName
                  : typeof item?.menu_name === 'string'
                    ? item.menu_name
                    : null,
            imageUrl:
              typeof item?.imageUrl === 'string'
                ? item.imageUrl
                : typeof item?.image_url === 'string'
                  ? item.image_url
                  : typeof item?.menuImage === 'string'
                    ? item.menuImage
                    : typeof item?.menu_image === 'string'
                      ? item.menu_image
                      : null,
            quantity: Math.max(1, Number(item?.quantity) || 1),
            price: Math.max(0, Number(item?.price) || 0),
          }))
          .filter((item) => item.quantity > 0)
      : [];

    if (cartItems.length === 0 && directItems.length === 0) {
      return res.status(400).json({ success: false, message: '주문할 항목이 없습니다.' });
    }

    const firstMenu = cartItems[0]?.menus as { store_id: number | null } | null | undefined;
    const directStoreId = directItems.find((item) => item.storeId && item.storeId > 0)?.storeId ?? null;
    const storeId = firstMenu?.store_id ?? directStoreId;

    const calculatedAmount = cartItems.length > 0
      ? cartItems.reduce((sum, ci) => {
          const menu = ci.menus as { price: number } | null;
          return sum + (menu?.price ?? 0) * (ci.quantity ?? 1);
        }, 0)
      : directItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderTotalAmount = Math.max(Number(totalAmount) || 0, calculatedAmount);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: req.userId!,
        store_id: storeId,
        delivery_address: deliveryAddress ?? null,
        total_amount: orderTotalAmount,
        status: 'PAID',
      })
      .select('id, status, total_amount, delivery_address, ordered_at')
      .single();

    if (orderError) {
      return res.status(400).json({ success: false, message: '주문 생성 실패', error: orderError.message });
    }

    const orderItemRows = cartItems.length > 0
      ? cartItems.map((ci) => {
          const menu = ci.menus as { name: string | null; price: number; image_url: string | null } | null;
          return {
            order_id: order.id,
            menu_id: ci.menu_id,
            menu_name: menu?.name ?? null,
            menu_image: menu?.image_url ?? null,
            quantity: ci.quantity ?? 1,
            price: menu?.price ?? 0,
          };
        })
      : directItems.map((item) => ({
          order_id: order.id,
          menu_id: item.menuId && item.menuId > 0 ? item.menuId : null,
          menu_name: item.name,
          menu_image: item.imageUrl,
          quantity: item.quantity,
          price: item.price,
        }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemRows as any);
    if (itemsError) {
      return res.status(400).json({ success: false, message: '주문 아이템 저장 실패', error: itemsError.message });
    }

    if (cartItems.length > 0) {
      await supabase.from('cart_items').delete().in('id', cartItems.map((ci) => ci.id));
    }

    res.status(201).json({ success: true, message: '주문이 완료됐습니다.', data: order });
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/orders/:orderId  [auth]
router.get('/:orderId', authMiddleware, async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id, status, total_amount, delivery_address, ordered_at,
        order_items(id, menu_id, quantity, price, menu_name, menu_image, menus(name, image_url))
      `)
      .eq('id', orderId)
      .maybeSingle();

    if (error || !order) {
      return res.status(404).json({ success: false, message: '주문을 찾을 수 없습니다.' });
    }

    res.json({ success: true, message: '주문 조회 성공', data: order });
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/orders/:orderId/status
router.get('/:orderId/status', async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);

    const { data: order, error } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .maybeSingle();

    if (error || !order) {
      return res.status(404).json({ success: false, message: '주문을 찾을 수 없습니다.' });
    }

    const status = order.status ?? 'UNKNOWN';
    res.json({
      success: true,
      message: '주문 상태 조회 성공',
      data: { status, gauge: ORDER_STATUS_GAUGE[status] ?? 0 },
    });
  } catch (e) {
    next(e);
  }
});

// PATCH /api/v1/orders/:orderId/status  [auth]
router.patch('/:orderId/status', authMiddleware, async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);
    const status = typeof req.body.status === 'string' ? req.body.status.toUpperCase() : '';

    if (!orderId || Number.isNaN(orderId)) {
      return res.status(400).json({ success: false, message: '올바른 orderId가 필요합니다.' });
    }

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: '올바른 주문 상태가 필요합니다.' });
    }

    const patch: {
      status: string;
      completed_at?: string;
    } = { status };
    if (status === 'COMPLETED') {
      patch.completed_at = new Date().toISOString();
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update(patch)
      .eq('id', orderId)
      .eq('user_id', req.userId!)
      .select('id, status, completed_at')
      .maybeSingle();

    if (error) {
      return res.status(400).json({ success: false, message: '주문 상태 변경 실패', error: error.message });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: '주문을 찾을 수 없습니다.' });
    }

    res.json({
      success: true,
      message: '주문 상태 변경 성공',
      data: {
        ...order,
        gauge: ORDER_STATUS_GAUGE[order.status ?? status] ?? 0,
      },
    });
  } catch (e) {
    next(e);
  }
});

export default router;
