"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Flag } from "lucide-react"
import { reportsService } from "@/lib/reports"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"

interface ReportDialogProps {
  targetId: string
  targetType: "user" | "listing"
  targetName: string
}

export function ReportDialog({ targetId, targetType, targetName }: ReportDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const reasons =
    targetType === "user"
      ? ["Inappropriate behavior", "Fake profile", "Harassment", "Spam", "Other"]
      : ["Misleading information", "Inappropriate content", "Scam/Fraud", "Duplicate listing", "Other"]

  const handleSubmit = () => {
    if (!user || !reason) return

    setSubmitting(true)
    try {
      reportsService.submitReport(user.id, user.name, targetId, targetType, targetName, reason, description)

      toast({
        title: "Report submitted",
        description: "Thank you for helping keep UniMate safe. We'll review this report shortly.",
      })

      setOpen(false)
      setReason("")
      setDescription("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Flag className="h-4 w-4 mr-2" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report {targetType === "user" ? "User" : "Listing"}</DialogTitle>
          <DialogDescription>
            Help us keep UniMate safe by reporting inappropriate content or behavior.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Reason for report</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {reasons.map((r) => (
                <div key={r} className="flex items-center space-x-2">
                  <RadioGroupItem value={r} id={r} />
                  <Label htmlFor={r} className="font-normal cursor-pointer">
                    {r}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional details (optional)</Label>
            <Textarea
              id="description"
              placeholder="Provide any additional information that might help us review this report..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!reason || submitting}>
            {submitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
