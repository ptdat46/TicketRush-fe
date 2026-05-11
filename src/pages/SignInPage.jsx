import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const roleLabels = {
  admin: 'Admin',
  customer: 'Khách hàng',
  organizer: 'Nhà tổ chức',
}

function getRedirectPath(role) {
  if (role === 'admin') return '/admin'
  if (role === 'organizer') return '/organizer/create-event'
  return '/'
}

function SignInPage({ expectedRole = 'customer' }) {
  const navigate = useNavigate()
  const { isAuthenticated, login, role } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated && (!expectedRole || role === expectedRole)) {
    return <Navigate replace to={getRedirectPath(role)} />
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const response = await login(form)
    setIsSubmitting(false)

    if (!response.success) {
      setError(response.error || 'Đăng nhập thất bại.')
      return
    }

    if (response.data.user.role !== expectedRole) {
      setError(`Tài khoản này không phải role ${roleLabels[expectedRole]}.`)
      return
    }

    navigate(getRedirectPath(response.data.user.role), { replace: true })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0e1510] px-4 py-12 text-[#dde5dc]">
      <section className="w-full max-w-md rounded-2xl border border-[#3d4a40] bg-[#1a211c] p-8 shadow-2xl shadow-black/30">
        <Link className="mb-8 block text-center text-3xl font-black uppercase italic tracking-tighter text-[#59de92]" to="/">
          TicketRush
        </Link>

        <h1 className="mb-2 text-2xl font-extrabold text-white">Đăng nhập {roleLabels[expectedRole]}</h1>
        <p className="mb-6 text-sm text-[#bccabd]">Vui lòng đăng nhập để tiếp tục sử dụng TicketRush.</p>

        {error && <div className="mb-4 rounded-lg border border-red-400/30 bg-red-950/50 px-4 py-3 text-sm text-red-100">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-[#bccabd]">
            Email
            <input
              className="mt-2 w-full rounded-xl border border-[#3d4a40] bg-[#0e1510] px-4 py-3 text-white outline-none focus:border-[#59de92] focus:ring-2 focus:ring-[#59de92]/20"
              name="email"
              onChange={handleChange}
              required
              type="email"
              value={form.email}
            />
          </label>

          <label className="block text-sm font-semibold text-[#bccabd]">
            Mật khẩu
            <input
              className="mt-2 w-full rounded-xl border border-[#3d4a40] bg-[#0e1510] px-4 py-3 text-white outline-none focus:border-[#59de92] focus:ring-2 focus:ring-[#59de92]/20"
              name="password"
              onChange={handleChange}
              required
              type="password"
              value={form.password}
            />
          </label>

          <button className="w-full rounded-xl bg-[#20b36c] px-5 py-3 font-bold text-black transition-colors hover:bg-[#78fcac] disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {expectedRole === 'customer' && (
          <p className="mt-6 text-center text-sm text-[#bccabd]">
            Chưa có tài khoản? <Link className="font-bold text-[#59de92]" to="/register">Đăng ký ngay</Link>
          </p>
        )}

        {expectedRole === 'organizer' && (
          <p className="mt-6 text-center text-sm text-[#bccabd]">
            Chưa có tài khoản nhà tổ chức? <Link className="font-bold text-[#59de92]" to="/organizer/register">Đăng ký ngay</Link>
          </p>
        )}
      </section>
    </main>
  )
}

export default SignInPage
