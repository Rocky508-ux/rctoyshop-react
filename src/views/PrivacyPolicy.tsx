import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

/**
 * 每一節的內容。
 * paragraphs 是段落文字，list 是項目清單（沒有的話就不顯示）。
 */
const SECTIONS = [
  {
    heading: '1. 資料收集',
    paragraphs: [
      '當您註冊成為 RC玩童（以下簡稱本站）會員時，我們會收集您的姓名、電子郵件地址、手機號碼等個人資料。這些資料僅用於訂單處理、會員服務及重要通知，絕不會用於非法販售或外洩給無關之第三方。',
    ],
  },
  {
    heading: '2. 資料使用',
    paragraphs: ['我們會將收集到的資料用於以下用途：'],
    list: [
      '處理您的訂單與配送商品。',
      '寄送訂單狀態更新通知。',
      '提供客戶支援服務。',
      '改善我們的網站介面與服務品質。',
    ],
  },
  {
    heading: '3. Cookie 技術',
    paragraphs: [
      '本站使用 Cookie 技術來改善您的瀏覽體驗，例如記住您的登入狀態與購物車內容。您可以透過瀏覽器設定拒絕 Cookie，但這可能會導致部分功能無法正常使用。',
    ],
  },
  {
    heading: '4. 資料安全',
    paragraphs: [
      '我們採取適當的安全措施來保護您的個人資料，防止未經授權的存取、修改或洩漏。但請注意，網際網路傳輸並非 100% 安全，請妥善保管您的帳號密碼。',
    ],
  },
  {
    heading: '5. 政策修訂',
    paragraphs: [
      '本站保有隨時修訂本隱私權政策之權利，修訂後的條款將公佈於本站上，不另行個別通知。',
    ],
  },
]

function PrivacyPolicy() {
  return (
    <Paper sx={{ maxWidth: 900, mx: 'auto', my: 5, p: 5 }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
        隱私權政策 (Privacy Policy)
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Stack spacing={4}>
        {SECTIONS.map((section) => (
          <div key={section.heading}>
            <Typography variant="h6" color="primary" sx={{ mb: 1.5, fontWeight: 600 }}>
              {section.heading}
            </Typography>

            {section.paragraphs.map((text, index) => (
              <Typography key={index} color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {text}
              </Typography>
            ))}

            {section.list && (
              <ul className="mt-2 ml-6 list-disc">
                {section.list.map((item, index) => (
                  <li key={index} className="mb-2 leading-relaxed text-gray-600">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </Stack>
    </Paper>
  )
}

export default PrivacyPolicy
