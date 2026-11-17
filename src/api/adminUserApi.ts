import apiClient from './client'
import type { AdminUserUpdateRequest, User } from '../types/user'

/**
 * 後台「用戶管理」專用的 API。
 *
 * 跟 userApi.ts 分開是因為後端也是分開的：
 *   userApi      → /api/users        （UserController，使用者改自己的資料）
 *   adminUserApi → /api/admin/users  （AdminUserController，管理員管別人）
 */

/** GET /api/admin/users — 取得所有使用者 */
export const getAllUsers = async (): Promise<User[]> => {
  const res = await apiClient.get<User[]>('/admin/users')
  return res.data
}

/**
 * PUT /api/admin/users/{id} — 更新一個使用者，回傳更新後的那一筆。
 *
 * data 只要帶有改到的欄位就好，例如停用帳號是 { status: 'DISABLED' }。
 */
export const updateUser = async (
  id: number,
  data: AdminUserUpdateRequest,
): Promise<User> => {
  const res = await apiClient.put<User>(`/admin/users/${id}`, data)
  return res.data
}

/**
 * DELETE /api/admin/users/{id} — 刪除一個使用者。
 *
 * 後端回 204 No Content，沒有 body 可以拿，所以回傳型別是 Promise<void>：
 * 「等它做完，但沒有東西給你」。
 */
export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/users/${id}`)
}
