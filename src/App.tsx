import { useCallback, useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import ScrollToTop from './components/ScrollToTop'
import RequireAuth from './components/RequireAuth'
import Header from './components/Header'
import Footer from './components/Footer'
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
import ShoppingCart from './views/ShoppingCart'
import Contact from './views/Contact'
import MemberCenter from './views/MemberCenter'
import UserManagement from './components/admin/UserManagement'
import AlertDemo from './views/AlertDemo' // ⚠️ 暫時的教學頁，看完就刪

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

  /** change 傳 +1 或 -1。數量最少 1，要歸零請用 handleRemoveFromCart */
  const handleUpdateQuantity = (productId: string, change: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    )
  }

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
    handleNotify('已從購物車移除')
  }

  const handleClearCart = () => {
    setCartItems([])
    handleNotify('已清空購物車')
  }

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
        <Route path="/contact" element={<Contact onNotify={handleNotify} />} />
        {/* ⚠️ 暫時的教學頁，看完就刪 */}
        <Route path="/alert-demo" element={<AlertDemo />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/service" element={<AfterSales />} />
        <Route path="/login" element={<Login onNotify={handleNotify} />} />
        <Route path="/register" element={<Register onNotify={handleNotify} />} />
        <Route
          path="/cart"
          element={
            <ShoppingCart
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveFromCart}
              onClear={handleClearCart}
            />
          }
        />
        <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />

        {/*
          舊專案的 /profile 已經不轉了 —— 它沒有任何連結指向它（只能手動打網址），
          內容也只有三行字，功能都在 /member-center。
        */}
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
              <MemberCenter onNotify={handleNotify} />
            </RequireAuth>
          }
        />
        {/*
          ⚠️ 暫時的：Admin 外殼（側邊選單 + 四個分頁）還沒轉，
          所以 /admin 先直接顯示用戶管理 —— Header 的「管理者後台」是連到這裡。
          之後轉完 Admin.tsx 要改回 <Admin />，UserManagement 變成它的一個分頁。
        */}
        <Route
          path="/admin"
          element={
            <RequireAuth requireAdmin>
              <Box sx={{ maxWidth: 1100, mx: 'auto', my: 6, px: 2 }}>
                <UserManagement onNotify={handleNotify} />
              </Box>
            </RequireAuth>
          }
        />
      </Routes>

      <Footer />
    </>
  )
}

export default App
