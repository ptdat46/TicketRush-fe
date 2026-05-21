import { useEffect, useMemo, useState } from 'react'
import { FiCalendar, FiMapPin, FiRefreshCw, FiTag } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { api } from '../utils/api'
import { formatCurrency, formatEventDateTime, getEventImage } from '../utils/eventDisplay'

const STATUS_LABELS = {
  expired: 'Hết hạn',
  used: 'Đã dùng',
  valid: 'Còn hiệu lực',
  void: 'Đã hủy',
}

const STATUS_CLASSES = {
  expired: 'border-amber-400/30 bg-amber-500/10 text-amber-100',
  used: 'border-zinc-400/30 bg-zinc-500/10 text-zinc-100',
  valid: 'border-[#59de92]/30 bg-[#20b36c]/15 text-[#78fcac]',
  void: 'border-red-400/30 bg-red-500/10 text-red-100',
}

function getSeatLabel(seat) {
  if (!seat) return 'Chưa gán'
  const row = String.fromCharCode(65 + Number(seat.row_index || 0))
  return `${row}${Number(seat.col_index || 0) + 1}`
}

function getTicketItems(response) {
  if (Array.isArray(response.data)) return response.data
  if (Array.isArray(response.data?.data)) return response.data.data
  if (Array.isArray(response.data?.tickets)) return response.data.tickets
  return []
}

function TicketCard({ ticket }) {
  const event = ticket.event || {}
  const seat = ticket.seat || {}
  const order = ticket.order || {}
  const status = ticket.display_status || ticket.status || 'valid'
  const zoneName = seat.zone?.name || 'Khu vực'

  return (
    <article className="overflow-hidden rounded-xl border border-[#3d4a40] bg-[#1a211c] shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
      <div className="grid md:grid-cols-[220px_1fr]">
        <div className="relative h-48 bg-[#2f3631] md:h-full">
          <img alt={event.name || 'Sự kiện'} className="h-full w-full object-cover" src={getEventImage(event)} />
          <span className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${STATUS_CLASSES[status] || STATUS_CLASSES.valid}`}>
            {STATUS_LABELS[status] || status}
          </span>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="line-clamp-2 text-xl font-black text-white">{event.name || 'Sự kiện'}</h2>
              <div className="mt-3 grid gap-2 text-sm text-[#bccabd] sm:grid-cols-2">
                <span className="inline-flex items-center gap-2"><FiCalendar />{formatEventDateTime(event.starts_at)}</span>
                <span className="inline-flex items-center gap-2"><FiMapPin />{event.venue || 'Đang cập nhật địa điểm'}</span>
              </div>
            </div>
            {order.id && (
              <Link className="rounded-full border border-[#59de92]/40 px-4 py-2 text-sm font-bold text-[#78fcac] transition-colors hover:bg-[#20b36c] hover:text-[#00210f]" to={`/orders/${order.id}/success`}>
                Xem vé
              </Link>
            )}
          </div>

          <div className="mt-5 grid gap-3 rounded-lg bg-[#0e1510] p-4 sm:grid-cols-4">
            <TicketMeta label="Khu vực" value={zoneName} />
            <TicketMeta label="Ghế" value={getSeatLabel(seat)} accent />
            <TicketMeta label="Mã vé" value={ticket.ticket_code || ticket.qr_code || `TICKET-${ticket.id}`} wide />
            <TicketMeta label="Tổng tiền" value={formatCurrency(order.total_amount || seat.zone?.price || 0)} />
          </div>
        </div>
      </div>
    </article>
  )
}

function TicketMeta({ accent = false, label, value, wide = false }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <p className="text-xs font-black uppercase tracking-wider text-[#869488]">{label}</p>
      <p className={`mt-1 break-words text-sm font-black ${accent ? 'text-[#59de92]' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function MyTicketPage() {
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const ticketCount = useMemo(() => tickets.length, [tickets])

  async function loadTickets() {
    setIsLoading(true)
    setError('')
    const response = await api.get('/customer/tickets?sort_by=issued_at&sort_direction=desc&per_page=50')
    setIsLoading(false)

    if (!response.success) {
      setError(response.error || 'Không thể tải danh sách vé.')
      return
    }

    setTickets(getTicketItems(response))
  }

  useEffect(() => {
    loadTickets()
  }, [])

  return (
    <div className="min-h-screen bg-[#0e1510] text-[#dde5dc]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#59de92]">TicketRush</p>
            <h1 className="mt-2 text-3xl font-black text-white">Vé của tôi</h1>
            <p className="mt-3 text-[#bccabd]">{ticketCount > 0 ? `Bạn có ${ticketCount} vé trong tài khoản.` : 'Các vé đã mua sẽ xuất hiện tại đây.'}</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-[#3d4a40] px-4 py-2 text-sm font-bold text-[#bccabd] transition-colors hover:border-[#59de92] hover:text-white disabled:cursor-not-allowed disabled:opacity-50" disabled={isLoading} onClick={loadTickets} type="button">
            <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-8 text-[#bccabd]">Đang tải danh sách vé...</div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl border border-red-400/30 bg-red-950/40 p-8 text-red-100">{error}</div>
        )}

        {!isLoading && !error && tickets.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#3d4a40] bg-[#1a211c] p-10 text-center">
            <FiTag className="mx-auto text-[#59de92]" size={42} />
            <h2 className="mt-4 text-xl font-black text-white">Chưa có vé nào</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#bccabd]">Sau khi thanh toán thành công, vé sẽ được backend phát hành và hiển thị trong danh sách này.</p>
            <Link className="mt-5 inline-flex rounded-full bg-[#20b36c] px-5 py-3 text-sm font-black text-[#00210f] transition-colors hover:bg-[#59de92]" to="/events">
              Tìm sự kiện
            </Link>
          </div>
        )}

        {!isLoading && !error && tickets.length > 0 && (
          <section className="grid gap-5">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

export default MyTicketPage
