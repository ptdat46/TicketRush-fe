import Cookies from 'js-cookie'

const COOKIE_OPTIONS = { expires: 7, path: '/' }

export function setAuthToken(token) {
  Cookies.set('authToken', token, COOKIE_OPTIONS)
}

export function setAuthRole(role) {
  Cookies.set('authRole', role, COOKIE_OPTIONS)
}

export function setAuthUser(user) {
  Cookies.set('authUser', JSON.stringify(user), COOKIE_OPTIONS)
}

export function getAuthToken() {
  return Cookies.get('authToken') || null
}

export function getAuthRole() {
  return Cookies.get('authRole') || null
}

export function getAuthUser() {
  const value = Cookies.get('authUser')
  if (!value) return null
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export function clearAuth() {
  Cookies.remove('authToken', { path: '/' })
  Cookies.remove('authRole', { path: '/' })
  Cookies.remove('authUser', { path: '/' })
}
