import { useState } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

/** 三個特色區塊，結構一樣所以存成資料再 map */
const VALUES = [
  {
    title: '💯 正品保證',
    text: '全館商品皆為官方授權或正規代理，絕無盜版。',
  },
  {
    title: '📦 專業包裝',
    text: '我們深知收藏品的重要性，使用加厚紙箱與氣泡防護，確保長途運輸安全。',
  },
  {
    title: '💬 售後服務',
    text: '提供完善的退換貨機制與線上客服，讓您買得放心。',
  },
]

function About() {
  /** 圖片載入失敗時改成 true，畫面換成替代區塊 */
  const [imageError, setImageError] = useState(false)

  return (
    <Paper sx={{ maxWidth: 1000, mx: 'auto', my: 5, p: 5 }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
        關於我們 (About Us)
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* 左圖右文 */}
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          {imageError ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-gray-100">
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                RC玩童
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ mt: 1 }}>
                (請上傳 about.jpg 至圖片資料夾)
              </Typography>
            </div>
          ) : (
            <Box
              component="img"
              src="/image/about.jpg"
              alt="About RC Toy Shop"
              onError={() => setImageError(true)}
              sx={{ width: '100%', borderRadius: 2 }}
            />
          )}
        </div>

        <div>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            歡迎來到 RC玩童
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
            我們是一群熱愛 GK 模型與收藏玩偶的愛好者。成立於 2024 年，
            致力於為台灣的收藏家提供最優質、最安心的購買平台。
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
            無論是熱門的鋼彈模型、精緻的動漫公仔，還是稀有的 GK 雕像，
            我們都嚴格把關，確保您收到的每一件商品都是正品。
          </Typography>
        </div>
      </div>

      <Divider sx={{ my: 5 }} />

      {/* 三個特色 */}
      <div className="grid gap-4 md:grid-cols-3">
        {VALUES.map((value) => (
          <Paper key={value.title} variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              {value.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {value.text}
            </Typography>
          </Paper>
        ))}
      </div>
    </Paper>
  )
}

export default About
