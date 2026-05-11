import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'

function RegisterPage({ role = 'customer' }) {
  const isOrganizer = role === 'organizer'
  const [form, setForm] = useState({
    birthday: '',
    email: '',
    gender: '',
    name: '',
    organizer_name: '',
    password: '',
    password_confirmation: '',
    tax_code: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    const payload = isOrganizer
      ? {
          email: form.email,
          name: form.name,
          organizer_name: form.organizer_name,
          password: form.password,
          password_confirmation: form.password_confirmation,
          tax_code: form.tax_code,
        }
      : {
          birthday: form.birthday || undefined,
          email: form.email,
          gender: form.gender || undefined,
          name: form.name,
          password: form.password,
          password_confirmation: form.password_confirmation,
        }

    const response = await api.post(`/auth/register/${role}`, payload)
    setIsSubmitting(false)

    if (!response.success) {
      setError(response.error || 'Đăng ký thất bại.')
      return
    }

    setMessage('Đăng ký thành công. Vui lòng kiểm tra email để lấy mã xác thực trước khi đăng nhập.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0e1510] px-4 py-12 text-[#dde5dc]">
      <section className="w-full max-w-2xl rounded-2xl border border-[#3d4a40] bg-[#1a211c] p-8 shadow-2xl shadow-black/30">
        <Link className="mb-8 block text-center text-3xl font-black uppercase italic tracking-tighter text-[#59de92]" to="/">
          TicketRush
        </Link>

        <h1 className="mb-2 text-2xl font-extrabold text-white">Đăng ký {isOrganizer ? 'nhà tổ chức' : 'khách hàng'}</h1>
        <p className="mb-6 text-sm text-[#bccabd]">Tạo tài khoản để bắt đầu sử dụng TicketRush.</p>

        {message && <div className="mb-4 rounded-lg border border-emerald-400/30 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-100">{message}</div>}
        {error && <div className="mb-4 rounded-lg border border-red-400/30 bg-red-950/50 px-4 py-3 text-sm text-red-100">{error}</div>}

        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-[#bccabd] sm:col-span-2">
            Họ tên
            <input className="mt-2 w-full rounded-xl border border-[#3d4a40] bg-[#0e1510] px-4 py-3 text-white outline-none focus:border-[#59de92]" name="name" onChange={handleChange} required value={form.name} />
          </label>

          <label className="block text-sm font-semibold text-[#bccabd] sm:col-span-2">
            Email
            <input className="mt-2 w-full rounded-xl border border-[#3d4a40] bg-[#0e1510] px-4 py-3 text-white outline-none focus:border-[#59de92]" name="email" onChange={handleChange} required type="email" value={form.email} />
          </label>

          {!isOrganizer && (
            <>
              <label className="block text-sm font-semibold text-[#bccabd]">
                Giới tính
                <select className="mt-2 w-full rounded-xl border border-[#3d4a40] bg-[#0e1510] px-4 py-3 text-white outline-none focus:border-[#59de92]" name="gender" onChange={handleChange} value={form.gender}>
                  <option value="">Không chọn</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </label>

              <label className="block text-sm font-semibold text-[#bccabd]">
                Ngày sinh
                <input className="mt-2 w-full rounded-xl border border-[#3d4a40] bg-[#0e1510] px-4 py-3 text-white outline-none focus:border-[#59de92]" name="birthday" onChange={handleChange} type="date" value={form.birthday} />
              </label>
            </>
          )}

          {isOrganizer && (
            <>
              <label className="block text-sm font-semibold text-[#bccabd]">
                Tên đơn vị tổ chức
                <input className="mt-2 w-full rounded-xl border border-[#3d4a40] bg-[#0e1510] px-4 py-3 text-white outline-none focus:border-[#59de92]" name="organizer_name" onChange={handleChange} required value={form.organizer_name} />
              </label>

              <label className="block text-sm font-semibold text-[#bccabd]">
                Mã số thuế
                <input className="mt-2 w-full rounded-xl border border-[#3d4a40] bg-[#0e1510] px-4 py-3 text-white outline-none focus:border-[#59de92]" name="tax_code" onChange={handleChange} required value={form.tax_code} />
              </label>
            </>
          )}

          <label className="block text-sm font-semibold text-[#bccabd]">
            Mật khẩu
            <input className="mt-2 w-full rounded-xl border border-[#3d4a40] bg-[#0e1510] px-4 py-3 text-white outline-none focus:border-[#59de92]" name="password" onChange={handleChange} required type="password" value={form.password} />
          </label>

          <label className="block text-sm font-semibold text-[#bccabd]">
            Nhập lại mật khẩu
            <input className="mt-2 w-full rounded-xl border border-[#3d4a40] bg-[#0e1510] px-4 py-3 text-white outline-none focus:border-[#59de92]" name="password_confirmation" onChange={handleChange} required type="password" value={form.password_confirmation} />
          </label>

          <button className="rounded-xl bg-[#20b36c] px-5 py-3 font-bold text-black transition-colors hover:bg-[#78fcac] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#bccabd]">
          Đã có tài khoản? <Link className="font-bold text-[#59de92]" to={isOrganizer ? '/organizer/sign-in' : '/sign-in'}>Đăng nhập</Link>
        </p>
      </section>
    </main>
  )
}

export default RegisterPage
