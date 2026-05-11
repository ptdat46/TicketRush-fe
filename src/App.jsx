import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import AdminDashboardPage from './pages/AdminDashboardPage'
import EventListPage from './pages/EventListPage'
import HomePage from './pages/HomePage'
import MyProfilePage from './pages/MyProfilePage'
import MyTicketPage from './pages/MyTicketPage'
import OrganizerCreateEventPage from './pages/OrganizerCreateEventPage'
import RegisterPage from './pages/RegisterPage'
import SignInPage from './pages/SignInPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventListPage />} />
          <Route path="/sign-in" element={<SignInPage expectedRole="customer" />} />
          <Route path="/register" element={<RegisterPage role="customer" />} />
          <Route path="/admin/sign-in" element={<SignInPage expectedRole="admin" />} />
          <Route path="/organizer/sign-in" element={<SignInPage expectedRole="organizer" />} />
          <Route path="/organizer/register" element={<RegisterPage role="organizer" />} />
          <Route
            path="/my-ticket"
            element={
              <ProtectedRoute roles={['customer']}>
                <MyTicketPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute roles={['customer', 'organizer', 'admin']}>
                <MyProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/create-event"
            element={
              <ProtectedRoute roles={['organizer']}>
                <OrganizerCreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
