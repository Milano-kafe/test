// lib/db.ts
import { neon } from "@neondatabase/serverless"

// Ma'lumotlar bazasiga ulanish
export const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null
export const hasDb = !!process.env.DATABASE_URL

// Database connection test
export async function testConnection() {
  if (!hasDb || !sql) {
    console.log("⚠️ No database configured, using demo mode")
    return false
  }
  
  try {
    await sql`SELECT 1 as test`
    console.log("✅ Database connection successful")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}
