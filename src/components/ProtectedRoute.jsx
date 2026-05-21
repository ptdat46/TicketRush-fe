import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children, roles }) {
  const location = useLocation()
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    const loginPath = location.pathname.startsWith('/admin')
      ? '/admin/sign-in'
      : location.pathname.startsWith('/organizer')
        ? '/organizer/sign-in'
        : '/sign-in'

    return <Navigate replace to={loginPath} />
  }

  if (roles?.length && !roles.includes(role)) {
    return <Navigate replace to="/" />
  }

  return children
}

export default ProtectedRoute
