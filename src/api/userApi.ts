import apiClient from './client'
import type { User, UserUpdateRequest } from '../types/user'

/** GET /api/users/{id} — 取得某個使用者的資料 */
export const getUserProfile = async (id: string): Promise<User> => {
  const res = await apiClient.get<User>(`/users/${id}`)
  return res.data
}

/**
 * PUT /api/users/{id} — 更新使用者資料。
 *
 * 後端只會動你有帶的欄位，所以改密碼時傳 { password: '...' } 就好，
 * 不用把姓名 email 一起送過去。
 */
export const updateUserProfile = async (
  id: string,
  data: UserUpdateRequest,
): Promise<User> => {
  const res = await apiClient.put<User>(`/users/${id}`, data)
  return res.data
}
