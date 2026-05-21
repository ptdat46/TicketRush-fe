import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FiAlertTriangle, FiCalendar, FiClock, FiCreditCard, FiMapPin, FiRefreshCw, FiShield, FiTag, FiUsers } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../utils/api'
import { formatCurrency, formatEventDateTime, getEventImage } from '../utils/eventDisplay'

function getResponseArray(response) {
  if (!response.success) return []
  if (Array.isArray(response.data)) return response.data
  if (Array.isArray(response.data?.zones)) return response.data.zones
  return []
}

function rowLabel(index) {
  const normalized = Number(index || 0)
  return String.fromCharCode(65 + (normalized % 26))
}

function normalizeSeat(seat, zone) {
  return {
    ...seat,
    zone,
    zone_id: seat.zone_id || zone.id,
    row_index: Number(seat.row_index || 0),
    col_index: Number(seat.col_index || 0),
  }
}

function buildGeneratedSeats(zone) {
  const width = Number(zone.width || 1)
  const length = Number(zone.length || 1)
  const zoneSeed = Number(zone.id) || 9000

  return Array.from({ length: width * length }, (_, index) => ({
    id: zoneSeed * 10000 + index,
    row_index: Math.floor(index / width),
    col_index: index % width,
    status: 'available',
  }))
}

function normalizeZones(zones) {
  return zones
    .filter((zone) => zone.is_seating !== false)
    .map((zone) => {
      const seats = Array.isArray(zone.seats) && zone.seats.length > 0 ? zone.seats : buildGeneratedSeats(zone)
      return {
        ...zone,
        price: Number(zone.price || 0),
        color: zone.color || '#59de92',
        seats: seats.map((seat) => normalizeSeat(seat, zone)),
      }
    })
}

function getSeatLabel(seat) {
  return `${rowLabel(seat.row_index)}${Number(seat.col_index || 0) + 1}`
}

