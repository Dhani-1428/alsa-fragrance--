import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Price formatting utility - always use Euro
export function formatPrice(price: number): string {
  return `€${price.toFixed(2)}`
}

export function formatPriceSimple(price: number): string {
  return `€${price}`
}
