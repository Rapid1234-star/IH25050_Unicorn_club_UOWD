import { Star } from "lucide-react"

interface RatingDisplayProps {
  rating: number
  count?: number
  showCount?: boolean
  size?: "sm" | "md" | "lg"
}

export function RatingDisplay({ rating, count = 0, showCount = true, size = "md" }: RatingDisplayProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  return (
    <div className="flex items-center gap-1">
      <Star className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />
      <span className={`font-semibold ${textSizeClasses[size]}`}>{rating.toFixed(1)}</span>
      {showCount && count > 0 && <span className={`text-muted-foreground ${textSizeClasses[size]}`}>({count})</span>}
    </div>
  )
}
