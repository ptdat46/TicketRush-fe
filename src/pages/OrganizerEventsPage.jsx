import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { api } from '../utils/api'

const CATEGORY_LABELS = {
  music: 'Nhạc sống',
  dj: 'DJ / EDM',
  theater: 'Sân khấu & Nghệ thuật',
  sport: 'Thể thao',
  workshop: 'Hội thảo & Workshop',
  conference: 'Hội nghị',
  comedy: 'Hài kịch',
  family: 'Gia đình',
  other: 'Khác',
}

const STATUS_LABELS = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
}

const STATUS_CLASSES = {
  pending: 'bg-[#2f3631] text-[#bccabd]',
  approved: 'bg-[#59de92]/10 text-[#59de92]',
  rejected: 'bg-red-500/10 text-red-300',
}

const TICKET_STATUS_LABELS = {
  not_started: 'Chưa mở bán',
  on_sale: 'Đang mở bán',
  sold_out: 'Đã bán hết',
  ended: 'Đã kết thúc',
}

function formatDate(value) {
  if (!value) return 'Chưa đặt lịch'
  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function OrganizerEventsPage() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadEvents() {
      setIsLoading(true)
      setError('')

      const response = await api.get('/organizer/events?per_page=50')

      if (!isMounted) return

      if (!response.success) {
        setError(response.error || 'Không thể tải danh sách sự kiện.')
        setIsLoading(false)
        return
      }

      setEvents(Array.isArray(response.data) ? response.data : [])
      setIsLoading(false)
    }

    loadEvents()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0e1510] text-[#dde5dc]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#59de92]">Organizer</p>
            <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">Sự kiện của tôi</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#bccabd]">
              Theo dõi các sự kiện đã tạo, trạng thái duyệt và thông tin bán vé chính.
            </p>
          </div>

          <Link
            className="inline-flex items-center justify-center rounded-full bg-[#59de92] px-5 py-3 text-sm font-bold text-[#00391e] transition hover:brightness-110"
            to="/organizer/create-event"
          >
            Tạo sự kiện mới
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {isLoading && <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-6 text-sm text-[#bccabd]">Đang tải danh sách sự kiện...</div>}

        {!isLoading && events.length === 0 && (
          <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-8 text-center">
            <h2 className="text-xl font-bold text-white">Chưa có sự kiện nào</h2>
            <p className="mt-2 text-sm text-[#bccabd]">Tạo sự kiện đầu tiên để bắt đầu quản lý sơ đồ ghế và thông tin bán vé.</p>
          </div>
        )}

        <div className="space-y-4">
          {events.map((event) => (
            <article key={event.id} className="flex w-full flex-col overflow-hidden rounded-xl border border-[#3d4a40] bg-[#1a211c] md:flex-row">
              <div className="h-44 bg-[#09100b] md:h-auto md:w-64 md:shrink-0">
                {event.thumbnail_url || event.banner_url ? (
                  <img
                    alt={event.name}
                    className="h-full w-full object-cover"
                    src={event.thumbnail_url || event.banner_url}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold uppercase tracking-widest text-[#59de92]">
                    TicketRush
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_CLASSES[event.status] || 'bg-[#2f3631] text-[#bccabd]'}`}>
                        {STATUS_LABELS[event.status] || event.status || 'Chưa rõ'}
                      </span>
                      <span className="rounded-full border border-[#3d4a40] px-3 py-1 text-xs font-semibold text-[#bccabd]">
                        {CATEGORY_LABELS[event.category] || event.category || 'Khác'}
                      </span>
                      <span className="rounded-full border border-[#3d4a40] px-3 py-1 text-xs font-semibold text-[#bccabd]">
                        {TICKET_STATUS_LABELS[event.ticket_sale_status] || 'Chưa rõ trạng thái vé'}
                      </span>
                    </div>
                    <h2 className="truncate text-2xl font-black text-white">{event.name}</h2>
                    <p className="mt-2 line-clamp-2 text-sm text-[#bccabd]">{event.description || 'Chưa có mô tả.'}</p>
                  </div>

                  <Link
                    className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#59de92] px-4 py-2 text-sm font-bold text-[#59de92] transition hover:bg-[#59de92]/10"
                    to={`/organizer/events/${event.id}`}
                  >
                    Xem chi tiết
                  </Link>
                </div>

                <div className="grid gap-3 text-sm text-[#dde5dc] md:grid-cols-3">
                  <div className="rounded-lg bg-[#0e1510] p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#869488]">Địa điểm</p>
                    <p className="mt-1 font-semibold">{event.venue || 'Chưa có'}</p>
                  </div>
                  <div className="rounded-lg bg-[#0e1510] p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#869488]">Bắt đầu</p>
                    <p className="mt-1 font-semibold">{formatDate(event.starts_at)}</p>
                  </div>
                  <div className="rounded-lg bg-[#0e1510] p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#869488]">Sơ đồ</p>
                    <p className="mt-1 font-semibold">
                      {event.display_type === 'stadium' ? 'Sân vận động' : 'Chữ nhật'} · {event.master_width || 0} x {event.master_length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

export default OrganizerEventsPage
