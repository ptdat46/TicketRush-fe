import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'

function MyProfilePage() {
  const { user } = useAuth()

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
        </div>
      </main>
    </div>
  )
}

export default MyProfilePage
