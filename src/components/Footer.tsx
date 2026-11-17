import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

const FOOTER_LINKS = [
  { to: '/about', label: '關於我們' },
  { to: '/contact', label: '聯絡我們' },
  { to: '/orders', label: '訂單查詢' },
  { to: '/service', label: '售後服務' },
  { to: '/privacy', label: '隱私權政策' },
]

function Footer() {
  return (
    <Box
      component="footer"
      sx={{ mt: 8, py: 4, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
    >
      <div className="mx-auto max-w-6xl px-4 text-center">
        <div className="mb-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm">
          {FOOTER_LINKS.map((item, index) => (
            // Fragment 要寫完整寫法才能放 key
            <Box key={item.to} sx={{ display: 'flex', gap: 1.5 }}>
              <Link component={RouterLink} to={item.to} color="text.secondary">
                {item.label}
              </Link>
              {/* 最後一個後面不加分隔線 */}
              {index < FOOTER_LINKS.length - 1 && (
                <span className="text-gray-300">|</span>
              )}
            </Box>
          ))}
        </div>

        <Typography variant="caption" color="text.secondary">
          地址: 10491臺北市中山區民生東路三段67號 ｜ 電話: 02 2502 4654 ｜ 營業時間: 週一至週日
          10:00-22:00
        </Typography>
      </div>
    </Box>
  )
}

export default Footer
