import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import { getProducts } from '../api/productApi'
import { getApiErrorMessage } from '../api/apiError'
import ProductCard from '../components/ProductCard'
import type { Product } from '../types/product'

interface ProductListProps {
  onAddToCart: (product: Product) => void
}

function ProductList({ onAddToCart }: ProductListProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // 這一頁第一次顯示時打一次 API 拿全部商品。
  // 依賴陣列是 []，所以之後重新渲染不會再打。
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setFetchError(null)
        const data = await getProducts()
        setAllProducts(data)
      } catch (err) {
        setFetchError(getApiErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // 從網址讀篩選條件。例如 /?search=巨人&tag=HOT
  // 沒帶的參數會是 null，對應的 if 就不會進去。
  const search = (searchParams.get('search') ?? '').toLowerCase()
  const tag = searchParams.get('tag')
  const category = searchParams.get('category')

  // 從全部商品開始，有帶哪個條件就篩哪一層
  let filteredProducts = allProducts

  if (search) {
    filteredProducts = filteredProducts.filter((p) =>
      (p.name ?? '').toLowerCase().includes(search),
    )
  }
  if (tag) {
    filteredProducts = filteredProducts.filter((p) => p.tag === tag)
  }
  // 「熱銷」是特例：舊資料的標記不統一，三種寫法都要比對
  if (category === 'hot_sales') {
    filteredProducts = filteredProducts.filter(
      (p) => p.type === 'hot' || p.tag === 'hot' || p.tag === '熱銷',
    )
  } else if (category) {
    filteredProducts = filteredProducts.filter((p) => p.categoryId === category)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (fetchError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{fetchError}</Alert>
      </Box>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          找不到符合「{searchParams.get('search')}」的商品
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          試試看調整關鍵字，或是瀏覽所有商品。
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          清除搜尋條件
        </Button>
      </Box>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}

export default ProductList
