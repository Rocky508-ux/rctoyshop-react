import { useEffect, useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { getProduct } from '../api/productApi'
import { getApiErrorMessage } from '../api/apiError'
import type { Product } from '../types/product'

interface ProductDetailProps {
  onAddToCart: (product: Product) => void
}

/** 每個商品頁下方都一樣的說明文字，放在元件外面避免每次渲染都重建 */
const POLICIES = [
  {
    title: '📦 購買須知',
    items: [
      '1. 預購商品發售日僅供參考，實際出貨時間以原廠／工作室為準，可能會有延期狀況。',
      '2. 圖片僅供參考，實際商品可能會有細微差異（塗裝、色差等），請以實物為準。',
      '3. GK 商品多為易碎材質，運送途中難免有風險，開箱請務必全程錄影以保障權益。',
    ],
  },
  {
    title: '🚚 運送說明',
    items: [
      '1. 現貨商品下單後約 1-3 個工作天內出貨。',
      '2. 大型 GK 商品體積較大，運費將依實際材積計算，可能需分箱寄送。',
    ],
  },
  {
    title: '🛡️ 售後服務',
    items: [
      '收到商品後若有嚴重缺件或斷裂，請於 7 日內聯繫客服並提供開箱影片，我們將協助向工作室申請補件或維修。',
    ],
  },
]

function ProductDetail({ onAddToCart }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  /** 目前顯示第幾張圖。點縮圖會改這個數字，主圖跟著換 */
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (!id) return

    const loadProduct = async () => {
      try {
        setLoading(true)
        setFetchError(null)
        const data = await getProduct(id)
        setProduct(data)
        setCurrentImageIndex(0) // 換商品時從第一張圖重新開始
      } catch (err) {
        setFetchError(getApiErrorMessage(err))
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

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

  if (!product) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          很抱歉，找不到該商品
        </Typography>
        <Link component={RouterLink} to="/">
          返回首頁
        </Link>
      </Box>
    )
  }

  // 把標記為主圖的排到最前面，這樣一進來顯示的就跟商品卡上那張一致
  const allImages = product.images ?? []
  const images = [
    ...allImages.filter((img) => img.isMain),
    ...allImages.filter((img) => !img.isMain),
  ]

  const currentImage = images[currentImageIndex] ?? null

  const specs = [
    { label: '比例', value: product.scale },
    { label: '尺寸', value: product.dimensions },
    { label: '材質', value: product.material },
    { label: '預計出貨', value: product.estimatedArrival },
  ].filter((spec) => spec.value)

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: 4 }}>
      <div className="grid gap-10 md:grid-cols-2">
        {/* 左：主圖 + 縮圖 */}
        <div>
          {currentImage ? (
            <Box
              component="img"
              src={currentImage.imagePath}
              alt={product.name}
              sx={{ width: '100%', borderRadius: 2 }}
            />
          ) : (
            <div className="flex h-80 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
              暫無圖片
            </div>
          )}

          {/* 只有一張圖的話不用給使用者選 */}
          {images.length > 1 && (
            <Stack direction="row" spacing={1} sx={{ mt: 2, overflowX: 'auto', pb: 1 }}>
              {images.map((img, index) => (
                <Box
                  key={img.id}
                  component="img"
                  src={img.imagePath}
                  alt={`${product.name} 縮圖 ${index + 1}`}
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    width: 80,
                    height: 80,
                    flexShrink: 0,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: index === currentImageIndex ? 'primary.main' : 'transparent',
                    opacity: index === currentImageIndex ? 1 : 0.6,
                  }}
                />
              ))}
            </Stack>
          )}
        </div>

        {/* 右：資訊 */}
        <Stack spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {product.name}
          </Typography>

          {product.studio && (
            <Typography color="text.secondary">{product.studio} 工作室</Typography>
          )}

          <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
            NT$ {product.price?.toLocaleString()}
          </Typography>

          {specs.length > 0 && (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1}>
                {specs.map((spec) => (
                  <Box key={spec.label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">{spec.label}</Typography>
                    <Typography>{spec.value}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          <Divider />

          <div>
            <Typography sx={{ mb: 1, fontWeight: 700 }}>【商品簡介】</Typography>
            <Typography color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
              {product.description}
            </Typography>
          </div>

          <Button
            variant="contained"
            size="large"
            onClick={() => onAddToCart(product)}
          >
            加入購物車
          </Button>
        </Stack>
      </div>

      {/* 所有商品共用的說明，不是從後端來的，是寫死的文案 */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {POLICIES.map((policy) => (
          <Paper key={policy.title} variant="outlined" sx={{ p: 2 }}>
            <Typography sx={{ mb: 1, fontWeight: 700 }}>{policy.title}</Typography>
            <Stack spacing={1}>
              {policy.items.map((item, index) => (
                <Typography key={index} variant="body2" color="text.secondary">
                  {item}
                </Typography>
              ))}
            </Stack>
          </Paper>
        ))}
      </div>

      <Box sx={{ mt: 6 }}>
        <Link component={RouterLink} to="/">
          ← 返回商品列表
        </Link>
      </Box>
    </Box>
  )
}

export default ProductDetail
