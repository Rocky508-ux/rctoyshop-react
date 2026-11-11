import type { Product } from './product'

/**
 * 購物車裡的一筆。
 * 後端沒有對應的 DTO —— 購物車只存在前端，直到結帳才會送出去。
 * extends Product 代表它有 Product 的全部欄位，再多一個 quantity。
 */
export interface CartItem extends Product {
  quantity: number
}
