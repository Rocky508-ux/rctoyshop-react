import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * 換頁時把畫面捲回頂部。
 * 不做的話，從列表頁捲到一半點進商品頁，新頁面會停在同樣的捲動位置。
 * 本身不顯示任何東西，只是掛在 App 裡做這件事。
 */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
