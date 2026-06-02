BEGIN;

-- Users
INSERT INTO users (name, email, password_hash, phone)
VALUES
  ('John Tourist', 'john@example.com', 'hashed-test-password', '010-1111-2222'),
  ('Anna Traveler', 'anna@example.com', 'hashed-test-password', '010-3333-4444');

-- Stores
INSERT INTO stores (name, description, address)
VALUES
  ('Naru Gukbap', 'Warm Korean soup restaurant near the station.', 'Seoul Jung-gu 1'),
  ('Seoul Tteokbokki', 'Spicy street food and snacks.', 'Seoul Mapo-gu 22');

-- Menus
INSERT INTO menus (store_id, name, description, price, allergy_notice)
VALUES
  (1, 'Pork Gukbap', 'Rice soup with pork broth.', 9500, 'pork'),
  (1, 'Vegetable Bibimbap', 'Rice bowl with vegetables.', 11000, 'soy,sesame'),
  (2, 'Tteokbokki', 'Spicy rice cakes.', 6000, 'wheat,soy'),
  (2, 'Fish Cake Soup', 'Warm fish cake soup.', 5000, 'fish,wheat');

-- Carts
INSERT INTO carts (user_id)
VALUES (1), (2);

-- Cart items
INSERT INTO cart_items (cart_id, menu_id, quantity)
VALUES (1,1,1), (1,2,1), (2,3,2);

-- Orders
INSERT INTO orders (user_id, store_id, delivery_address, status, total_amount)
VALUES (1,1,'Seoul Jung-gu Hotel Naru','PAID', 20500);

-- Order items
INSERT INTO order_items (order_id, menu_id, quantity, price)
VALUES (1,1,1,9500), (1,2,1,11000);

-- Reviews
INSERT INTO reviews (store_id, user_id, rating, content)
VALUES (1,1,5,'Good soup and easy to order.'), (2,2,4,'Spicy but delicious.');

-- Exchange transactions
INSERT INTO exchange_transactions (user_id, from_currency, to_currency, amount_from, amount_to, exchange_rate)
VALUES (1,'USD','KRW',50,67500,1350), (2,'USD','KRW',30,40500,1350);

-- Balances
INSERT INTO balances (user_id, balance_krw, balance_usd)
VALUES (1,67500,50),(2,40500,30);

COMMIT;
