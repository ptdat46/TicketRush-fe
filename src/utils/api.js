import axios from 'axios'
import { clearAuth, getAuthToken } from './authStorage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json'
  }
  return config
})

function handleUnauthorized() {
  clearAuth()
  const path = window.location.pathname || '/'
  let target = '/sign-in'
  if (path.startsWith('/admin')) target = '/admin/sign-in'
  else if (path.startsWith('/organizer')) target = '/organizer/sign-in'
  if (path !== target && path !== '/') {
    window.location.replace(target)
  }
}

apiClient.interceptors.response.use(
  (response) => ({
    success: true,
    data: response.data?.data !== undefined ? response.data.data : response.data,
    meta: response.data?.meta || null,
    status: response.status,
  }),
  (error) => {
    if (error.response?.status === 401) {
      handleUnauthorized()
    }
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Network Error',
      data: error.response?.data?.errors || null,
      status: error.response?.status,
    }
  },
)

export const api = {
  get: (endpoint, config) => apiClient.get(endpoint, config),
  post: (endpoint, data, config) => apiClient.post(endpoint, data, config),
  patch: (endpoint, data, config) => apiClient.patch(endpoint, data, config),
  put: (endpoint, data, config) => apiClient.put(endpoint, data, config),
  delete: (endpoint, data) => apiClient.delete(endpoint, data ? { data } : undefined),
}

export {
  clearAuth,
  getAuthRole,
  getAuthToken,
  getAuthUser,
  setAuthRole,
  setAuthToken,
  setAuthUser,
} from './authStorage'
