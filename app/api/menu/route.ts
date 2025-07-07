import { NextResponse } from "next/server"
import { sql, hasDb } from "@/lib/db"

const demoMenuItems = [
  {
    id: 1,
    category_id: 1,
    name_uz: "Milano Burger",
    name_ru: "Милано Бургер", 
    name_en: "Milano Burger",
    description_uz: "Maxsus sous bilan tayyorlangan premium burger",
    description_ru: "Премиум бургер с особым соусом",
    description_en: "Premium burger with special sauce",
    price: 25000,
    image_url: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
    category_name_uz: "Burgerlar",
    category_name_ru: "Бургеры",
    category_name_en: "Burgers",
    rating: 4.8,
    reviews_count: 124,
    is_available: true
  },
  {
    id: 2,
    category_id: 1,
    name_uz: "Cheese Burger",
    name_ru: "Чиз Бургер",
    name_en: "Cheese Burger", 
    description_uz: "Eriydigan pishloq bilan tayyorlangan burger",
    description_ru: "Бургер с плавленым сыром",
    description_en: "Burger with melted cheese",
    price: 22000,
    image_url: "https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg",
    category_name_uz: "Burgerlar",
    category_name_ru: "Бургеры", 
    category_name_en: "Burgers",
    rating: 4.6,
    reviews_count: 89,
    is_available: true
  },
  {
    id: 3,
    category_id: 2,
    name_uz: "Margarita Pitsa",
    name_ru: "Пицца Маргарита",
    name_en: "Margherita Pizza",
    description_uz: "Klassik italyan pitsasi - mozzarella va rayhon bilan",
    description_ru: "Классическая итальянская пицца с моцареллой и базиликом",
    description_en: "Classic Italian pizza with mozzarella and basil",
    price: 35000,
    image_url: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg",
    category_name_uz: "Pitsalar",
    category_name_ru: "Пиццы",
    category_name_en: "Pizzas",
    rating: 4.9,
    reviews_count: 156,
    is_available: true
  },
  {
    id: 4,
    category_id: 2,
    name_uz: "Pepperoni Pitsa",
    name_ru: "Пицца Пепперони",
    name_en: "Pepperoni Pizza",
    description_uz: "Achchiq pepperoni kolbasa bilan pitsa",
    description_ru: "Пицца с острой колбасой пепперони",
    description_en: "Pizza with spicy pepperoni sausage",
    price: 40000,
    image_url: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg",
    category_name_uz: "Pitsalar",
    category_name_ru: "Пиццы",
    category_name_en: "Pizzas",
    rating: 4.7,
    reviews_count: 203,
    is_available: true
  },
  {
    id: 5,
    category_id: 3,
    name_uz: "Milano Hot Dog",
    name_ru: "Милано Хот-дог",
    name_en: "Milano Hot Dog",
    description_uz: "Maxsus sous va ko'katlar bilan hot dog",
    description_ru: "Хот-дог с особым соусом и зеленью",
    description_en: "Hot dog with special sauce and herbs",
    price: 18000,
    image_url: "https://images.pexels.com/photos/4676410/pexels-photo-4676410.jpeg",
    category_name_uz: "Hot Doglar",
    category_name_ru: "Хот-доги",
    category_name_en: "Hot Dogs",
    rating: 4.5,
    reviews_count: 67,
    is_available: true
  },
  {
    id: 6,
    category_id: 4,
    name_uz: "Fresh Orange Juice",
    name_ru: "Свежий апельсиновый сок",
    name_en: "Fresh Orange Juice",
    description_uz: "Yangi siqilgan apelsin sharbati",
    description_ru: "Свежевыжатый апельсиновый сок",
    description_en: "Freshly squeezed orange juice",
    price: 12000,
    image_url: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg",
    category_name_uz: "Ichimliklar",
    category_name_ru: "Напитки",
    category_name_en: "Beverages",
    rating: 4.4,
    reviews_count: 45,
    is_available: true
  },
  {
    id: 7,
    category_id: 5,
    name_uz: "Tiramisu",
    name_ru: "Тирамису",
    name_en: "Tiramisu",
    description_uz: "Klassik italyan deserti - mascarpone va kofe bilan",
    description_ru: "Классический итальянский десерт с маскарпоне и кофе",
    description_en: "Classic Italian dessert with mascarpone and coffee",
    price: 20000,
    image_url: "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg",
    category_name_uz: "Desertlar",
    category_name_ru: "Десерты",
    category_name_en: "Desserts",
    rating: 4.9,
    reviews_count: 78,
    is_available: true
  },
  {
    id: 8,
    category_id: 5,
    name_uz: "Chocolate Cake",
    name_ru: "Шоколадный торт",
    name_en: "Chocolate Cake",
    description_uz: "Yumshoq shokoladli tort",
    description_ru: "Нежный шоколадный торт",
    description_en: "Soft chocolate cake",
    price: 18000,
    image_url: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
    category_name_uz: "Desertlar",
    category_name_ru: "Десерты",
    category_name_en: "Desserts",
    rating: 4.6,
    reviews_count: 92,
    is_available: true
  }
]

export async function GET() {
  if (!hasDb) {
    return NextResponse.json({ menuItems: demoMenuItems })
  }

  try {
    const rows = await sql`
      SELECT 
        mi.*,
        c.name_uz as category_name_uz,
        c.name_ru as category_name_ru,
        c.name_en as category_name_en,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as reviews_count
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      LEFT JOIN reviews r ON mi.id = r.menu_item_id
      WHERE mi.is_available = true
      GROUP BY mi.id, c.name_uz, c.name_ru, c.name_en
      ORDER BY mi.category_id, mi.id
    `
    
    return NextResponse.json({ menuItems: rows })
  } catch (err) {
    console.error("DB error in /api/menu:", (err as Error).message)
    return NextResponse.json({ menuItems: demoMenuItems })
  }
}