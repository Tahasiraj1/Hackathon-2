import type { Image as SanityImage } from "@sanity/types"

export interface Variation {
  color: string
  size: string
  quantity: number
}

export interface Product {
  id: number
  name: string
  price: number
  categories: string[]
  images: SanityImage[]
  ratings: string
  tags: string[]
  description: string
  variations: Variation[]
}

