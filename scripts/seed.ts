/**
 * 개발용 시드 데이터 삽입 스크립트
 * 실행 방법: npm run seed
 *
 * ⚠️  Supabase 대시보드 SQL 에디터에서 db/schema.sql 을 먼저 실행해야 합니다.
 */
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function seed() {
  console.log('🌱 시드 데이터 삽입 시작...');

  // ─── Categories ───────────────────────────────────────────────────────────
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .insert([
      { name: 'Korean',  image_url: 'assets/images/cat_korean.png' },
      { name: 'Chicken', image_url: 'assets/images/cat_chicken_single.png' },
      { name: 'Street',  image_url: 'assets/images/cat_street.png' },
      { name: 'Coffee',  image_url: 'assets/images/cat_coffee.png' },
    ])
    .select();

  if (catError) throw new Error(`categories: ${catError.message}`);
  console.log(`✅ categories (${categories?.length}건)`);

  const [catKorean, catChicken, catStreet, catCoffee] = categories!;

  // ─── Stores ───────────────────────────────────────────────────────────────
  const { data: stores, error: storesError } = await supabase
    .from('stores')
    .insert([
      {
        category_id: catKorean.id,
        name: 'Simin Jokbal Bossam Sillim',
        description: 'Tender jokbal and bossam plates for a filling meal.',
        address: 'Seoul Gwanak-gu Sillim-dong',
        latitude: 37.4847,
        longitude: 126.9291,
        image_url: 'assets/images/food_jokbal.png',
        rating: 5.0,
        review_count: 2002,
      },
      {
        category_id: catStreet.id,
        name: 'Yupki Ddukbokki Sillim',
        description: 'Spicy tteokbokki with chewy rice cakes and fish cake.',
        address: 'Seoul Gwanak-gu Sillim-ro',
        latitude: 37.4852,
        longitude: 126.9279,
        image_url: 'assets/images/food_tteokbokki.png',
        rating: 4.8,
        review_count: 132,
      },
      {
        category_id: catChicken.id,
        name: 'Nene Chicken',
        description: 'Crispy chicken with classic Korean dipping sauces.',
        address: 'Seoul Mapo-gu',
        latitude: 37.5563,
        longitude: 126.9086,
        image_url: 'assets/images/franchise_nene_bg.png',
        rating: 4.7,
        review_count: 905,
      },
      {
        category_id: catCoffee.id,
        name: 'Ediya Coffee Sillim',
        description: 'Reliable iced coffee and quick cafe delivery.',
        address: 'Seoul Gwanak-gu',
        latitude: 37.4861,
        longitude: 126.9263,
        image_url: 'assets/images/cat_ediya.png',
        rating: 4.6,
        review_count: 421,
      },
    ])
    .select();

  if (storesError) throw new Error(`stores: ${storesError.message}`);
  console.log(`✅ stores (${stores?.length}건)`);

  const [store1, store2, store3, store4] = stores!;

  // ─── Menus ────────────────────────────────────────────────────────────────
  const { data: menus, error: menusError } = await supabase
    .from('menus')
    .insert([
      {
        store_id: store1.id,
        name: 'Half [Jok, Bo Set]',
        description: 'Jokbal and bossam set with rich savory flavor.',
        price: 38000,
        image_url: 'assets/images/food_jokbal.png',
        allergy_notice: 'pork, soy, sesame',
      },
      {
        store_id: store2.id,
        name: 'Mala Tteokbokki',
        description: 'A spicy mala twist on chewy Korean tteokbokki.',
        price: 12000,
        image_url: 'assets/images/Mala_Tteokbokki.png',
        allergy_notice: 'wheat, soy',
      },
      {
        store_id: store3.id,
        name: 'Spicy Seasoned Chicken',
        description: 'Saucy, spicy, and built for sharing.',
        price: 19000,
        image_url: 'assets/images/Spicyseasoned.png',
        allergy_notice: 'chicken, wheat, soy',
      },
      {
        store_id: store4.id,
        name: 'Iced Americano',
        description: 'Fresh espresso over ice with a clean finish.',
        price: 3500,
        image_url: 'assets/images/food_cafe.png',
        allergy_notice: null,
      },
      {
        store_id: store4.id,
        name: 'Cafe Latte',
        description: 'Espresso with steamed milk for a smooth cafe classic.',
        price: 4500,
        image_url: 'assets/images/food_cafe.png',
        allergy_notice: 'milk',
      },
      {
        store_id: store4.id,
        name: 'Grapefruit Ade',
        description: 'Sparkling grapefruit ade with a bright citrus taste.',
        price: 5200,
        image_url: 'assets/images/food_cafe.png',
        allergy_notice: null,
      },
    ])
    .select();

  if (menusError) throw new Error(`menus: ${menusError.message}`);
  console.log(`✅ menus (${menus?.length}건)`);

  // ─── Users ────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('test-password', 10);

  const { data: users, error: usersError } = await supabase
    .from('users')
    .insert([
      { name: 'John Tourist',  email: 'john@example.com', password_hash: passwordHash, phone: '010-1111-2222' },
      { name: 'Anna Traveler', email: 'anna@example.com', password_hash: passwordHash, phone: '010-3333-4444' },
    ])
    .select();

  if (usersError) throw new Error(`users: ${usersError.message}`);
  console.log(`✅ users (${users?.length}건)`);

  const [user1, user2] = users!;

  // ─── Balances ─────────────────────────────────────────────────────────────
  const { error: balError } = await supabase.from('balances').insert([
    { user_id: user1.id, balance_krw: 67500, balance_usd: 50 },
    { user_id: user2.id, balance_krw: 40500, balance_usd: 30 },
  ]);

  if (balError) throw new Error(`balances: ${balError.message}`);
  console.log('✅ balances');

  // ─── Exchange rates ───────────────────────────────────────────────────────
  const { error: ratesError } = await supabase.from('exchange_rates').insert([
    { from_currency: 'USD', to_currency: 'KRW', rate: 1350.5 },
    { from_currency: 'KRW', to_currency: 'USD', rate: 1 / 1350.5 },
    { from_currency: 'JPY', to_currency: 'KRW', rate: 9.2 },
    { from_currency: 'KRW', to_currency: 'JPY', rate: 1 / 9.2 },
  ]);

  if (ratesError) throw new Error(`exchange_rates: ${ratesError.message}`);
  console.log('✅ exchange_rates');

  console.log('\n🎉 시드 완료!');
  console.log('테스트 계정:');
  console.log('  john@example.com / test-password');
  console.log('  anna@example.com / test-password');
}

seed().catch((err) => {
  console.error('❌ 시드 실패:', err.message);
  process.exit(1);
});
