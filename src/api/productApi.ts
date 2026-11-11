import apiClient from './client'
import type { Product } from '../types/product'

/** GET /api/products — 取得所有商品 */
export const getProducts = async (): Promise<Product[]> => {
  const res = await apiClient.get<Product[]>('/products')
  return res.data
}

/** GET /api/products/{id} — 取得單一商品 */
export const getProduct = async (id: string): Promise<Product> => {
  const res = await apiClient.get<Product>(`/products/${id}`)
  return res.data
}
