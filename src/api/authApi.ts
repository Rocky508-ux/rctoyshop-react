import apiClient from './client'
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types/auth'
import type { User } from '../types/user'

/** POST /api/auth/login — 登入，成功回傳 token 和使用者資料 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const res = await apiClient.post<LoginResponse>('/auth/login', credentials)
  return res.data
}

/** POST /api/auth/register — 註冊，成功回傳建立好的使用者資料（不含 token，還要自己去登入） */
export const register = async (data: RegisterRequest): Promise<User> => {
  const res = await apiClient.post<User>('/auth/register', data)
  return res.data
}
