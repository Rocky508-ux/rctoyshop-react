import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { getAllUsers } from '../../api/adminUserApi'
import { getApiErrorMessage } from '../../api/apiError'
import type { User } from '../../types/user'

interface UserManagementProps {
  /** 呼叫它會讓右上角跳一則通知。實作在 App.tsx */
  onNotify: (message: string) => void
}

/** 2026-01-23T10:00:00 → 2026/1/23。沒有值就顯示 N/A */
const formatDate = (value: string | null): string =>
  value ? new Date(value).toLocaleDateString() : 'N/A'

/**
 * 後台 → 用戶管理。
 *
 * 它不是一個「頁面」—— 最後會變成 Admin 的其中一個分頁，
 * 所以放在 components/admin/ 而不是 views/。
 * 目前先在 App.tsx 掛一條暫時的 /admin/users 路由，才看得到畫面。
 */
function UserManagement({ onNotify }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        setFetchError(null)
        const data = await getAllUsers()
        setUsers(data)
      } catch (err) {
        setFetchError(getApiErrorMessage(err))
        onNotify('無法獲取用戶列表，請稍後再試')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [onNotify])

  /*
    不顯示自己 —— 管理員不應該在這裡停用或刪掉自己的帳號。

    舊版多存了一個 filteredUsers 的 ref，每次抓完資料要記得同步更新兩個地方。
    這裡直接從 users 算出來就好：它是「從別的 state 算得出來的值」，不用 useState。

    localStorage 沒有 userId 時 Number(null) 會是 0，不會等於任何人的 id，
    所以那種情況就是全部都顯示，不用另外判斷。
  */
  const currentUserId = Number(localStorage.getItem('userId'))
  const visibleUsers = users.filter((user) => user.id !== currentUserId)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (fetchError) {
    return <Alert severity="error">{fetchError}</Alert>
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        用戶管理
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>ID</TableCell>
              <TableCell>名稱</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>註冊日期</TableCell>
              <TableCell>狀態</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleUsers.length === 0 ? (
              <TableRow>
                {/* colSpan 讓這一格橫跨五個欄位，文字才能置中在整個表格 */}
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">目前沒有用戶</Typography>
                </TableCell>
              </TableRow>
            ) : (
              visibleUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    {/* Chip = 小圓角標籤，對照舊版自己刻的 .status-badge */}
                    <Chip
                      size="small"
                      label={user.status === 'ACTIVE' ? '啟用中' : '已停用'}
                      color={user.status === 'ACTIVE' ? 'success' : 'default'}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default UserManagement
