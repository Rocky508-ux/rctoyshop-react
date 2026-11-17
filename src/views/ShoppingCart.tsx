import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import type { CartItem } from '../types/cart'

interface ShoppingCartProps {
  cartItems: CartItem[]
  /** change 傳 +1 或 -1 */
  onUpdateQuantity: (productId: string, change: number) => void
  onRemove: (productId: string) => void
  onClear: () => void
}

/** 取主圖，沒有主圖就取第一張，都沒有回 null */
function getItemImage(item: CartItem): string | null {
  return (
    item.images?.find((img) => img.isMain)?.imagePath ??
    item.images?.[0]?.imagePath ??
    null
  )
}

function ShoppingCart({ cartItems, onUpdateQuantity, onRemove, onClear }: ShoppingCartProps) {
  /** 清空購物車的確認視窗要不要顯示 */
  const [clearDialogOpen, setClearDialogOpen] = useState(false)

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const handleConfirmClear = () => {
    onClear()
    setClearDialogOpen(false)
  }

  if (cartItems.length === 0) {
    return (
      <Box sx={{ maxWidth: 1100, mx: 'auto', p: 4, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          我的購物車
        </Typography>

        <div className="text-6xl">🛒</div>
        <Typography color="text.secondary" sx={{ my: 2 }}>
          您的購物車是空的
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">
          去逛逛
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: 4 }}>
      <div className="mb-4 flex items-center justify-between">
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          我的購物車
        </Typography>
        <Button color="error" onClick={() => setClearDialogOpen(true)}>
          🗑️ 清空購物車
        </Button>
      </div>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>商品資訊</TableCell>
              <TableCell>規格</TableCell>
              <TableCell align="center">數量</TableCell>
              <TableCell align="right">單價</TableCell>
              <TableCell align="right">小計</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {cartItems.map((item) => {
              const image = getItemImage(item)

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {image ? (
                        <Box
                          component="img"
                          src={image}
                          alt={item.name}
                          sx={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 1 }}
                        />
                      ) : (
                        <div className="h-16 w-16 rounded bg-gray-100" />
                      )}
                      <Typography variant="body2">{item.name}</Typography>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Chip label={item.tag || '標準'} size="small" />
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        // 數量 1 的時候不能再減，要移除請按右邊的 ✕
                        disabled={item.quantity <= 1}
                        onClick={() => onUpdateQuantity(item.id, -1)}
                      >
                        −
                      </Button>
                      <Typography sx={{ minWidth: 24, alignSelf: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                      >
                        ＋
                      </Button>
                    </Stack>
                  </TableCell>

                  <TableCell align="right">NT$ {item.price?.toLocaleString()}</TableCell>

                  <TableCell align="right">
                    <Typography color="primary" sx={{ fontWeight: 700 }}>
                      NT$ {(item.price * item.quantity).toLocaleString()}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <IconButton color="error" onClick={() => onRemove(item.id)} title="移除">
                      ✕
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <Button component={RouterLink} to="/">
          ← 繼續購物
        </Button>

        <Paper variant="outlined" sx={{ p: 2, minWidth: 260 }}>
          <Typography color="text.secondary">共 {totalItems} 件商品</Typography>
          <div className="mt-1 flex items-baseline justify-between">
            <Typography>總金額</Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
              NT$ {totalPrice.toLocaleString()}
            </Typography>
          </div>
        </Paper>
      </div>

      {/* 清空購物車的確認視窗 */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>確定要清空購物車嗎？</DialogTitle>
        <DialogContent>
          <DialogContentText>此動作無法復原，所有商品將被移除。</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>取消</Button>
          <Button color="error" variant="contained" onClick={handleConfirmClear}>
            確定清空
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ShoppingCart
