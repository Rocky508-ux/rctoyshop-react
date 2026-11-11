import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { login } from '../api/authApi'

interface LoginProps {
  /** 呼叫它會讓右上角跳一則通知。實作在 App.tsx，因為通知資料住在那裡 */
  onNotify: (message: string) => void
}

function Login({ onNotify }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // 被 RequireAuth 擋下來導到這頁時，網址會帶 ?msg=請先登入...
  // 把那句話讀出來跳通知，使用者才知道為什麼被踢過來。
  useEffect(() => {
    const msg = searchParams.get('msg')
    if (msg) {
      onNotify(msg)
    }
  }, [searchParams, onNotify])

  const handleSubmit = async (e: FormEvent) => {
    // 瀏覽器預設會在表單送出時重新載入整頁，那樣 React 的狀態會全部清空，所以要擋掉
    e.preventDefault()
    setErrorMessage('')
    setSubmitting(true)

    try {
      const res = await login({ email, password })

      localStorage.setItem('authToken', res.token)
      localStorage.setItem('userRole', res.user.role)
      localStorage.setItem('userName', res.user.name)
      localStorage.setItem('userId', String(res.user.id))

      onNotify(`歡迎回來，${res.user.name}！登入成功`)
      navigate(res.user.role === 'ADMIN' ? '/admin' : '/')
    } catch (err) {
      setErrorMessage(toLoginErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Paper sx={{ maxWidth: 500, mx: 'auto', mt: 6, p: 4 }}>
      <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 700 }}>
        會員登入
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="密碼"
            type="password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? '登入中...' : '登入'}
          </Button>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <Typography align="center" color="text.secondary">
            還沒有帳號嗎？
            <Link component={RouterLink} to="/register" sx={{ ml: 0.5, fontWeight: 700 }}>
              立即註冊
            </Link>
          </Typography>
        </Stack>
      </form>
    </Paper>
  )
}

/** 把登入失敗的錯誤轉成給使用者看的訊息 */
function toLoginErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined

    if (data?.message) {
      return data.message // 後端給的：帳號或密碼錯誤 / 帳戶已被停用
    }
    if (err.response) {
      return `登入失敗 (${err.response.status})`
    }
    return '無法連接到伺服器，請確認後端是否已啟動。'
  }
  return '發生未知錯誤'
}

export default Login
