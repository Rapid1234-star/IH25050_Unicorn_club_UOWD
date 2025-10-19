import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface VerifiedBadgeProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function VerifiedBadge({ className, size = "md" }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <CheckCircle
      className={cn("text-green-600 fill-green-100 dark:fill-green-900", sizeClasses[size], className)}
      aria-label="Verified user"
    />
  )
}