function WaitingRoomView({ event, entry, isJoining, onRefresh }) {
  const estimatedMinutes = Math.max(1, Math.ceil(Number(entry?.estimated_wait_seconds || 0) / 60))
  const position = entry?.position ?? (entry?.people_ahead !== undefined ? Number(entry.people_ahead) + 1 : 0)

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col bg-[#0e1510] text-[#dde5dc]">
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-10">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="h-96 w-96 rounded-full bg-[#20b36c] blur-[100px]" />
        </div>

        <section className="relative z-10 flex w-full max-w-md flex-col items-center gap-8 text-center">
          <div className="relative mb-2 flex h-32 w-32 items-center justify-center">
            <div className="queue-pulse-ring absolute inset-0 rounded-full bg-[#20b36c]/20" />
            <div className="absolute h-24 w-24 animate-spin rounded-full border-4 border-[#59de92]/30 border-t-[#59de92]" />
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-[#2f3631] bg-[#1a211c] text-[#59de92]">
              <FiClock size={30} />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#59de92]">{event?.name || 'TicketRush'}</p>
            <h1 className="text-2xl font-black text-white">Bạn đang trong hàng chờ</h1>
            <p className="mt-3 leading-7 text-[#bccabd]">Vé sự kiện đang được mở bán. Vui lòng giữ nguyên trang web này để hệ thống tự động chuyển bạn vào sơ đồ chọn ghế.</p>
          </div>

          <div className="relative w-full overflow-hidden rounded-xl border border-[#2f3631] bg-[#1a211c] p-6 shadow-[0_4px_24px_rgba(32,179,108,0.08)]">
            <div className="absolute left-0 top-0 h-1 w-full bg-linear-to-r from-[#2f3631] via-[#59de92] to-[#2f3631] opacity-70" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bccabd]">Vị trí của bạn trong hàng đợi</p>
            <div className="mt-3 text-6xl font-black text-[#59de92] drop-shadow-[0_0_18px_rgba(32,179,108,0.4)]">
              {isJoining ? '...' : position || 0}
            </div>
            <p className="mt-3 text-sm text-[#bccabd]">
              Dự kiến thời gian chờ: <span className="font-bold text-white">~{estimatedMinutes} phút</span>
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
              <QueueStat label="Đang chờ" value={entry?.waiting_count ?? 0} />
              <QueueStat label="Đang mua" value={entry?.active_count ?? 0} />
              <QueueStat label="Sức chứa" value={entry?.capacity ?? 0} />
            </div>
          </div>

          <div className="flex w-full items-start gap-4 rounded-xl border border-[#ff5a36] bg-[#3d1911] p-4 text-left shadow-[0_0_20px_rgba(255,90,54,0.1)]">
            <FiAlertTriangle className="mt-1 shrink-0 text-[#ff8a70]" size={22} />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#ffb4a9]">Cảnh báo quan trọng</h2>
              <p className="mt-2 text-sm leading-6 text-[#ffd4ce]">Không tải lại trang hoặc đóng trình duyệt. Tải lại trang có thể khiến bạn mất vị trí hiện tại trong hàng chờ.</p>
            </div>
          </div>

          <button className="inline-flex items-center gap-2 rounded-full border border-[#3d4a40] px-5 py-2.5 text-sm font-bold text-[#bccabd] transition-colors hover:border-[#59de92] hover:text-white" onClick={onRefresh} type="button">
            <FiRefreshCw />
            Cập nhật trạng thái
          </button>
        </section>
      </main>
    </div>
  )
}

function QueueStat({ label, value }) {
  return (
    <div className="rounded-lg bg-[#0e1510] px-3 py-2">
      <p className="font-black text-white">{value}</p>
      <p className="mt-1 text-[#869488]">{label}</p>
    </div>
  )
}

function SeatButton({ isSelected, onClick, seat }) {
  const isUnavailable = seat.status === 'sold' || seat.status === 'locked'
  const baseLabel = getSeatLabel(seat)
  const statusClass = isSelected
    ? 'border-[#59de92] bg-[#20b36c] text-[#00210f] shadow-[0_0_14px_rgba(32,179,108,0.35)]'
    : seat.status === 'sold'
      ? 'cursor-not-allowed border-red-500/20 bg-red-950/70 text-red-200'
      : seat.status === 'locked'
        ? 'cursor-not-allowed border-amber-500/30 bg-amber-500/15 text-amber-200'
        : 'border-[#3d4a40] bg-[#161d18] text-[#bccabd] hover:border-[#59de92] hover:bg-[#1a211c] hover:text-white'

  return (
    <button
      aria-label={`Ghế ${baseLabel}`}
      className={`flex aspect-square min-h-8 min-w-8 items-center justify-center rounded text-[10px] font-black transition-all ${statusClass}`}
      disabled={isUnavailable && !isSelected}
      onClick={() => onClick(seat)}
      type="button"
    >
      {baseLabel}
    </button>
  )
}

function SeatZone({ onSeatToggle, selectedSeatIds, zone }) {
  const width = Math.max(1, Number(zone.width || Math.max(...zone.seats.map((seat) => Number(seat.col_index || 0) + 1), 1)))

  return (
    <article className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full shadow-[0_0_12px_rgba(89,222,146,0.35)]" style={{ backgroundColor: zone.color }} />
          <div>
            <h3 className="font-black text-white">{zone.name}</h3>
            <p className="mt-1 text-xs font-bold text-[#59de92]">{formatCurrency(zone.price)}</p>
          </div>
        </div>
        <span className="rounded-full bg-[#0e1510] px-3 py-1 text-xs font-bold text-[#bccabd]">{zone.seats.length} ghế</span>
      </div>

      <div className="overflow-auto rounded-lg bg-[#09100b] p-3">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${width}, minmax(32px, 1fr))` }}>
          {zone.seats.map((seat) => (
            <SeatButton
              isSelected={selectedSeatIds.has(seat.id)}
              key={seat.id}
              onClick={onSeatToggle}
              seat={seat}
            />
          ))}
        </div>
      </div>
    </article>
  )
}

function BookingView({ event, mapError, onCheckout, onLockSeats, onSeatToggle, selectedSeats, selectedSeatIds, zones, isBusy }) {
  const total = selectedSeats.reduce((sum, seat) => sum + Number(seat.zone?.price || 0), 0)
  const selectedLocked = selectedSeats.length > 0 && selectedSeats.every((seat) => seat.status === 'locked')
  const hasSeatMap = zones.length > 0

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0e1510] text-[#dde5dc]">
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_380px] lg:px-8">
        <section className="min-w-0 space-y-5">
          <div className="overflow-hidden rounded-xl border border-[#3d4a40] bg-[#1a211c]">
            <div className="relative h-56">
              <img alt={event?.name || 'Sự kiện'} className="h-full w-full object-cover" src={getEventImage(event, 'banner')} />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#59de92]">Chọn ghế</p>
                <h1 className="mt-2 text-3xl font-black text-white">{event?.name || 'Đặt vé sự kiện'}</h1>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#dde5dc]">
                  <span className="inline-flex items-center gap-2"><FiCalendar />{formatEventDateTime(event?.starts_at)}</span>
                  <span className="inline-flex items-center gap-2"><FiMapPin />{event?.venue || 'Đang cập nhật địa điểm'}</span>
                </div>
              </div>
            </div>
          </div>

          {mapError && (
            <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
              {mapError}
            </div>
          )}

          <div className="rounded-xl border border-[#3d4a40] bg-[#101711] p-4">
            <div className="mb-5 flex h-14 items-center justify-center rounded-lg border border-[#59de92]/50 bg-[#59de92]/10 text-xs font-black uppercase tracking-[0.22em] text-[#59de92] shadow-[0_0_18px_rgba(89,222,146,0.12)]">
              Sân khấu
            </div>
            {hasSeatMap ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {zones.map((zone) => (
                  <SeatZone
                    key={zone.id}
                    onSeatToggle={onSeatToggle}
                    selectedSeatIds={selectedSeatIds}
                    zone={zone}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[#3d4a40] bg-[#09100b] p-8 text-center">
                <p className="text-lg font-black text-white">Chưa có dữ liệu sơ đồ ghế</p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#bccabd]">
                  FE đã vào được phiên booking, nhưng backend chưa trả danh sách zone và seat cho customer. Khi có endpoint seat map, khu vực này sẽ render ghế thật và cho phép giữ ghế.
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#869488]">Phiên giữ ghế</p>
                <h2 className="mt-1 text-xl font-black text-white">Thanh toán</h2>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#20b36c] text-[#00210f]">
                <FiTag size={22} />
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <Legend color="bg-[#161d18] border-[#3d4a40]" label="Trống" />
              <Legend color="bg-[#20b36c] border-[#59de92]" label="Đã chọn" />
              <Legend color="bg-red-950 border-red-500/30" label="Đã bán" />
            </div>

            <div className="mt-5 space-y-3">
              {selectedSeats.length === 0 ? (
                <p className="rounded-lg bg-[#0e1510] p-4 text-sm text-[#bccabd]">Chọn tối đa 10 ghế còn trống trên sơ đồ để bắt đầu giữ chỗ.</p>
              ) : (
                selectedSeats.map((seat) => (
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-[#3d4a40] bg-[#0e1510] p-3" key={seat.id}>
                    <div>
                      <p className="font-bold text-white">{seat.zone?.name} - Ghế {getSeatLabel(seat)}</p>
                      <p className="mt-1 text-xs text-[#bccabd]">{seat.status === 'locked' ? 'Đã giữ trong phiên của bạn' : 'Chưa giữ'}</p>
                    </div>
                    <span className="text-sm font-black text-[#59de92]">{formatCurrency(seat.zone?.price)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 border-t border-[#3d4a40] pt-5">
              <div className="flex items-center justify-between text-sm text-[#bccabd]">
                <span>Tạm tính</span>
                <span className="font-black text-white">{formatCurrency(total)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-[#869488]">
                <span>Phương thức</span>
                <span>Mock payment</span>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#59de92]/40 bg-[#2f3631] px-5 py-3 text-sm font-black text-[#78fcac] transition-colors hover:bg-[#343b35] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isBusy || !hasSeatMap || selectedSeats.length === 0 || selectedLocked}
                onClick={onLockSeats}
                type="button"
              >
                <FiShield />
                Giữ ghế 10 phút
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#20b36c] px-5 py-3 text-sm font-black text-[#00210f] shadow-[0_0_22px_rgba(32,179,108,0.28)] transition-colors hover:bg-[#59de92] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isBusy || !hasSeatMap || selectedSeats.length === 0 || !selectedLocked}
                onClick={onCheckout}
                type="button"
              >
                <FiCreditCard />
                Thanh toán
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-5 text-sm leading-6 text-[#bccabd]">
            <div className="mb-3 flex items-center gap-2 font-bold text-white">
              <FiUsers className="text-[#59de92]" />
              Lượt mua vé đang hoạt động
            </div>
            Ghế chỉ được giữ sau khi API lock thành công. Nếu ghế vừa bị người khác giữ, hệ thống sẽ báo và bạn có thể chọn ghế khác ngay trên sơ đồ.
          </div>
        </aside>
      </main>
    </div>
  )
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#0e1510] px-2 py-2 text-[#bccabd]">
      <span className={`h-3 w-3 rounded border ${color}`} />
      <span>{label}</span>
    </div>
  )
}

function BookingPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [entry, setEntry] = useState(null)
  const [phase, setPhase] = useState('waiting')
  const [zones, setZones] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [isJoining, setIsJoining] = useState(true)
  const [isBusy, setIsBusy] = useState(false)
  const [mapError, setMapError] = useState('')

  const selectedSeatIds = useMemo(() => new Set(selectedSeats.map((seat) => seat.id)), [selectedSeats])

  const loadSeatMap = useCallback(async () => {
    const endpoints = [
      `/customer/events/${eventId}/seat-map`,
      `/events/${eventId}/seat-map`,
      `/events/${eventId}/zones`,
      `/customer/events/${eventId}/zones`,
    ]

    for (const endpoint of endpoints) {
      const response = await api.get(endpoint)
      const responseZones = getResponseArray(response)

      if (responseZones.length > 0) {
        setZones(normalizeZones(responseZones))
        setMapError('')
        return
      }
    }

    setZones([])
    setMapError('Chưa lấy được seat grid từ API. Theo api-doc hiện tại mới có API waiting room, lock ghế và checkout cho customer; endpoint trả zones + seats cho customer chưa được mô tả hoặc chưa mở quyền.')
  }, [eventId])

  const refreshWaitingRoom = useCallback(async ({ silent = false } = {}) => {
    const response = await api.get(`/customer/events/${eventId}/waiting-room`)

    if (!response.success) {
      if (!silent) toast.error(response.error || 'Không thể cập nhật phòng chờ.')
      return
    }

    setEntry(response.data)
    if (response.data?.can_enter_booking) {
      setPhase('booking')
      loadSeatMap()
    } else {
      setPhase('waiting')
    }
  }, [eventId, loadSeatMap])

  useEffect(() => {
    let isMounted = true

    async function boot() {
      setIsJoining(true)

      const [eventResponse, waitingResponse] = await Promise.all([
        api.get(`/events/${eventId}`),
        api.post(`/customer/events/${eventId}/waiting-room`),
      ])

      if (!isMounted) return

      if (eventResponse.success) {
        setEvent(eventResponse.data)
      }

      if (!waitingResponse.success) {
        toast.error(waitingResponse.error || 'Không thể vào phòng chờ.')
        setIsJoining(false)
        return
      }

      setEntry(waitingResponse.data)
      if (waitingResponse.data?.can_enter_booking) {
        setPhase('booking')
        loadSeatMap()
      }

      setIsJoining(false)
    }

    boot()

    return () => {
      isMounted = false
    }
  }, [eventId, loadSeatMap])

  useEffect(() => {
    const seconds = Math.max(3, Number(entry?.poll_after_seconds || 5))
    const timer = window.setInterval(() => {
      refreshWaitingRoom({ silent: true })
    }, seconds * 1000)

    return () => window.clearInterval(timer)
  }, [entry?.poll_after_seconds, refreshWaitingRoom])

  useEffect(() => {
    if (!window.Echo || !user?.id) return undefined

    const summaryChannel = window.Echo.private(`events.${eventId}.waiting-room`)
    const entryChannel = window.Echo.private(`events.${eventId}.customers.${user.id}.waiting-room`)

    summaryChannel.listen('.waiting-room.summary.updated', (payload) => {
      setEntry((current) => ({ ...current, ...payload }))
    })

    entryChannel.listen('.waiting-room.entry.updated', (payload) => {
      setEntry(payload)
      if (payload?.can_enter_booking) {
        setPhase('booking')
        loadSeatMap()
      }
    })

    return () => {
      window.Echo.leave(`events.${eventId}.waiting-room`)
      window.Echo.leave(`events.${eventId}.customers.${user.id}.waiting-room`)
    }
  }, [eventId, loadSeatMap, user?.id])

  const patchSeats = (updatedSeats) => {
    setZones((currentZones) => currentZones.map((zone) => ({
      ...zone,
      seats: zone.seats.map((seat) => {
        const updated = updatedSeats.find((item) => item.id === seat.id)
        return updated ? normalizeSeat({ ...seat, ...updated }, zone) : seat
      }),
    })))
    setSelectedSeats((currentSeats) => currentSeats.map((seat) => {
      const updated = updatedSeats.find((item) => item.id === seat.id)
      return updated ? { ...seat, ...updated, zone: seat.zone } : seat
    }))
  }

  const handleSeatToggle = (seat) => {
    setSelectedSeats((currentSeats) => {
      if (currentSeats.some((item) => item.id === seat.id)) {
        return currentSeats.filter((item) => item.id !== seat.id)
      }

      if (currentSeats.length >= 10) {
        toast.error('Bạn chỉ có thể chọn tối đa 10 ghế.')
        return currentSeats
      }

      return [...currentSeats, seat]
    })
  }

  const handleLockSeats = async () => {
    setIsBusy(true)
    const response = await api.post(`/customer/events/${eventId}/seats/lock`, {
      seat_ids: selectedSeats.map((seat) => seat.id),
    })
    setIsBusy(false)

    if (!response.success) {
      toast.error(response.error || 'Không thể giữ ghế đã chọn.')
      return
    }

    patchSeats(response.data || [])
    toast.success('Ghế đã được giữ trong 10 phút.')
  }

  const handleCheckout = async () => {
    setIsBusy(true)
    const response = await api.post(`/customer/events/${eventId}/orders`, {
      seat_ids: selectedSeats.map((seat) => seat.id),
      payment_method: 'mock',
      payment_reference: `MOCK-FE-${Date.now()}`,
    })
    setIsBusy(false)

    if (!response.success) {
      toast.error(response.error || 'Thanh toán chưa hoàn tất.')
      return
    }

    toast.success('Đặt vé thành công.')
    navigate(`/orders/${response.data.id}/success`, {
      state: {
        event,
        order: response.data,
        selectedSeats,
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#0e1510] text-[#dde5dc]">
      <Header />
      {phase === 'waiting' ? (
        <WaitingRoomView event={event} entry={entry} isJoining={isJoining} onRefresh={() => refreshWaitingRoom()} />
      ) : (
        <BookingView
          event={event}
          isBusy={isBusy}
          mapError={mapError}
          onCheckout={handleCheckout}
          onLockSeats={handleLockSeats}
          onSeatToggle={handleSeatToggle}
          selectedSeatIds={selectedSeatIds}
          selectedSeats={selectedSeats}
          zones={zones}
        />
      )}
    </div>
  )
}

export default BookingPage
