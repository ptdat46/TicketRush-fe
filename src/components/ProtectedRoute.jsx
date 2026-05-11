import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate replace to="/sign-in" />
  }

  if (roles?.length && !roles.includes(role)) {
    return <Navigate replace to="/" />
  }

  return children
}

export default ProtectedRoute
