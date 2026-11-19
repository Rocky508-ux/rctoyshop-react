import { useCallback, useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { deleteUser, getAllUsers, updateUser } from '../../api/adminUserApi'
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

  /*
    按下「停用」要先跳確認視窗，而且視窗裡要講出是哪一位使用者，
    所以這裡存的不是 true / false，而是「哪一筆」——

      null    = 視窗關著
      某個 user = 視窗開著，而且正在問這一筆

    一個 state 同時回答了「開不開」和「是誰」。
  */
  const [statusTarget, setStatusTarget] = useState<User | null>(null)
  /** 刪除的確認視窗，跟 statusTarget 同一套做法：null = 關著，某個 user = 正在問這一筆 */
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  /**
   * 確認鈕按下去之後、API 還沒回來的那段時間，用來把兩顆按鈕變灰。
   * 兩個視窗共用一個就夠了 —— 同時只會有一個視窗開著。
   */
  const [submitting, setSubmitting] = useState(false)

  /*
    抓列表單獨拉出來，因為停用成功之後還要再抓一次。

    它被寫進下面 useEffect 的依賴陣列，所以要用 useCallback 包起來 ——
    不包的話每次重新渲染都是一個新的函式，useEffect 會以為依賴變了而重跑，
    變成無限迴圈。這就是當初講 useCallback 時說的「函式被放進別人的依賴陣列」。
  */
  const loadUsers = useCallback(async () => {
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
  }, [onNotify])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  /**
   * 確認視窗按下「確定」才會跑到這裡。
   * ACTIVE 就改成 DISABLED，反過來也一樣 —— 同一個函式處理停用和啟用兩種情況。
   */
  const handleConfirmToggleStatus = async () => {
    // statusTarget 的型別是 User | null，不先擋掉 null 下面不能寫 statusTarget.id
    if (!statusTarget) return

    const newStatus = statusTarget.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE'

    try {
      setSubmitting(true)
      // 只送 status 一個欄位，沒帶的欄位後端收到 null 就不會動到
      await updateUser(statusTarget.id, { status: newStatus })
      onNotify(`用戶「${statusTarget.name}」已${newStatus === 'ACTIVE' ? '啟用' : '停用'}`)
      setStatusTarget(null)
      // 重抓一次，讓表格上的狀態標籤跟著變
      await loadUsers()
    } catch (err) {
      onNotify(getApiErrorMessage(err))
    } finally {
      // 放 finally，失敗時按鈕才不會永遠卡在灰色
      setSubmitting(false)
    }
  }

  /**
   * 刪除的確認視窗按下「確定」才會跑到這裡。
   *
   * 跟 handleConfirmToggleStatus 幾乎一樣，差別只有中間那一行：
   * 這裡呼叫的是 deleteUser，而且它回 Promise<void>，沒有東西可以接。
   */
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    try {
      setSubmitting(true)
      await deleteUser(deleteTarget.id)
      onNotify(`用戶「${deleteTarget.name}」已刪除`)
      setDeleteTarget(null)
      // 重抓一次，刪掉的那一列才會從表格消失
      await loadUsers()
    } catch (err) {
      onNotify(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

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
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleUsers.length === 0 ? (
              <TableRow>
                {/* colSpan 讓這一格橫跨六個欄位，文字才能置中在整個表格 */}
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
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
                  <TableCell align="right">
                    {/*
                      Stack direction="row" 讓兩顆按鈕橫向排、中間空 1 單位。
                      靠右對齊要寫在 sx 裡 —— justifyContent 不是 Stack 的 prop。
                    */}
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color={user.status === 'ACTIVE' ? 'warning' : 'success'}
                        // 不是「現在就設定」，是「被按的時候才把這一筆存進 statusTarget」
                        onClick={() => setStatusTarget(user)}
                      >
                        {user.status === 'ACTIVE' ? '停用' : '啟用'}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => setDeleteTarget(user)}
                      >
                        刪除
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/*
        確認視窗。它從頭到尾都寫在這裡、一直存在，
        open 是 true 才顯示出來 —— 不是按下按鈕的時候才「叫出」一個視窗。

        open={statusTarget !== null}：有存到某一筆就顯示，是 null 就不顯示。
        onClose 是「使用者想關了」（按 ESC 或點旁邊灰色區域），
        真正關掉它的是我們自己把 statusTarget 設回 null。
      */}
      <Dialog open={statusTarget !== null} onClose={() => setStatusTarget(null)}>
        <DialogTitle>確認變更狀態</DialogTitle>
        <DialogContent>
          <DialogContentText>
            確定要將用戶「{statusTarget?.name}」
            {statusTarget?.status === 'ACTIVE' ? '停用' : '啟用'}嗎？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusTarget(null)} disabled={submitting}>
            取消
          </Button>
          <Button onClick={handleConfirmToggleStatus} variant="contained" disabled={submitting}>
            {submitting ? '處理中…' : '確定'}
          </Button>
        </DialogActions>
      </Dialog>

      {/*
        刪除的確認視窗。跟上面那個是兩個獨立的 Dialog，
        各自看各自的 state，所以不會互相干擾。

        刪除是救不回來的，所以確定鈕用 color="error" 染紅，
        文案也寫明「無法復原」。
      */}
      <Dialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>確認刪除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            確定要刪除用戶「{deleteTarget?.name}」嗎？此操作無法復原。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={submitting}>
            取消
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={submitting}
          >
            {submitting ? '刪除中…' : '確定刪除'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UserManagement
