"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Plus, MessageCircle, User } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"

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

interface Review {
  id: number
  user_name: string
  rating: number
  comment: string
  created_at: string
}

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { language, t } = useLanguage()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [showReviews, setShowReviews] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewsLoaded, setReviewsLoaded] = useState(false)

  const getLocalizedText = (field: string) => {
    return item[`${field}_${language}` as keyof MenuItem] as string || item[`${field}_uz` as keyof MenuItem] as string || ""
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  const loadReviews = async () => {
    if (reviewsLoaded) return
    
    try {
      const response = await fetch(`/api/reviews?menuItemId=${item.id}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
        setReviewsLoaded(true)
      }
    } catch (error) {
      console.error("Error loading reviews:", error)
    }
  }

  const handleShowReviews = () => {
    setShowReviews(true)
    loadReviews()
  }

  const handleSubmitReview = async () => {
    if (!newComment.trim()) {
      toast({
        title: t("error"),
        description: "Iltimos, sharh yozing",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          menuItemId: item.id,
          userId: user?.id,
          userName: user?.name || "Mehmon",
          rating: newRating,
          comment: newComment
        })
      })

      if (response.ok) {
        toast({
          title: t("success"),
          description: "Sharhingiz qo'shildi!"
        })
        setNewComment("")
        setNewRating(5)
        // Reload reviews
        setReviewsLoaded(false)
        loadReviews()
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: "Sharh qo'shishda xatolik",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={item.image_url || "/placeholder.svg?height=200&width=300"}
              alt={getLocalizedText("name")}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {item.rating && (
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">{item.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="mb-3">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{getLocalizedText("name")}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{getLocalizedText("description")}</p>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {renderStars(item.rating || 0)}
                <span className="text-sm text-gray-600">
                  ({item.reviews_count || 0} {t("reviews")})
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShowReviews}
                className="text-blue-600 hover:text-blue-700 p-1"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-orange-600">{formatPrice(item.price)}</div>
              <Button
                size="sm"
                onClick={() =>
                  addToCart({
                    id: item.id,
                    name: getLocalizedText("name"),
                    price: item.price,
                    image_url: item.image_url,
                  })
                }
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-full px-3 py-1 transition-all duration-300 hover:shadow-lg"
              >
                <Plus className="w-4 h-4 mr-1" />
                {t("addToCart")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Dialog */}
      <Dialog open={showReviews} onOpenChange={setShowReviews}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>{getLocalizedText("name")} - Sharhlar</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Add Review Section */}
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-3">Sharh qoldiring</h3>
              <div className="space-y-3">
                <div>
                  <Label>Baho</Label>
                  <div className="mt-1">
                    {renderStars(newRating, true, setNewRating)}
                  </div>
                </div>
                <div>
                  <Label htmlFor="comment">Sharh</Label>
                  <Textarea
                    id="comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Bu taom haqida fikringizni yozing..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || !newComment.trim()}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isSubmitting ? "Yuborilmoqda..." : "Sharh qoldirish"}
                </Button>
              </div>
            </div>

            {/* Reviews List */}
            <div>
              <h3 className="font-semibold mb-3">
                Sharhlar ({reviews.length})
              </h3>
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Hali sharhlar yo'q. Birinchi bo'lib sharh qoldiring!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{review.user_name}</p>
                            <div className="flex items-center space-x-2">
                              {renderStars(review.rating)}
                              <span className="text-xs text-gray-500">
                                {new Date(review.created_at).toLocaleDateString("uz-UZ")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}