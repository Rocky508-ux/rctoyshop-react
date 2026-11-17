/** 對應後端 UserResponse.java。刻意沒有 password —— 後端不會回傳 */
export interface User {
  id: number
  email: string
  name: string
  phone: string
  birthday: string
  role: string
  status: string
  createdAt: string
}

/**
 * 對應後端 UserUpdateRequest.java —— 一般使用者更新自己的資料。
 *
 * 每個欄位都是選填（`?`），因為後端是「null 代表這次不改這一項」。
 * 所以改密碼時只要送 { password }，其他欄位不帶就不會被動到。
 *
 * 沒有 role / status —— 使用者不能改自己的權限和帳號狀態。
 */
export interface UserUpdateRequest {
  email?: string
  name?: string
  phone?: string
  birthday?: string
  password?: string
}

/**
 * 對應後端 AdminUserUpdateRequest.java —— 管理員更新別人的資料。
 *
 * 後端是 `extends UserUpdateRequest` 多一個 status，
 * TS 的 interface 也可以 extends，意思一樣：把上面那包欄位全部繼承過來，再加 status。
 *
 * status 一樣是選填，所以停用帳號時只要送 { status: 'DISABLED' }，
 * 沒帶的欄位後端收到 null，就不會動到。
 */
export interface AdminUserUpdateRequest extends UserUpdateRequest {
  status?: string
}
