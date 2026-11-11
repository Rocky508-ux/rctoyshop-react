import { Link as RouterLink } from 'react-router-dom'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

/** 每一節的標題（圖示 + 文字），樣式都一樣所以抽成小元件 */
function SectionHeading({ icon, text }: { icon: string; text: string }) {
  return (
    <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600, color: 'primary.main' }}>
      <span className="mr-2">{icon}</span>
      {text}
    </Typography>
  )
}

function AfterSales() {
  return (
    <Paper sx={{ maxWidth: 900, mx: 'auto', my: 5, p: 5 }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
        售後服務 (After Sales Service)
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Stack spacing={4}>
        <div>
          <SectionHeading icon="📦" text="退換貨說明" />
          <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
            我們提供 <strong>7 天鑑賞期</strong>（非試用期）。
            若您收到的商品有瑕疵、破損或與訂單不符，請於收到商品後 7 天內聯繫客服進行退換貨。
          </Typography>
          <ul className="mt-2 ml-6 list-disc text-gray-600">
            <li className="mb-2">商品必須保持全新未拆封（含原始包裝、配件、贈品）。</li>
            <li className="mb-2">若為盲盒／扭蛋類商品，一經拆封恕不接受退換。</li>
            <li className="mb-2">
              運送過程造成的盒損（八角魔人請三思）若未影響內容物，通常不列入瑕疵範圍。
            </li>
          </ul>
        </div>

        <div>
          <SectionHeading icon="🔧" text="維修與保固" />
          <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
            針對高單價之 GK 雕像或電子類玩具，我們提供以下服務：
          </Typography>
          <ul className="mt-2 ml-6 list-disc text-gray-600">
            <li className="mb-2">
              <strong>GK 運損修復</strong>
              ：若不幸發生運送斷件，我們會協助聯繫專業修復師進行評估與修復（費用視情況由物流保險或買家負擔）。
            </li>
            <li className="mb-2">
              <strong>缺件補寄</strong>：若開封後發現缺件，請提供開箱錄影，我們將向原廠申請補件。
            </li>
          </ul>
        </div>

        <div>
          <SectionHeading icon="🚚" text="配送進度查詢" />
          <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
            您可以隨時至「
            <Link component={RouterLink} to="/orders">
              訂單查詢
            </Link>
            」頁面查看您的包裹狀態。若訂單顯示「已出貨」超過 7 天仍未收到，請立即聯繫我們。
          </Typography>
        </div>
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Stack spacing={1} sx={{ alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          還有其他問題嗎？
        </Typography>
        <Typography color="text.secondary">
          找不到您需要的答案？請直接聯繫我們的客服團隊。
        </Typography>
        <Button component={RouterLink} to="/contact" variant="contained" sx={{ mt: 1 }}>
          聯繫客服
        </Button>
      </Stack>
    </Paper>
  )
}

export default AfterSales
