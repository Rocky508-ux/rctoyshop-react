import { useNavigate } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import type { Product } from '../types/product'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const navigate = useNavigate()

  // 優先用 isMain 的圖，沒有就用第一張，都沒有就 null
  const mainImage =
    product.images?.find((img) => img.isMain)?.imagePath ??
    product.images?.[0]?.imagePath ??
    null

  return (
    <Card sx={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {product.tag && (
        <Chip
          label={product.tag === 'new' ? 'NEW' : product.tag}
          color="error"
          size="small"
          sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
        />
      )}

      <CardActionArea onClick={() => navigate(`/product/${product.id}`)}>
        {mainImage ? (
          <CardMedia
            component="img"
            height="180"
            image={mainImage}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="flex h-[180px] items-center justify-center bg-gray-100 text-sm text-gray-400">
            Image Not Available
          </div>
        )}

        <CardContent>
          <Typography variant="subtitle1" noWrap title={product.name}>
            {product.name}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ mt: 'auto', justifyContent: 'space-between' }}>
        <Typography variant="h6" color="primary">
          NT$ {product.price?.toLocaleString()}
        </Typography>
        <Button size="small" variant="contained" onClick={() => onAddToCart(product)}>
          加入購物車
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProductCard
