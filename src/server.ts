import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth';
import categoryRoutes from './routes/categories';
import storeRoutes from './routes/stores';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import userRoutes from './routes/users';
import exchangeRoutes from './routes/exchange';
import mapRoutes from './routes/map';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const serverStartedAt = Date.now();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── System ────────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: '✅ Naru backend is running!', timestamp: new Date().toISOString() });
});

app.get('/api/runtime', (_req, res) => {
  res.json({ serverStartedAt });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/stores', storeRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/exchange', exchangeRoutes);
app.use('/api/v1/map', mapRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `${req.method} ${req.path} 를 찾을 수 없습니다.` });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════╗
║      🍽️  Naru Backend Server Started      ║
╚═══════════════════════════════════════════╝

📍 Server URL : http://localhost:${PORT}
📱 Device URL : http://<your-mac-ip>:${PORT}
🌿 Supabase   : ${process.env.SUPABASE_URL}

✅ Available Endpoints:
   POST   /api/v1/auth/login
   POST   /api/v1/auth/signup
   GET    /api/v1/categories
   GET    /api/v1/stores/search?query=...
   GET    /api/v1/stores/nearby
   GET    /api/v1/stores/:storeId
   GET    /api/v1/stores/:storeId/menus
   GET    /api/v1/cart              [auth]
   POST   /api/v1/cart/items        [auth]
   PATCH  /api/v1/cart/items/:id    [auth]
   DELETE /api/v1/cart/items/:id    [auth]
   POST   /api/v1/orders            [auth]
   GET    /api/v1/orders/:id        [auth]
   GET    /api/v1/orders/:id/status
   GET    /api/v1/users/me                      [auth]
   GET    /api/v1/users/me/orders               [auth]
   GET    /api/v1/users/me/orders?status=       [auth]
   GET    /api/v1/users/me/favorites            [auth]
   POST   /api/v1/users/me/favorites            [auth]
   DELETE /api/v1/users/me/favorites/:storeId   [auth]
   GET    /api/v1/stores/:storeId/reviews
   GET    /api/v1/exchange/balance              [auth]
   GET    /api/v1/exchange/rates
   GET    /api/v1/map/search
   GET    /api/v1/map/routes
`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Server shutting down...');
  process.exit(0);
});
