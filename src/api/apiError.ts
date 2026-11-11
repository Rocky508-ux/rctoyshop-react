import axios from 'axios'

/** 把 axios 丟出來的錯誤轉成可以顯示給使用者看的訊息 */
export const getApiErrorMessage = (err: unknown): string => {
  let msg = '無法連接到後端 API'

  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; exception?: string } | undefined

    if (data?.message) {
      msg += `: ${data.message} (${data.exception ?? ''})`
    } else if (err.response) {
      msg += `: Status ${err.response.status}`
    } else {
      msg += `: ${err.message}`
    }
  }

  return `${msg}。請確認後端服務是否正常。`
}
