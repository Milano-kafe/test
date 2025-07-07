import { NextResponse } from "next/server"
import { sql, hasDb } from "@/lib/db"

// Demo reviews data
const demoReviews = [
  {
    id: 1,
    menu_item_id: 1,
    user_name: "Aziz Karimov",
    rating: 5,
    comment: "Juda mazali burger! Tavsiya qilaman",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    menu_item_id: 1,
    user_name: "Malika Tosheva",
    rating: 4,
    comment: "Yaxshi, lekin biroz qimmat",
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 3,
    menu_item_id: 3,
    user_name: "Bobur Aliyev",
    rating: 5,
    comment: "Eng yaxshi pitsa! Har doim buyurtma beraman",
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
]

// GET reviews for a menu item
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const menuItemId = searchParams.get('menuItemId')

  if (!menuItemId) {
    return NextResponse.json({ error: "Menu item ID is required" }, { status: 400 })
  }

  if (!hasDb) {
    const itemReviews = demoReviews.filter(r => r.menu_item_id === parseInt(menuItemId))
    return NextResponse.json({ reviews: itemReviews })
  }

  try {
    const reviews = await sql`
      SELECT r.*, u.name as user_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.menu_item_id = ${menuItemId}
      ORDER BY r.created_at DESC
    `
    
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ reviews: [] })
  }
}

// POST new review
export async function POST(request: Request) {
  try {
    const { menuItemId, userId, userName, rating, comment } = await request.json()

    if (!menuItemId || !rating) {
      return NextResponse.json({ error: "Menu item ID and rating are required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    if (!hasDb) {
      // Demo mode - just return success
      const newReview = {
        id: Date.now(),
        menu_item_id: menuItemId,
        user_name: userName || "Mehmon",
        rating,
        comment: comment || "",
        created_at: new Date().toISOString()
      }
      demoReviews.unshift(newReview)
      return NextResponse.json({ success: true, review: newReview })
    }

    const result = await sql`
      INSERT INTO reviews (menu_item_id, user_id, user_name, rating, comment)
      VALUES (${menuItemId}, ${userId}, ${userName || "Mehmon"}, ${rating}, ${comment || ""})
      RETURNING *
    `

    return NextResponse.json({ success: true, review: result[0] })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}