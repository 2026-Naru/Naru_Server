import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const cafes = [
  {
    name: 'Ediya Coffee Sillim',
    description: 'Reliable iced coffee and quick cafe delivery.',
    address: 'Seoul Gwanak-gu Sillim-dong',
    latitude: 37.4861,
    longitude: 126.9263,
    image_url: 'assets/images/ediya.svg',
    rating: 4.9,
    review_count: 421,
    menus: [
      ['Iced Americano', 'Fresh espresso over ice.', 3500],
      ['Cafe Latte', 'Smooth espresso with steamed milk.', 4500],
      ['Grapefruit Ade', 'Bright sparkling grapefruit ade.', 5200],
    ],
  },
  {
    name: 'Bback Dabang Sillim',
    description: 'Large coffees and cafe drinks for pick up.',
    address: 'Seoul Gwanak-gu Sillim-ro',
    latitude: 37.4856,
    longitude: 126.9281,
    image_url: 'assets/images/bdb.svg',
    rating: 4.9,
    review_count: 2002,
    menus: [
      ['Original Coffee', 'A sweet and bold signature iced coffee.', 3000],
      ['Condensed Milk Latte', 'Creamy latte with condensed milk.', 4200],
      ['Cafe Mocha', 'Chocolate and espresso over milk.', 4500],
    ],
  },
  {
    name: 'Cafe Bombom Sillim',
    description: 'Sweet drinks, coffee, and refreshing dessert cups.',
    address: 'Seoul Gwanak-gu Nambusunhwan-ro',
    latitude: 37.4849,
    longitude: 126.9258,
    image_url: 'assets/images/bombom.svg',
    rating: 4.8,
    review_count: 1245,
    menus: [
      ['Strawberry Smoothie', 'Fresh strawberry smoothie with milk.', 5500],
      ['Chocolate Latte', 'Rich chocolate with smooth milk.', 4800],
      ['Mango Ade', 'Sparkling mango ade served cold.', 5200],
    ],
  },
] as const;

async function seedCafes() {
  for (const cafe of cafes) {
    const { menus, ...storeValues } = cafe;
    const { data: existing, error: findError } = await supabase
      .from('stores')
      .select('id')
      .eq('name', cafe.name)
      .maybeSingle();
    if (findError) throw findError;

    let storeId = existing?.id;
    if (storeId == null) {
      const { data: inserted, error: insertError } = await supabase
        .from('stores')
        .insert({ ...storeValues, category_id: null })
        .select('id')
        .single();
      if (insertError) throw insertError;
      storeId = inserted.id;
    }

    const { data: existingMenus, error: menuFindError } = await supabase
      .from('menus')
      .select('name')
      .eq('store_id', storeId);
    if (menuFindError) throw menuFindError;
    const existingNames = new Set((existingMenus ?? []).map((menu) => menu.name));
    const missingMenus = menus
      .filter(([name]) => !existingNames.has(name))
      .map(([name, description, price]) => ({
        store_id: storeId,
        name,
        description,
        price,
        image_url: 'assets/images/food_cafe.png',
        allergy_notice:
            name.includes('Americano') || name.includes('Ade') ? null : 'milk',
      }));

    if (missingMenus.length > 0) {
      const { error: menuInsertError } = await supabase
        .from('menus')
        .insert(missingMenus);
      if (menuInsertError) throw menuInsertError;
    }
  }

  console.log(`Seeded ${cafes.length} cafes.`);
}

seedCafes().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
