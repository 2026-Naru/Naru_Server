import express from 'express';
import { supabase } from '../utils/supabase';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

type ReviewRow = Record<string, unknown>;

function reviewImageUrl(row: ReviewRow): string | null {
  const keys = [
    'image_url',
    'imageUrl',
    'review_image_url',
    'reviewImageUrl',
    'review_image',
    'reviewImage',
    'photo_url',
    'photoUrl',
    'thumbnail_url',
    'thumbnailUrl',
    'url',
    'image',
  ];
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return null;
}

function serializeReview(row: ReviewRow) {
  return {
    ...row,
    image_url: reviewImageUrl(row),
  };
}

// GET /api/v1/stores/search?query=...&categoryId=1
router.get('/search', async (req, res, next) => {
  try {
    const query = String(req.query.query || '').trim();
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : null;

    let q = supabase
      .from('stores')
      .select('id, name, description, image_url, rating, review_count, address, categories(id, name)');

    if (query) {
      q = q.ilike('name', `%${query}%`);
    }

    if (categoryId) {
      q = q.eq('category_id', categoryId);
    }

    const { data, error } = await q.order('rating', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: '가게 검색 실패', error: error.message });
    }

    res.json({ success: true, message: `${data.length}개 가게 검색`, data });
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/stores/nearby?lat=...&lng=...
router.get('/nearby', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('stores')
      .select('id, name, description, image_url, rating, review_count, address, latitude, longitude, categories(id, name)')
      .order('rating', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: '주변 가게 조회 실패', error: error.message });
    }

    res.json({ success: true, message: `${data.length}개 가게 조회`, data });
  } catch (e) {
    next(e);
  }
});

// POST /api/v1/stores/:storeId/reviews  [auth]
router.post('/:storeId/reviews', authMiddleware, async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);
    const { rating, content, country, imageUrl, image_url } = req.body;
    const reviewImageUrl = imageUrl ?? image_url ?? null;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'rating은 1~5 사이여야 합니다.' });
    }

    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('id', storeId)
      .maybeSingle();

    if (storeError || !store) {
      return res.status(404).json({ success: false, message: '가게를 찾을 수 없습니다.' });
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        store_id: storeId,
        user_id: req.userId!,
        rating,
        content: content ?? null,
        country: country ?? null,
        image_url: reviewImageUrl,
      })
      .select('*')
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: '리뷰 작성 실패', error: error.message });
    }

    res.status(201).json({ success: true, message: '리뷰를 작성했습니다.', data: serializeReview(review) });
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/stores/:storeId/reviews
router.get('/:storeId/reviews', async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: '리뷰 조회 실패', error: error.message });
    }

    const rows = data ?? [];
    const userIds = [...new Set(
      rows
        .map((row) => row.user_id)
        .filter((id): id is number => typeof id === 'number')
    )];
    const userNameById = new Map<number, string>();

    if (userIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, name')
        .in('id', userIds);

      if (usersError) {
        return res.status(400).json({ success: false, message: '리뷰 작성자 조회 실패', error: usersError.message });
      }

      for (const user of users ?? []) {
        if (typeof user.id === 'number' && typeof user.name === 'string') {
          userNameById.set(user.id, user.name);
        }
      }
    }

    const reviews = rows.map((row) => serializeReview({
      ...row,
      user_name: typeof row.user_id === 'number' ? userNameById.get(row.user_id) ?? null : null,
    }));
    res.json({ success: true, message: `${reviews.length}개 리뷰 조회`, data: reviews });
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/stores/:storeId/menus
router.get('/:storeId/menus', async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);

    const { data, error } = await supabase
      .from('menus')
      .select('id, store_id, name, description, price, image_url, allergy_notice')
      .eq('store_id', storeId)
      .order('id');

    if (error) {
      return res.status(400).json({ success: false, message: '메뉴 조회 실패', error: error.message });
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: '해당 가게의 메뉴가 없습니다.' });
    }

    res.json({ success: true, message: `${data.length}개 메뉴 조회`, data });
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/stores/:storeId
router.get('/:storeId', async (req, res, next) => {
  try {
    const storeId = Number(req.params.storeId);

    const { data, error } = await supabase
      .from('stores')
      .select('id, name, description, image_url, rating, review_count, address, latitude, longitude, categories(id, name)')
      .eq('id', storeId)
      .maybeSingle();

    if (error) {
      return res.status(400).json({ success: false, message: '가게 조회 실패', error: error.message });
    }
    if (!data) {
      return res.status(404).json({ success: false, message: '가게를 찾을 수 없습니다.' });
    }

    res.json({ success: true, message: '가게 조회 성공', data });
  } catch (e) {
    next(e);
  }
});

export default router;
