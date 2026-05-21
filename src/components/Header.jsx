import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiMenu, FiSearch } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, role } = useAuth()

  const isAdmin = role === 'admin'
  const isOrganizer = role === 'organizer'
  const isCustomer = role === 'customer'
  const isCreateEventPage = location.pathname === '/organizer/create-event'
  const isOrganizerEventsPage = location.pathname.startsWith('/organizer/events')
  const isAdminPage = location.pathname.startsWith('/admin')
  const showCreateEvent = !isAdmin && (!isAuthenticated || isOrganizer) && !isCreateEventPage
  const showOrganizerEvents = isOrganizer && !isOrganizerEventsPage
  const showMyTickets = !isAdmin && (!isAuthenticated || isCustomer || !role)
  const showSearch = !isAdmin

  const navLinkClass = (isActive) => (
    `rounded-full px-3 py-1 text-sm font-semibold transition-all duration-300 hover:bg-white/10 hover:text-white ${
      isActive ? 'border-b-2 border-white text-white' : 'text-white/80'
    }`
  )

  const handleCreateEventClick = (event) => {
    event.preventDefault()
    navigate(isOrganizer ? '/organizer/create-event' : '/organizer/sign-in')
  }

  const handleMyTicketsClick = (event) => {
    event.preventDefault()
    navigate(isAuthenticated ? '/my-ticket' : '/sign-in')
  }

  return (
    <header className="sticky top-0 z-50 h-20 w-full bg-[#20b36c] px-4 text-white shadow-xl shadow-emerald-900/20 sm:px-8">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6">
        <Link className="shrink-0 text-2xl font-black uppercase italic tracking-tighter transition-transform active:scale-95" to="/">
          TicketRush
        </Link>

        {showSearch && (
          <div className="relative mx-4 hidden max-w-xl flex-1 md:block">
            <input
              className="w-full rounded-full border-none bg-[#252c26]/70 py-2.5 pl-5 pr-12 text-[#dde5dc] placeholder:text-[#bccabd] outline-none transition-all focus:bg-[#252c26] focus:ring-2 focus:ring-[#78fcac]"
              placeholder="Bạn tìm gì hôm nay?"
              type="text"
            />
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-[#78fcac]" size={20} />
          </div>
        )}

        {!showSearch && <div className="hidden flex-1 md:block" />}

        <nav className="hidden items-center gap-3 md:flex">
          <Link className={navLinkClass(location.pathname === '/')} to="/">
            Khám phá
          </Link>

          {isAdmin && (
            <Link className={navLinkClass(isAdminPage)} to="/admin">
              Quản trị
            </Link>
          )}

          {showCreateEvent && (
            <a
              className={navLinkClass(isCreateEventPage)}
              href="/organizer/create-event"
              onClick={handleCreateEventClick}
            >
              Tạo sự kiện
            </a>
          )}

          {showOrganizerEvents && (
            <Link
              className={navLinkClass(isOrganizerEventsPage)}
              to="/organizer/events"
            >
              Sự kiện của tôi
            </Link>
          )}

          {showMyTickets && (
            <a className={navLinkClass(location.pathname === '/my-ticket')} href="/my-ticket" onClick={handleMyTicketsClick}>
              Vé của tôi
            </a>
          )}

          <Link className="ml-2 rounded-full bg-[#0e1510] px-6 py-2 font-bold text-[#dde5dc] shadow-lg shadow-black/20 transition-colors hover:bg-[#2f3631]" to={isAuthenticated ? '/my-profile' : '/sign-in'}>
            {isAuthenticated ? 'Tài khoản' : 'Đăng nhập'}
          </Link>
        </nav>

        <button className="md:hidden" type="button" aria-label="Mở menu">
          <FiMenu size={26} />
        </button>
      </div>
    </header>
  )
}

export default Header
