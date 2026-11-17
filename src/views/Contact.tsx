import { useState, type FormEvent } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

/** 左半邊的客服資訊，四項的結構完全一樣，所以用資料 + map 畫 */
const INFO_ITEMS = [
  { icon: '📍', label: '地址', value: '10491臺北市中山區民生東路三段67號' },
  { icon: '📞', label: '電話', value: '02 2502 4654' },
  { icon: '📧', label: 'Email', value: 'service@rctoyshop.com' },
  { icon: '🕒', label: '營業時間', value: '週一至週日 10:00 - 22:00' },
]

/** 三顆社群按鈕。href 舊專案就是 #，還沒有真的連結 */
const SOCIAL_LINKS = [
  { name: 'Facebook', href: '#', color: '#1877f2' },
  { name: 'Instagram', href: '#', color: '#e4405f' },
  { name: 'LINE', href: '#', color: '#00c300' },
]

/** 主旨下拉選單的四個選項 */
const SUBJECTS = ['訂單問題', '商品諮詢', '售後服務', '其他']

interface ContactProps {
  /** 呼叫它會讓右上角跳一則通知。實作在 App.tsx */
  onNotify: (message: string) => void
}

/**
 * 聯絡我們。
 * 左半邊是靜態的客服資訊，右半邊是留言表單。
 *
 * 表單目前不會真的送出去 —— 舊專案也只是跳個 alert，後端沒有對應的 API。
 */
function Contact({ onNotify }: ContactProps) {
  // 一個欄位一個 state，跟 Register.tsx 的做法一致
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('訂單問題')
  const [message, setMessage] = useState('')

  /** 把四個欄位設回初始值。送出成功後和按「清空重填」都會用到，所以抽出來 */
  const resetForm = () => {
    setName('')
    setEmail('')
    setSubject('訂單問題')
    setMessage('')
  }

  const handleSubmit = (e: FormEvent) => {
    // 瀏覽器預設會在表單送出時重新載入整頁，那樣 React 的狀態會全部清空，所以要擋掉
    e.preventDefault()

    onNotify(`感謝您的聯繫，${name}！我們會盡快回覆您。`)
    resetForm()
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', my: 5, px: 2 }}>
      <Paper variant="outlined" sx={{ p: 5 }}>
        <Typography variant="h4" align="center" sx={{ mb: 5, fontWeight: 700 }}>
          聯絡我們 (Contact Us)
        </Typography>

        {/* 兩欄：左邊資訊、右邊表單。螢幕窄的時候（xs）改成上下排 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1.5fr' },
            gap: 6,
          }}
        >
          {/* ───────── 左欄：客服資訊 ───────── */}
          <Box>
            <Typography
              variant="h6"
              color="primary"
              sx={{
                mb: 3,
                pb: 1,
                fontWeight: 600,
                borderBottom: '2px solid',
                borderColor: 'grey.200',
              }}
            >
              客服資訊
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 4 }}>
              有任何問題嗎？歡迎隨時與我們聯繫！
            </Typography>

            <Stack spacing={3}>
              {INFO_ITEMS.map((item) => (
                // 四項結構一樣，差別只有 icon / label / value
                <Stack key={item.label} direction="row" spacing={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      borderRadius: '50%',
                      bgcolor: 'primary.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      {item.label}
                    </Typography>
                    <Typography color="text.secondary">{item.value}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mt: 4 }}>
              {SOCIAL_LINKS.map((link) => (
                // component="a" 讓 MUI 的 Button 實際渲染成 <a>，才能連出去
                <Button
                  key={link.name}
                  component="a"
                  href={link.href}
                  variant="contained"
                  sx={{
                    flex: 1,
                    fontWeight: 700,
                    bgcolor: link.color,
                    '&:hover': { bgcolor: link.color, opacity: 0.9 },
                  }}
                >
                  {link.name}
                </Button>
              ))}
            </Stack>
          </Box>

          {/* ───────── 右欄：留言表單 ───────── */}
          <Box>
            <Typography
              variant="h6"
              color="primary"
              sx={{
                mb: 3,
                pb: 1,
                fontWeight: 600,
                borderBottom: '2px solid',
                borderColor: 'grey.200',
              }}
            >
              留言給我們
            </Typography>

            {/* 包成 <form> 才能用 required 的瀏覽器驗證，以及按 Enter 送出 */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="姓名"
                  placeholder="請輸入您的姓名"
                  required
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <TextField
                  label="Email"
                  type="email"
                  placeholder="請輸入您的 Email"
                  required
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* select 讓 TextField 變成下拉選單，選項用 MenuItem 一個個列出來 */}
                <TextField
                  label="主旨"
                  select
                  fullWidth
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  {SUBJECTS.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="訊息內容"
                  placeholder="請詳述您的問題..."
                  required
                  fullWidth
                  multiline
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <Stack direction="row" spacing={2}>
                  {/*
                    type="button" 一定要寫。form 裡面的 <button> 預設就是 submit，
                    不寫的話按「清空重填」會連帶把表單送出去。
                    這顆不走 form 的 onSubmit，所以要自己綁 onClick。
                  */}
                  <Button
                    type="button"
                    variant="outlined"
                    size="large"
                    onClick={resetForm}
                    sx={{ flexShrink: 0 }}
                  >
                    清空重填
                  </Button>

                  {/* type="submit" 才會觸發 form 的 onSubmit */}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ flex: 1, fontWeight: 700 }}
                  >
                    送出訊息
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default Contact
