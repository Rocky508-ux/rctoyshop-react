import type { User } from './user'

/** 送給 POST /api/auth/login 的資料，對應後端 LoginRequest.java */
export interface LoginRequest {
  email: string
  password: string
}

/** POST /api/auth/login 成功時回傳的資料 */
export interface LoginResponse {
  token: string
  user: User
}

/**
 * 送給 POST /api/auth/register 的資料，對應後端 UserCreateRequest.java。
 * 沒有 role 和 status —— 那兩個由後端自己決定，前端送了也會被忽略。
 */
export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone: string
  birthday: string
}
