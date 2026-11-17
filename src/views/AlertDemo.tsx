import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

/**
 * ⚠️ 暫時的教學頁，看完就刪。
 * 把 MUI Alert 的四種 severity × 三種 variant 一次畫出來。
 */
function AlertDemo() {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 5, px: 2 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        MUI Alert 長這樣
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        1. 四種 severity（預設樣式）
      </Typography>
      <Stack spacing={2} sx={{ mb: 5 }}>
        <Alert severity="success">severity="success" — 成功，綠色</Alert>
        <Alert severity="info">severity="info" — 提示，藍色</Alert>
        <Alert severity="warning">severity="warning" — 警告，黃色</Alert>
        <Alert severity="error">severity="error" — 錯誤，紅色</Alert>
      </Stack>

      <Typography variant="h6" sx={{ mb: 2 }}>
        2. 三種 variant（以 error 為例）
      </Typography>
      <Stack spacing={2} sx={{ mb: 5 }}>
        <Alert severity="error">沒寫 variant — 淡紅底（頁面裡的錯誤用這個）</Alert>
        <Alert severity="error" variant="filled">
          variant="filled" — 整塊填滿（右上角通知用這個）
        </Alert>
        <Alert severity="error" variant="outlined">
          variant="outlined" — 只有框線
        </Alert>
      </Stack>

      <Typography variant="h6" sx={{ mb: 2 }}>
        3. 你專案裡實際在用的兩個
      </Typography>
      <Stack spacing={2} sx={{ mb: 5 }}>
        <Alert severity="success" variant="filled">
          已將 遙控車A 加入購物車 ← ToastNotification.tsx:50
        </Alert>
        <Alert severity="error">
          無法連接到後端 API: Status 500。請確認後端服務是否正常。 ← ProductList.tsx:81
        </Alert>
      </Stack>

      <Typography variant="h6" sx={{ mb: 2 }}>
        4. 加標題（AlertTitle）
      </Typography>
      <Alert severity="warning">
        <AlertTitle>庫存不足</AlertTitle>
        這項商品目前只剩 2 件，已自動調整您的購買數量。
      </Alert>
    </Box>
  )
}

export default AlertDemo
