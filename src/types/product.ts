/** 對應後端 ProductImage.java */
export interface ProductImage {
  id: number
  imagePath: string
  isMain: boolean
}

/** 對應後端 Product.java */
export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  status: string

  studio: string
  estimatedArrival: string

  scale: string
  dimensions: string
  material: string

  categoryId: string
  tag: string
  type: string

  createdAt: string
  updatedAt: string

  images: ProductImage[]
}
