import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface RequireAuthProps {
  /** 要保護的頁面。檢查通過才會顯示出來 */
  children: ReactNode
  /** true = 還要再檢查是不是 ADMIN */
  requireAdmin?: boolean
}

/**
 * 包在需要登入的頁面外面，檢查 localStorage 有沒有 token。
 * 沒通過就用 <Navigate> 導到登入頁，並在網址帶上原因，Login 會把它跳成通知。
 */
function RequireAuth({ children, requireAdmin = false }: RequireAuthProps) {
  const token = localStorage.getItem('authToken')
  const role = localStorage.getItem('userRole')

  if (requireAdmin) {
    if (!token) {
      return <Navigate to={`/login?msg=${encodeURIComponent('請先登入！')}`} replace />
    }
    if (role !== 'ADMIN') {
      return <Navigate to={`/?msg=${encodeURIComponent('權限不足，您無法進入後台！')}`} replace />
    }
  } else if (!token) {
    return (
      <Navigate
        to={`/login?msg=${encodeURIComponent('請先登入會員才能查看此頁面！')}`}
        replace
      />
    )
  }

  return <>{children}</>
}

export default RequireAuth
