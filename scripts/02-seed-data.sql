-- Insert categories
INSERT INTO categories (name_uz, name_ru, name_en, image_url) VALUES
('Burgerlar', 'Бургеры', 'Burgers', '/images/categories/burgers.jpg'),
('Pitsalar', 'Пиццы', 'Pizzas', '/images/categories/pizzas.jpg'),
('Hot Doglar', 'Хот-доги', 'Hot Dogs', '/images/categories/hotdogs.jpg'),
('Ichimliklar', 'Напитки', 'Beverages', '/images/categories/beverages.jpg'),
('Desertlar', 'Десерты', 'Desserts', '/images/categories/desserts.jpg');
  
-- Insert sample menu items
INSERT INTO menu_items (category_id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, recipe_uz, recipe_ru, recipe_en, price, image_url) VALUES
(1, 'Milano Burger', 'Милано Бургер', 'Milano Burger', 'Maxsus sous bilan tayyorlangan burger', 'Бургер с особым соусом', 'Burger with special sauce', 'Go''sht, pomidor, salat, maxsus sous', 'Мясо, помидор, салат, особый соус', 'Meat, tomato, lettuce, special sauce', 25000, '/images/menu/milano-burger.jpg'),
(1, 'Cheese Burger', 'Чиз Бургер', 'Cheese Burger', 'Pishloqli burger', 'Бургер с сыром', 'Burger with cheese', 'Go''sht, pishloq, pomidor, salat', 'Мясо, сыр, помидор, салат', 'Meat, cheese, tomato, lettuce', 22000, '/images/menu/cheese-burger.jpg'),
(2, 'Margarita', 'Маргарита', 'Margherita', 'Klassik italyan pitsasi', 'Классическая итальянская пицца', 'Classic Italian pizza', 'Pomidor sousi, mozzarella, rayhon', 'Томатный соус, моцарелла, базилик', 'Tomato sauce, mozzarella, basil', 35000, '/images/menu/margherita.jpg'),
(2, 'Pepperoni', 'Пепперони', 'Pepperoni', 'Pepperoni kolbasa bilan pitsa', 'Пицца с колбасой пепперони', 'Pizza with pepperoni sausage', 'Pomidor sousi, mozzarella, pepperoni', 'Томатный соус, моцарелла, пепперони', 'Tomato sauce, mozzarella, pepperoni', 40000, '/images/menu/pepperoni.jpg'),
(3, 'Klassik Hot Dog', 'Классик Хот-дог', 'Classic Hot Dog', 'Oddiy hot dog', 'Обычный хот-дог', 'Regular hot dog', 'Kolbasa, non, ketchup, gorchitsa', 'Колбаса, булка, кетчуп, горчица', 'Sausage, bun, ketchup, mustard', 15000, '/images/menu/classic-hotdog.jpg'),
(4, 'Coca Cola', 'Кока Кола', 'Coca Cola', 'Sovuq ichimlik', 'Холодный напиток', 'Cold beverage', 'Gazlangan ichimlik', 'Газированный напиток', 'Carbonated drink', 8000, '/images/menu/coca-cola.jpg'),
(5, 'Tiramisu', 'Тирамису', 'Tiramisu', 'Italyan deserti', 'Итальянский десерт', 'Italian dessert', 'Mascarpone, kofe, kakao', 'Маскарпоне, кофе, какао', 'Mascarpone, coffee, cocoa', 18000, '/images/menu/tiramisu.jpg');

-- Insert admin user (password: admin123)
INSERT INTO admin_users (username, password) VALUES
('admin', '$2b$10$rOzJlQJbKpkQvKmCjKJKKOzJlQJbKpkQvKmCjKJKKOzJlQJbKpkQv');
