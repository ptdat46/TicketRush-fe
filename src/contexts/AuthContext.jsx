import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { api, clearAuth, getAuthRole, getAuthToken, getAuthUser, setAuthRole, setAuthToken, setAuthUser } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getAuthToken())
  const [role, setRole] = useState(getAuthRole())
  const [user, setUser] = useState(getAuthUser())

  const isAuthenticated = Boolean(token)

  const saveSession = useCallback((session) => {
    setAuthToken(session.token)
    setAuthRole(session.user.role)
    setAuthUser(session.user)
    setToken(session.token)
    setRole(session.user.role)
    setUser(session.user)
  }, [])

  const login = useCallback(async (credentials) => {
    const response = await api.post('/auth/login', credentials)

    if (response.success) {
      saveSession(response.data)
    }

    return response
  }, [saveSession])

  const logout = useCallback(async () => {
    if (token) {
      await api.post('/auth/logout')
    }

    clearAuth()
    setToken(null)
    setRole(null)
    setUser(null)
  }, [token])

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      role,
      saveSession,
      token,
      user,
    }),
    [isAuthenticated, login, logout, role, saveSession, token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
