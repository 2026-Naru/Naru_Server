import express from 'express';
import { supabase } from '../utils/supabase';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

type MaybeArray<T> = T | T[] | null | undefined;

type StoreSummary = {
  id: number | null;
  name: string | null;
  image_url: string | null;
};

type MenuSummary = {
  id?: number | null;
  name?: string | null;
  image_url?: string | null;
  store_id?: number | null;
  stores?: MaybeArray<StoreSummary>;
};

type OrderItemSummary = {
  id: number;
  menu_id: number | null;
  quantity: number | null;
  price: number | null;
  menu_name?: string | null;
  menu_image?: string | null;
  menus?: MaybeArray<MenuSummary>;
};

type OrderSummary = {
  id: number;
  status: string | null;
  total_amount?: number | null;
  paid_amount?: number | null;
  delivery_address?: string | null;
  ordered_at?: string | null;
  paid_at?: string | null;
  completed_at?: string | null;
  stores?: MaybeArray<StoreSummary>;
  order_items?: OrderItemSummary[] | null;
};

function firstRelation<T>(value: MaybeArray<T>): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function cleanString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function serializeOrder(row: OrderSummary) {
  const orderItems = (row.order_items ?? []).map((item) => {
    const menu = firstRelation(item.menus);
    return {
      ...item,
      menu_name: cleanString(item.menu_name) ?? cleanString(menu?.name),
      menu_image: cleanString(item.menu_image) ?? cleanString(menu?.image_url),
      menus: menu
        ? {
            id: menu.id ?? item.menu_id,
            name: cleanString(menu.name),
            image_url: cleanString(menu.image_url),
            store_id: menu.store_id ?? null,
          }
        : null,
    };
  });

  const directStore = firstRelation(row.stores);
  const menuStore = firstRelation(
    firstRelation((row.order_items ?? []).find((item) => firstRelation(item.menus)?.stores)?.menus)?.stores,
  );
  const store = directStore ?? menuStore;

  return {
    ...row,
    stores: store,
    store_name: cleanString(store?.name),
    store_image_url: cleanString(store?.image_url),
    order_items: orderItems,
  };
}

// GET /api/v1/users/me
router.get('/me', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, phone, profile_image_url, balance_krw, balance_usd')
      .eq('id', req.userId!)
      .maybeSingle();

    if (error || !data) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({ success: true, message: '내 프로필 조회 성공', data });
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/users/me/orders?status=pending|completed|PAID|...
router.get('/me/orders', async (req, res, next) => {
  try {
    const PENDING_STATUSES = ['PAID', 'COOKING', 'DELIVERING'];
    const statusParam = typeof req.query.status === 'string' ? req.query.status : undefined;

    let q = supabase
      .from('orders')
      .select(`
        id, status, total_amount, delivery_address, ordered_at, completed_at,
        stores(id, name, image_url),
        order_items(
          id, menu_id, quantity, price, menu_name, menu_image,
          menus(id, name, image_url, store_id, stores(id, name, image_url))
        )
      `)
      .eq('user_id', req.userId!)
      .order('ordered_at', { ascending: false });

    if (statusParam === 'pending') {
      q = q.in('status', PENDING_STATUSES);
    } else if (statusParam === 'completed') {
      q = q.eq('status', 'COMPLETED');
    } else if (statusParam) {
      q = q.eq('status', statusParam.toUpperCase());
    }

    const { data, error } = await q;

    if (error) {
      return res.status(400).json({ success: false, message: '주문 내역 조회 실패', error: error.message });
    }

    const orders = (data ?? []).map((row) => serializeOrder(row as unknown as OrderSummary));
    res.json({ success: true, message: `${orders.length}개 주문 조회`, data: orders });
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/users/me/favorites
router.get('/me/favorites', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('store_id, created_at, stores(id, name, image_url, rating, review_count, categories(name))')
      .eq('user_id', req.userId!)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: '찜 목록 조회 실패', error: error.message });
    }

    res.json({ success: true, message: `${data.length}개 찜 가게 조회`, data });
  } catch (e) {
    next(e);
  }
});

// POST /api/v1/users/me/favorites  body: { storeId }
router.post('/me/favorites', async (req, res, next) => {
  try {
    const storeId = Number(req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      return res.status(400).json({ success: false, message: 'storeId가 필요합니다.' });
    }

    const { error } = await supabase
      .from('user_favorites')
      .insert({ user_id: req.userId!, store_id: storeId });

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ success: false, message: '이미 찜한 가게입니다.' });
      }
      return res.status(400).json({ success: false, message: '찜 추가 실패', error: error.message });
    }

    res.status(201).json({ success: true, message: '찜 목록에 추가됐습니다.' });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/v1/users/me/favorites/:storeId
router.delete('/me/favorites/:storeId', async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', req.userId!)
      .eq('store_id', storeId);

    if (error) {
      return res.status(400).json({ success: false, message: '찜 삭제 실패', error: error.message });
    }

    res.json({ success: true, message: '찜 목록에서 삭제됐습니다.' });
  } catch (e) {
    next(e);
  }
});

export default router;
