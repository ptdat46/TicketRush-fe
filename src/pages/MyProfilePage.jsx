import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'

function MyProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/sign-in')
  }

  return (
    <div className="min-h-screen bg-[#0e1510] text-[#dde5dc]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-white">Tài khoản của tôi</h1>
        <div className="mt-6 max-w-xl rounded-2xl border border-[#3d4a40] bg-[#1a211c] p-6">
          <p className="text-sm text-[#bccabd]">Họ tên</p>
          <p className="mt-1 text-lg font-bold text-white">{user?.name || 'Chưa có thông tin'}</p>
          <p className="mt-4 text-sm text-[#bccabd]">Email</p>
          <p className="mt-1 text-lg font-bold text-white">{user?.email || 'Chưa có thông tin'}</p>
          <p className="mt-4 text-sm text-[#bccabd]">Vai trò</p>
          <p className="mt-1 text-lg font-bold text-white">{user?.role || 'Chưa có thông tin'}</p>

          <button
            className="mt-6 w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20"
            onClick={handleLogout}
            type="button"
          >
            Đăng xuất
          </button>
        </div>
      </main>
    </div>
  )
}

export default MyProfilePage
