import { useCallback, useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import RequireAuth from './components/RequireAuth'
import Header from './components/Header'
import ToastNotification, { type Notification } from './components/ToastNotification'
import Placeholder from './views/Placeholder'
import ProductList from './views/ProductList'
import Login from './views/Login'
import type { Product } from './types/product'
import type { CartItem } from './types/cart'
import ProductDetail from './views/ProductDetail'
import PrivacyPolicy from './views/PrivacyPolicy'
import AfterSales from './views/AfterSales'
import About from './views/About'
import Register from './views/Register'

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // useCallback：讓這個函式每次渲染都是同一個，Login 的 useEffect 才不會重複觸發
  const handleNotify = useCallback((message: string) => {
    const id = Date.now()

    setNotifications((prev) => [...prev, { id, message }])

    // 3 秒後把這一筆移除，通知才會自己消失
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 3000)
  }, [])

  /* ─────────── 登入狀態 ─────────── */

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  // 每次換頁都重新看一次 localStorage。
  // 登入成功和登出都會跳頁，所以這樣就能讓 Header 的按鈕跟著更新。
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('userRole')

    setIsLoggedIn(!!token)
    setIsAdmin(!!token && role === 'ADMIN')
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')
    localStorage.removeItem('userId')

    setIsLoggedIn(false)
    setIsAdmin(false)

    navigate('/')
    handleNotify('已成功登出')
  }

  /* ─────────── 購物車 ─────────── */

  // 一開始從 localStorage 讀回上次的購物車。
  // useState 傳函式的話，這段只在第一次渲染執行，不會每次重新解析 JSON。
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cartItems')
    return saved ? JSON.parse(saved) : []
  })

  // 購物車一變就寫回 localStorage，重新整理才不會不見
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  /** 購物車總件數，例如 2 個商品各買 3 個 = 6 */
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)

      // 已經在購物車裡 → 數量 +1
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      // 還沒有 → 加一筆新的，數量 1
      return [...prev, { ...product, quantity: 1 }]
    })

    handleNotify(`已將 ${product.name} 加入購物車`)
  }

  // 改數量、移除、清空這三個函式，等 ShoppingCart 頁面轉過來時再加

  return (
    <>
      <ScrollToTop />
      <Header
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        cartCount={cartCount}
        onLogout={handleLogout}
      />
      <ToastNotification notifications={notifications} />

      <Routes>
        <Route path="/" element={<ProductList onAddToCart={handleAddToCart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Placeholder name="Contact" />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/service" element={<AfterSales />} />
        <Route path="/login" element={<Login onNotify={handleNotify} />} />
        <Route path="/register" element={<Register onNotify={handleNotify} />} />
        <Route path="/cart" element={<Placeholder name="ShoppingCart" />} />
        <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Placeholder name="Profile" />
            </RequireAuth>
          }
        />
        <Route
          path="/orders"
          element={
            <RequireAuth>
              <Placeholder name="Orders" />
            </RequireAuth>
          }
        />
        <Route
          path="/member-center"
          element={
            <RequireAuth>
              <Placeholder name="MemberCenter" />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth requireAdmin>
              <Placeholder name="Admin" />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  )
}

export default App
