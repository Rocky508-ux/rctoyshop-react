import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { register } from '../api/authApi'

interface RegisterProps {
  /** 呼叫它會讓右上角跳一則通知。實作在 App.tsx */
  onNotify: (message: string) => void
}

function Register({ onNotify }: RegisterProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [birthday, setBirthday] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    // 瀏覽器預設會在表單送出時重新載入整頁，那樣 React 的狀態會全部清空，所以要擋掉
    e.preventDefault()
    setErrorMessage('')

    // confirmPassword 只在前端比對，不會送給後端
    if (password !== confirmPassword) {
      setErrorMessage('兩次輸入的密碼不一致')
      return
    }

    setSubmitting(true)
    try {
      await register({ name, email, phone, birthday, password })

      onNotify('註冊成功！請登入')
      navigate('/login')
    } catch (err) {
      setErrorMessage(toRegisterErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Paper sx={{ maxWidth: 500, mx: 'auto', mt: 6, p: 4 }}>
      <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 700 }}>
        會員註冊
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="姓名"
            required
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="電子郵件"
            type="email"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="手機"
            type="tel"
            required
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            helperText="格式：09xxxxxxxx"
          />

          <TextField
            label="生日"
            type="date"
            required
            fullWidth
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            // type="date" 的輸入框一開始就有內容（日期格式），標籤不縮小會蓋住
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            label="密碼"
            type="password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            label="確認密碼"
            type="password"
            required
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? '註冊中...' : '註冊'}
          </Button>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <Typography align="center" color="text.secondary">
            已有帳號？
            <Link component={RouterLink} to="/login" sx={{ ml: 0.5, fontWeight: 700 }}>
              立即登入
            </Link>
          </Typography>
        </Stack>
      </form>
    </Paper>
  )
}

/** 把註冊失敗的錯誤轉成給使用者看的訊息 */
function toRegisterErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined

    if (data?.message) {
      return data.message // 後端給的，例如 Email already in use
    }
    if (err.response) {
      return `註冊失敗 (${err.response.status})`
    }
    return '無法連接到伺服器，請確認後端是否已啟動。'
  }
  return '發生未知錯誤'
}

export default Register
