"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-provider"

interface AddToCartAlertProps {
  open: boolean
  onClose: () => void
}

export function AddToCartAlert({ open, onClose }: AddToCartAlertProps) {
  const { t } = useLanguage()

  useEffect(() => {
    if (open) {
      // Auto close after 2 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [open, onClose])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              {t.common.addedToCart || "Added to Cart!"}
            </DialogTitle>
            <p className="text-muted-foreground text-center mt-2">
              {t.common.itemAddedToCart || "Your item has been added to the cart successfully."}
            </p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
