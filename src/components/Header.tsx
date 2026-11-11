import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import SearchBar from './SearchBar'

interface HeaderProps {
  isLoggedIn: boolean
  isAdmin: boolean
  /** 購物車總件數，0 的話不顯示括號 */
  cartCount: number
  onLogout: () => void
}

/** 導覽列的一個連結。active 時變色加底線 */
function NavItem({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <RouterLink
      to={to}
      className={
        active
          ? 'border-b-2 border-blue-600 pb-1 font-bold text-blue-600'
          : 'pb-1 text-gray-700 hover:text-blue-600'
      }
    >
      {label}
    </RouterLink>
  )
}

function Header({ isLoggedIn, isAdmin, cartCount, onLogout }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const path = location.pathname
  const tag = searchParams.get('tag')
  const category = searchParams.get('category')

  // 在首頁而且沒有任何篩選條件，才算「所有商品」
  const isAllProducts = path === '/' && !tag && !category

  return (
    <Box component="header" sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fff' }}>
      <div className="mx-auto max-w-6xl px-4 py-3">
        {/* 上排：標題 + 搜尋 + 登入狀態 */}
        <div className="flex flex-wrap items-center gap-4">
          <RouterLink to="/">
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              RC玩童
            </Typography>
          </RouterLink>

          <div className="min-w-60 flex-1">
            <SearchBar onSearch={(query) => navigate(`/?search=${encodeURIComponent(query)}`)} />
          </div>

          <div className="flex items-center gap-2">
            <Button component={RouterLink} to="/cart" variant="outlined" size="small">
              🛒 購物車{cartCount > 0 && ` (${cartCount})`}
            </Button>

            {isLoggedIn ? (
              <Button variant="outlined" size="small" color="inherit" onClick={onLogout}>
                登出
              </Button>
            ) : (
              <>
                <Button component={RouterLink} to="/login" variant="contained" size="small">
                  登入
                </Button>
                <Button component={RouterLink} to="/register" variant="outlined" size="small">
                  註冊
                </Button>
              </>
            )}
          </div>
        </div>

        {/* 下排：分類導覽 */}
        <nav className="mt-3 flex flex-wrap gap-5 text-sm">
          <NavItem to="/" label="所有商品" active={isAllProducts} />
          <NavItem to="/?tag=預購" label="預購商品" active={tag === '預購'} />
          <NavItem to="/?tag=現貨" label="現貨商品" active={tag === '現貨'} />
          <NavItem to="/?category=hot_sales" label="熱銷商品" active={category === 'hot_sales'} />
          <NavItem to="/contact" label="聯絡我們" active={path === '/contact'} />

          {isLoggedIn && (
            <NavItem to="/member-center" label="會員中心" active={path === '/member-center'} />
          )}
          {isAdmin && (
            <NavItem to="/admin" label="管理者後台" active={path.startsWith('/admin')} />
          )}
        </nav>
      </div>
    </Box>
  )
}

export default Header
