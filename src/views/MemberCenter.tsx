import { useEffect, useState, type FormEvent } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { getUserProfile, updateUserProfile } from '../api/userApi'
import { getApiErrorMessage } from '../api/apiError'
import type { User } from '../types/user'

interface MemberCenterProps {
  /** 呼叫它會讓右上角跳一則通知。實作在 App.tsx */
  onNotify: (message: string) => void
}

/** 小標題，三個區塊共用。左邊有一條藍色直線，對照舊版的 .section-title */
function SectionTitle({ children }: { children: string }) {
  return (
    <Typography
      variant="h6"
      color="primary"
      sx={{ mb: 3, pl: 2, borderLeft: '5px solid', borderColor: 'primary.main' }}
    >
      {children}
    </Typography>
  )
}

/** 檢視模式的一格：上面灰色小標、下面淺底方塊裝值 */
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography sx={{ mb: 1, fontWeight: 600 }}>{label}</Typography>
      <Paper variant="outlined" sx={{ px: 2, py: 1.5, bgcolor: 'grey.50' }}>
        <Typography>{value || '—'}</Typography>
      </Paper>
    </Box>
  )
}

/** 手機：09 開頭 10 碼，或市話 02-12345678 這種 */
const PHONE_PATTERN = /^09\d{8}$|^0\d{1,2}-?\d{6,8}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * 會員中心。
 * 三個區塊：會員資訊（可編輯）、修改密碼、訂單查詢。
 *
 * 這一頁被 RequireAuth 包著，所以進得來的一定是登入狀態。
 */
