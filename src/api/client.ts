import axios from 'axios'

/**
 * 全專案共用的 axios 設定。
 * 所有 api/ 底下的檔案都用這一個，才不用每支 API 各自設定網址前綴和 token。
 */
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 每次發送請求前，axios 會先把這次的設定交給這個函式。
// 在這裡把登入時存的 token 塞進 header，所以各支 API 都不用自己處理身分驗證。
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token && token.startsWith('ey')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
