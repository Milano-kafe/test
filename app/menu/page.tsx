"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { MenuItemCard } from "@/components/menu-item-card"

interface MenuItem {
  id: number
  name_uz: string
  name_ru: string
  name_en: string
  description_uz: string
  description_ru: string
  description_en: string
  price: number
  image_url: string
  rating?: number
  reviews_count?: number
}

interface Category {
  id: number
  name_uz: string
  name_ru: string
  name_en: string
}

export default function MenuPage() {
  const { language, t } = useLanguage()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMenuData()
  }, [])

  const fetchMenuData = async () => {
    try {
      const [menuResponse, categoriesResponse] = await Promise.all([fetch("/api/menu"), fetch("/api/categories")])

      // --- Menu items ---
      let fetchedMenu: MenuItem[] = []
      if (menuResponse.ok) {
        const data = await menuResponse.json()
        fetchedMenu = data.menuItems || []
      } else {
        const txt = await menuResponse.text()
        console.error("Menu API error:", menuResponse.status, txt)
      }

      // --- Categories ---
      let fetchedCategories: Category[] = []
      if (categoriesResponse.ok) {
        const data = await categoriesResponse.json()
        fetchedCategories = data.categories || []
      } else {
        const txt = await categoriesResponse.text()
        console.error("Categories API error:", categoriesResponse.status, txt)
      }

      setMenuItems(fetchedMenu)
      setCategories(fetchedCategories)
    } catch (err) {
      console.error("Unexpected fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const getLocalizedText = (item: any, field: string) => {
    return item[`${field}_${language}`] || item[`${field}_uz`] || ""
  }

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === null || item.category_id === selectedCategory
    const matchesSearch = getLocalizedText(item, "name").toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t("loading")}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t("ourMenu")}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our delicious selection of carefully crafted dishes
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col space-y-4">
            {/* Search */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className={`text-sm ${selectedCategory === null ? "bg-orange-600 hover:bg-orange-700" : ""}`}
              >
                {t("all")}
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`text-sm ${selectedCategory === category.id ? "bg-orange-600 hover:bg-orange-700" : ""}`}
                >
                  {getLocalizedText(category, "name")}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t("noResults")}</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
