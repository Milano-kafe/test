const { neon } = require("@neondatabase/serverless")

async function setupDatabase() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is required")
    process.exit(1)
  }

  const sql = neon(databaseUrl)

  try {
    console.log("🔄 Setting up database tables...")

    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name_uz VARCHAR(255) NOT NULL,
        name_ru VARCHAR(255) NOT NULL,
        name_en VARCHAR(255) NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        category_id INTEGER REFERENCES categories(id),
        name_uz VARCHAR(255) NOT NULL,
        name_ru VARCHAR(255) NOT NULL,
        name_en VARCHAR(255) NOT NULL,
        description_uz TEXT,
        description_ru TEXT,
        description_en TEXT,
        recipe_uz TEXT,
        recipe_ru TEXT,
        recipe_en TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url TEXT,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        delivery_address TEXT,
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        phone VARCHAR(20),
        notes TEXT,
        payment_method VARCHAR(50),
        payment_status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        menu_item_id INTEGER REFERENCES menu_items(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("✅ Database tables created successfully!")

    // Seed initial data
    console.log("🔄 Seeding initial data...")

    // Insert categories
    await sql`
      INSERT INTO categories (name_uz, name_ru, name_en, image_url) VALUES
      ('Burgerlar', 'Бургеры', 'Burgers', '/placeholder.svg?height=300&width=300'),
      ('Pitsalar', 'Пиццы', 'Pizzas', '/placeholder.svg?height=300&width=300'),
      ('Hot Doglar', 'Хот-доги', 'Hot Dogs', '/placeholder.svg?height=300&width=300'),
      ('Ichimliklar', 'Напитки', 'Beverages', '/placeholder.svg?height=300&width=300'),
      ('Desertlar', 'Десерты', 'Desserts', '/placeholder.svg?height=300&width=300')
      ON CONFLICT DO NOTHING
    `

    // Insert sample menu items
    await sql`
      INSERT INTO menu_items (category_id, name_uz, name_ru, name_en, description_uz, description_ru, description_en, price, image_url) VALUES
      (1, 'Milano Burger', 'Милано Бургер', 'Milano Burger', 'Maxsus sous bilan tayyorlangan burger', 'Бургер с особым соусом', 'Burger with special sauce', 25000, '/placeholder.svg?height=300&width=300'),
      (1, 'Cheese Burger', 'Чиз Бургер', 'Cheese Burger', 'Pishloqli burger', 'Бургер с сыром', 'Burger with cheese', 22000, '/placeholder.svg?height=300&width=300'),
      (2, 'Margarita', 'Маргарита', 'Margherita', 'Klassik italyan pitsasi', 'Классическая итальянская пицца', 'Classic Italian pizza', 35000, '/placeholder.svg?height=300&width=300'),
      (2, 'Pepperoni', 'Пепперони', 'Pepperoni', 'Pepperoni kolbasa bilan pitsa', 'Пицца с колбасой пепперони', 'Pizza with pepperoni sausage', 40000, '/placeholder.svg?height=300&width=300'),
      (3, 'Klassik Hot Dog', 'Классик Хот-дог', 'Classic Hot Dog', 'Oddiy hot dog', 'Обычный хот-дог', 'Regular hot dog', 15000, '/placeholder.svg?height=300&width=300'),
      (4, 'Coca Cola', 'Кока Кола', 'Coca Cola', 'Sovuq ichimlik', 'Холодный напиток', 'Cold beverage', 8000, '/placeholder.svg?height=300&width=300'),
      (5, 'Tiramisu', 'Тирамису', 'Tiramisu', 'Italyan deserti', 'Итальянский десерт', 'Italian dessert', 18000, '/placeholder.svg?height=300&width=300')
      ON CONFLICT DO NOTHING
    `

    console.log("✅ Database setup completed successfully!")
    console.log("🎉 Your Milano Cafe database is ready!")
  } catch (error) {
    console.error("❌ Database setup failed:", error)
    process.exit(1)
  }
}

setupDatabase()
