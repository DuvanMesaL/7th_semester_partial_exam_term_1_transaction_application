import axios from "axios"

// Create axios instances for each microservice
export const userApi = axios.create({
  baseURL: "http://localhost:3001",
})

export const accountApi = axios.create({
  baseURL: "http://localhost:3002",
})

export const mailApi = axios.create({
  baseURL: "http://localhost:3003",
})

export const logApi = axios.create({
  baseURL: "http://localhost:3004",
})

const addAuthToken = (api: any) => {
  api.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem("accessToken")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error: any) => {
      return Promise.reject(error)
    },
  )
}

const handleTokenRefresh = (api: any) => {
  api.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshToken = localStorage.getItem("refreshToken")
          const response = await axios.post("http://localhost:3001/auth/refresh", {
            refreshToken,
          })

          const { accessToken } = response.data
          localStorage.setItem("accessToken", accessToken)

          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return axios(originalRequest)
        } catch (refreshError) {
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          window.location.href = "/login"
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    },
  )
}

// Apply interceptors to all APIs
;[userApi, accountApi, mailApi, logApi].forEach((api) => {
  addAuthToken(api)
  handleTokenRefresh(api)
})

