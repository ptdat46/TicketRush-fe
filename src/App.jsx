import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import AdminDashboardPage from './pages/AdminDashboardPage'
import BookingPage from './pages/BookingPage'
import BookingSuccessPage from './pages/BookingSuccessPage'
import EventListPage from './pages/EventListPage'
import HomePage from './pages/HomePage'
import MyProfilePage from './pages/MyProfilePage'
import MyTicketPage from './pages/MyTicketPage'
import OrganizerCreateEventPage from './pages/OrganizerCreateEventPage'
import OrganizerEventDetailPage from './pages/OrganizerEventDetailPage'
import OrganizerEventsPage from './pages/OrganizerEventsPage'
import RegisterPage from './pages/RegisterPage'
import SignInPage from './pages/SignInPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ style: { background: '#1a211c', border: '1px solid #3d4a40', color: '#dde5dc' } }} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventListPage />} />
          <Route path="/sign-in" element={<SignInPage expectedRole="customer" />} />
          <Route path="/register" element={<RegisterPage role="customer" />} />
          <Route path="/admin/sign-in" element={<SignInPage expectedRole="admin" />} />
          <Route path="/organizer/sign-in" element={<SignInPage expectedRole="organizer" />} />
          <Route path="/organizer/register" element={<RegisterPage role="organizer" />} />
          <Route
            path="/events/:eventId/book"
            element={
              <ProtectedRoute roles={['customer']}>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderId/success"
            element={
              <ProtectedRoute roles={['customer']}>
                <BookingSuccessPage />
              </ProtectedRoute>
            }
          />
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
            path="/organizer/events"
            element={
              <ProtectedRoute roles={['organizer']}>
                <OrganizerEventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/events/:eventId"
            element={
              <ProtectedRoute roles={['organizer']}>
                <OrganizerEventDetailPage />
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
