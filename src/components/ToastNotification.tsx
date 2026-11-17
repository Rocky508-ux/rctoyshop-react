import Stack from '@mui/material/Stack'
import Slide from '@mui/material/Slide'
import Alert from '@mui/material/Alert'

/**
 * 一則通知。
 * 後端沒有對應的 DTO —— 這是前端自己的型別，通知只活在畫面上。
 */
export interface Notification {
  /** 用 Date.now() 當 id：當 map 的 key，也用來在 3 秒後找出該移除哪一筆 */
  id: number
  /** 顯示的文字，例如「已將 遙控車A 加入購物車」 */
  message: string
}

interface ToastNotificationProps {
  /**
   * 要顯示的通知清單，由 App.tsx 的 notifications state 傳進來。
   * 加了 ? 和預設值 []，是為了讓父層忘記傳時不會在 .map() 那行爆掉。
   */
  notifications?: Notification[]
}

/**
 * 畫面右上角的浮動通知（toast）。
 *
 * 這個元件只負責「把收到的清單畫出來」，不管通知怎麼來、什麼時候消失 ——
 * 新增和 3 秒後移除都在 App.tsx 的 handleNotify 裡做。
 * 想發通知的頁面不是呼叫這個元件，而是呼叫父層傳下去的 onNotify。
 */
function ToastNotification({ notifications = [] }: ToastNotificationProps) {
  return (
    // position: fixed 讓它固定在畫面右上角，不會跟著頁面捲動。
    // zIndex: 'snackbar' 是 MUI 預設的層級（1400），確保蓋在其他東西上面。
    <Stack
      spacing={1}
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 'snackbar',
        alignItems: 'flex-end',
      }}
    >
      {/* 有幾筆通知就畫幾個 Alert。清空陣列時這裡什麼都不畫，整個區塊就空了 */}
      {notifications.map((notification) => (
        // Slide 負責滑入動畫：direction="left" 從右邊滑進來，
        // in 等於 in={true}（一出現就播動畫），unmountOnExit 讓它退場後從畫面移除
        <Slide key={notification.id} direction="left" in mountOnEnter unmountOnExit>
          <Alert severity="success" variant="filled">
            {notification.message}
          </Alert>
        </Slide>
      ))}
    </Stack>
  )
}

export default ToastNotification
