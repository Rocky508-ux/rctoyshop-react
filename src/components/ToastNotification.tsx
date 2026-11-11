import Stack from '@mui/material/Stack'
import Slide from '@mui/material/Slide'
import Alert from '@mui/material/Alert'

export interface Notification {
  id: number
  message: string
}

interface ToastNotificationProps {
  notifications?: Notification[]
}

function ToastNotification({ notifications = [] }: ToastNotificationProps) {
  return (
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
      {notifications.map((notification) => (
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