function MemberCenter({ onNotify }: MemberCenterProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  /* ─────────── 編輯會員資訊 ─────────── */

  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // 編輯中的暫存值。按「取消」就整個丟掉，user 不會被動到
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editBirthday, setEditBirthday] = useState('')

  /* ─────────── 修改密碼 ─────────── */

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  // 進這一頁時打一次 API 把自己的資料抓回來
  useEffect(() => {
    const loadUser = async () => {
      const userId = localStorage.getItem('userId')

      // 舊版 token 可能沒存 userId，那樣就抓不到資料
      if (!userId) {
        setFetchError('偵測到過期的登入狀態，請重新登入')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setFetchError(null)
        const data = await getUserProfile(userId)
        setUser(data)
      } catch (err) {
        setFetchError(getApiErrorMessage(err))
        onNotify('無法獲取會員資料，請稍後再試')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
    // onNotify 在 App.tsx 用 useCallback 包過，每次渲染都是同一個，不會重複觸發
  }, [onNotify])

  /** 按「編輯資料」：把目前的值複製進暫存欄位，再切成編輯模式 */
  const startEditing = () => {
    if (!user) return

    setEditName(user.name ?? '')
    setEditEmail(user.email ?? '')
    setEditPhone(user.phone ?? '')
    setEditBirthday(user.birthday ?? '')
    setIsEditing(true)
  }

  /** 按「取消」：直接關掉編輯模式，暫存值不用清，下次 startEditing 會重新蓋過去 */
  const cancelEditing = () => {
    setIsEditing(false)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()

    // 後端 UserUpdateRequest 上面也有 @Email / @Pattern / @Past，
    // 但 GlobalExceptionHandler 目前把 @Valid 失敗當成 500，前端拿不到有用的訊息，
    // 所以這些檢查先留在前端。
    if (editName.trim().length < 2) {
      onNotify('姓名請至少輸入 2 個字')
      return
    }

    if (!EMAIL_PATTERN.test(editEmail)) {
      onNotify('電子郵件格式不正確')
      return
    }

    if (!PHONE_PATTERN.test(editPhone)) {
      onNotify('手機號碼格式錯誤 (範例: 0912345678)')
      return
    }

    // 生日不能挑到未來的日期
    if (editBirthday && new Date(editBirthday) > new Date()) {
      onNotify('生日不可以是未來日期！')
      return
    }

    const userId = localStorage.getItem('userId')
    if (!userId) {
      onNotify('使用者 ID 遺失，請重新登入')
      return
    }

    setSaving(true)
    try {
      // ⚠️ 暫時的：本機後端太快，看不到「儲存中…」。看完就刪掉這一行
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 後端回傳更新後的完整資料，直接拿來當新的 user，不用自己拼
      const updated = await updateUserProfile(userId, {
        name: editName,
        email: editEmail,
        phone: editPhone,
        birthday: editBirthday,
      })

      setUser(updated)
      setIsEditing(false)
      onNotify('會員資料已更新！')
    } catch (err) {
      onNotify(getApiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      onNotify('新密碼與確認密碼不相符！')
      return
    }

    const userId = localStorage.getItem('userId')
    if (!userId) {
      onNotify('使用者 ID 遺失，請重新登入')
      return
    }

    setChangingPassword(true)
    try {
      // UserUpdateRequest 的欄位都允許 null，所以只帶 password，其他資料不會被動到
      await updateUserProfile(userId, { password: newPassword })

      onNotify('密碼已成功修改！')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      onNotify(getApiErrorMessage(err))
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (fetchError || !user) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', my: 6, px: 2 }}>
        <Alert severity="error">{fetchError ?? '找不到會員資料'}</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', my: 6, px: 2 }}>
      <Paper variant="outlined" sx={{ p: 5 }}>
        <Typography variant="h4" align="center" sx={{ mb: 5, fontWeight: 700 }}>
          會員中心
        </Typography>

        {/* ───────── 會員資訊 ───────── */}
        <Box sx={{ pb: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <SectionTitle>會員資訊</SectionTitle>

          {/*
            同一塊地方有兩種樣子：沒在編輯就顯示文字，編輯中就換成輸入框。
            跟 Dialog 的 open 一樣 —— 兩邊都先寫好，isEditing 決定畫哪一邊。
          */}
          {!isEditing ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 3,
              }}
            >
              <InfoItem label="姓名" value={user.name} />
              <InfoItem label="電子郵件" value={user.email} />
              <InfoItem label="手機" value={user.phone} />
              <InfoItem label="生日" value={user.birthday} />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSave}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 3,
                }}
              >
                <TextField
                  label="姓名"
                  required
                  fullWidth
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <TextField
                  label="電子郵件"
                  type="email"
                  required
                  fullWidth
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
                <TextField
                  label="手機"
                  type="tel"
                  required
                  fullWidth
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
                {/*
                  type="date" 會跳出日期選擇器。
                  shrink 讓「生日」這個標籤固定在上面 —— 不然日期框一開始是空的，
                  標籤會蓋住 yyyy/mm/dd 那段提示字。
                */}
                <TextField
                  label="生日"
                  type="date"
                  required
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={editBirthday}
                  onChange={(e) => setEditBirthday(e.target.value)}
                />
              </Box>

              <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'center' }}>
                <Button type="button" variant="outlined" color="error" onClick={cancelEditing}>
                  取消
                </Button>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? '儲存中…' : '儲存變更'}
                </Button>
              </Stack>
            </Box>
          )}

          {/* 檢視模式才有「編輯資料」鈕；編輯模式的按鈕在上面 form 裡面 */}
          {!isEditing && (
            <Stack direction="row" sx={{ mt: 3, justifyContent: 'center' }}>
              <Button variant="contained" onClick={startEditing}>
                編輯資料
              </Button>
            </Stack>
          )}
        </Box>

        {/* ───────── 修改密碼 ───────── */}
        <Box sx={{ py: 4, borderBottom: '1px solid', borderColor: 'grey.200' }}>
          <SectionTitle>修改密碼</SectionTitle>

          <Box component="form" onSubmit={handleChangePassword}>
            <Stack spacing={2.5} sx={{ maxWidth: 420 }}>
              {/* type="password" 讓輸入的字變成圓點 */}
              <TextField
                label="目前密碼"
                type="password"
                required
                fullWidth
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <TextField
                label="新密碼"
                type="password"
                required
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                label="確認新密碼"
                type="password"
                required
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Stack>

            <Stack direction="row" sx={{ mt: 3, justifyContent: 'center' }}>
              <Button type="submit" variant="contained" disabled={changingPassword}>
                {changingPassword ? '更新中…' : '更新密碼'}
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* ───────── 訂單查詢 ───────── */}
        <Box sx={{ pt: 4 }}>
          <SectionTitle>訂單查詢</SectionTitle>

          <Typography color="text.secondary">點擊下方按鈕查看您的歷史訂單紀錄。</Typography>

          <Stack direction="row" sx={{ mt: 3, justifyContent: 'center' }}>
            {/* component={RouterLink} = 外觀用 MUI、換頁行為用 react-router */}
            <Button component={RouterLink} to="/orders" variant="contained" sx={{ minWidth: 200 }}>
              查看訂單
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}

export default MemberCenter
