import { useEffect, useMemo, useState } from 'react'
import { FiCalendar, FiCheckCircle, FiDownload, FiHome, FiMapPin } from 'react-icons/fi'
import { Link, useLocation, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { api } from '../utils/api'
import { formatCurrency, formatEventDateTime, getEventImage } from '../utils/eventDisplay'

function makeQrCells(seed) {
  const value = String(seed || 'TICKETRUSH')
  return Array.from({ length: 121 }, (_, index) => {
    const code = value.charCodeAt(index % value.length)
    const row = Math.floor(index / 11)
    const col = index % 11
    const finder = (row < 3 && col < 3) || (row < 3 && col > 7) || (row > 7 && col < 3)
    return finder || (code + row * 7 + col * 11) % 3 === 0
  })
}

function TicketQr({ code }) {
  const cells = makeQrCells(code)

  return (
    <div className="grid h-40 w-40 grid-cols-11 gap-0.5 rounded-xl border border-[#d7d7d7] bg-white p-2 shadow-sm">
      {cells.map((filled, index) => (
        <span className={filled ? 'rounded-[1px] bg-black' : 'rounded-[1px] bg-white'} key={`${code}-${index}`} />
      ))}
    </div>
  )
}

function BookingSuccessPage() {
  const { orderId } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.order || null)
  const [event, setEvent] = useState(location.state?.event || location.state?.order?.event || null)
  const [selectedSeats] = useState(location.state?.selectedSeats || [])
  const [isLoading, setIsLoading] = useState(!location.state?.order)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadOrder() {
      if (!orderId || order) return
      setIsLoading(true)
      const response = await api.get(`/customer/orders/${orderId}`)

      if (!isMounted) return

      if (!response.success) {
        setError(response.error || 'Không thể tải thông tin vé.')
        setIsLoading(false)
        return
      }

      setOrder(response.data)
      setEvent(response.data?.event || null)
      setIsLoading(false)
    }

    loadOrder()

    return () => {
      isMounted = false
    }
  }, [order, orderId])

  const tickets = useMemo(() => {
    const sourceTickets = order?.tickets?.length ? order.tickets : []
    if (sourceTickets.length > 0) return sourceTickets

    return selectedSeats.map((seat, index) => ({
      id: seat.id,
      ticket_code: order?.tickets?.[index]?.ticket_code || `TR-${order?.id || orderId}-${seat.id}`,
      qr_code: order?.tickets?.[index]?.qr_code,
      seat,
      status: 'valid',
    }))
  }, [order, orderId, selectedSeats])

  const firstTicket = tickets[0] || {}
  const firstSeat = firstTicket.seat || selectedSeats[0] || {}
  const zoneName = firstSeat.zone?.name || firstTicket.seat?.zone?.name || 'V.I.P'
  const seatLabel = firstSeat.row_index !== undefined ? `${String.fromCharCode(65 + Number(firstSeat.row_index || 0))}${Number(firstSeat.col_index || 0) + 1}` : 'A12'
  const ticketCode = firstTicket.qr_code || firstTicket.ticket_code || order?.order_code || `TR-${orderId}`

  return (
    <div className="min-h-screen bg-[#0e1510] text-[#dde5dc]">
      <Header />

      <main className="mx-auto flex w-full max-w-screen-md flex-col items-center gap-8 px-6 py-10">
        {isLoading && <div className="w-full rounded-xl border border-[#3d4a40] bg-[#1a211c] p-6 text-[#bccabd]">Đang tải vé điện tử...</div>}
        {error && <div className="w-full rounded-xl border border-red-400/30 bg-red-950/40 p-6 text-red-100">{error}</div>}

        {!isLoading && !error && (
          <>
            <section className="mt-4 flex flex-col items-center text-center">
              <FiCheckCircle className="mb-4 text-[#59de92]" size={82} />
              <h1 className="text-4xl font-black text-white sm:text-5xl">Đặt vé thành công!</h1>
              <p className="mt-4 max-w-md leading-7 text-[#bccabd]">Mã vé điện tử đã sẵn sàng. Vui lòng lưu mã QR dưới đây để check-in tại sự kiện.</p>
            </section>

            <section className="w-full max-w-[430px] overflow-hidden rounded-xl bg-[#e4e1e6] text-[#1b1b1e] shadow-[0_20px_50px_rgba(32,179,108,0.16)] transition-transform duration-300 hover:scale-[1.01]">
              <div className="relative h-44 bg-[#2f3631]">
                <img alt={event?.name || 'Event banner'} className="h-full w-full object-cover" src={getEventImage(event, 'banner')} />
                <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/80 to-transparent p-4">
                  <span className="rounded-full bg-[#20b36c] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#00210f]">{zoneName}</span>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-black tracking-tight">{event?.name || 'TicketRush Event'}</h2>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <TicketInfo icon={<FiCalendar />} label="Thời gian" value={formatEventDateTime(event?.starts_at)} />
                  <TicketInfo icon={<FiMapPin />} label="Địa điểm" value={event?.venue || 'Đang cập nhật'} />
                </div>
              </div>

              <div className="relative flex h-2 items-center bg-[#e4e1e6]">
                <div className="absolute -left-4 h-8 w-8 rounded-full bg-[#0e1510]" />
                <div className="mx-6 w-full border-t-2 border-dashed border-[#b6b4b8]" />
                <div className="absolute -right-4 h-8 w-8 rounded-full bg-[#0e1510]" />
              </div>

              <div className="flex flex-col items-center gap-4 p-6">
                <div className="grid w-full grid-cols-3 rounded-lg bg-[#dde5dc] p-3 text-center">
                  <StubInfo label="Khu vực" value={zoneName} />
                  <StubInfo label="Số vé" value={String(tickets.length || order?.ticket_count || 1)} />
                  <StubInfo accent label="Ghế" value={seatLabel} />
                </div>

                <TicketQr code={ticketCode} />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#47464a]">Mã vé: {ticketCode}</p>
                {order?.total_amount && <p className="text-sm font-black text-[#006d3e]">{formatCurrency(order.total_amount)}</p>}
              </div>
            </section>

            <section className="grid w-full max-w-[430px] gap-3">
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#20b36c] px-5 py-4 text-sm font-black uppercase tracking-wider text-[#00210f] shadow-[0_0_22px_rgba(32,179,108,0.28)] transition-colors hover:bg-[#59de92]" type="button">
                <FiDownload />
                Tải vé điện tử
              </button>
              <Link className="inline-flex items-center justify-center gap-2 rounded-full border border-[#3d4a40] px-5 py-4 text-sm font-black uppercase tracking-wider text-[#dde5dc] transition-colors hover:border-[#59de92] hover:text-white" to="/">
                <FiHome />
                Quay lại trang chủ
              </Link>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

function TicketInfo({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-[#47464a]">{icon}</span>
      <div>
        <p className="text-xs font-black uppercase text-[#47464a]">{label}</p>
        <p className="mt-1 text-sm font-bold">{value}</p>
      </div>
    </div>
  )
}

function StubInfo({ accent = false, label, value }) {
  return (
    <div className="border-r border-[#b6b4b8] px-2 last:border-r-0">
      <p className="text-xs font-black uppercase text-[#47464a]">{label}</p>
      <p className={`mt-1 text-xl font-black ${accent ? 'text-[#20b36c]' : 'text-[#1b1b1e]'}`}>{value}</p>
    </div>
  )
}

export default BookingSuccessPage
