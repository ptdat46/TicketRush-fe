import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import ZoneEditor from '../components/organizer/ZoneEditor'
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
  if (!value) return 'Chưa có'
  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('vi-VN') + ' VND'
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-[#869488]">{label}</p>
      <p className="mt-2 font-bold text-white">{value || 'Chưa có'}</p>
    </div>
  )
}

function OrganizerEventDetailPage() {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [zones, setZones] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDetail() {
      setIsLoading(true)
      setError('')

      const eventResponse = await api.get(`/organizer/events/${eventId}`)

      if (!isMounted) return

      if (!eventResponse.success) {
        setError(eventResponse.error || 'Không thể tải chi tiết sự kiện.')
        setIsLoading(false)
        return
      }

      setEvent(eventResponse.data)

      const zoneResponse = await api.get(`/organizer/events/${eventId}/zones`)
      if (isMounted && zoneResponse.success) {
        setZones(Array.isArray(zoneResponse.data) ? zoneResponse.data : [])
      }

      setIsLoading(false)
    }

    loadDetail()

    return () => {
      isMounted = false
    }
  }, [eventId])

  return (
    <div className="min-h-screen bg-[#0e1510] text-[#dde5dc]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <div className="mb-6">
          <Link className="text-sm font-bold text-[#59de92] hover:underline" to="/organizer/events">
            Quay lại sự kiện của tôi
          </Link>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {isLoading && <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-6 text-sm text-[#bccabd]">Đang tải chi tiết sự kiện...</div>}

        {!isLoading && event && (
          <div className="space-y-8">
            <section className="overflow-hidden rounded-xl border border-[#3d4a40] bg-[#1a211c]">
              <div className="h-64 bg-[#09100b]">
                {event.banner_url || event.thumbnail_url ? (
                  <img alt={event.name} className="h-full w-full object-cover" src={event.banner_url || event.thumbnail_url} />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-bold uppercase tracking-widest text-[#59de92]">
                    TicketRush
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-3 flex flex-wrap gap-2">
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

                <h1 className="text-3xl font-black text-white md:text-4xl">{event.name}</h1>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-[#bccabd]">{event.description || 'Chưa có mô tả.'}</p>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <DetailItem label="Địa điểm" value={event.venue} />
              <DetailItem label="Bắt đầu" value={formatDate(event.starts_at)} />
              <DetailItem label="Kết thúc" value={formatDate(event.ends_at)} />
              <DetailItem
                label="Sơ đồ"
                value={`${event.display_type === 'stadium' ? 'Sân vận động' : 'Chữ nhật'} · ${event.master_width || 0} x ${event.master_length || 0}`}
              />
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#869488]">Trạng thái bán vé</p>
                <p className="mt-2 font-bold text-white">{TICKET_STATUS_LABELS[event.ticket_sale_status] || 'Chưa rõ trạng thái vé'}</p>
              </div>
              <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#869488]">Mở bán</p>
                <p className="mt-2 font-bold text-white">{formatDate(event.ticket_sale_starts_at)}</p>
              </div>
              <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#869488]">Đóng bán</p>
                <p className="mt-2 font-bold text-white">{formatDate(event.ticket_sale_ends_at)}</p>
              </div>
            </section>

            <section className="grid gap-8 xl:grid-cols-12">
              <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-6 xl:col-span-8">
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white">Bản đồ ghế</h2>
                    <p className="mt-1 text-sm text-[#bccabd]">Bản đồ được render lại từ cấu hình sự kiện và danh sách zone.</p>
                  </div>
                  <span className="rounded-full bg-[#0e1510] px-3 py-1 text-xs font-bold text-[#59de92]">
                    {event.master_width || 0} x {event.master_length || 0}
                  </span>
                </div>

                <ZoneEditor
                  displayType={event.display_type || 'rectangular'}
                  length={event.master_length || 1}
                  onBlockToggle={() => {}}
                  readOnly
                  selectedBlocks={[]}
                  width={event.master_width || 1}
                  zones={zones}
                />
              </div>

              <aside className="space-y-4 xl:col-span-4">
                <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-6">
                  <h2 className="text-xl font-black text-white">Thanh toán</h2>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="rounded-lg bg-[#0e1510] p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#869488]">Ngân hàng</p>
                      <p className="mt-1 font-semibold text-white">{event.bank_name || 'Chưa có'}</p>
                    </div>
                    <div className="rounded-lg bg-[#0e1510] p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#869488]">Số tài khoản</p>
                      <p className="mt-1 font-semibold text-white">{event.bank_account_number || 'Chưa có'}</p>
                    </div>
                    <div className="rounded-lg bg-[#0e1510] p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#869488]">Chủ tài khoản</p>
                      <p className="mt-1 font-semibold text-white">{event.bank_account_name || 'Chưa có'}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-white">Zone</h2>
                      <p className="mt-1 text-sm text-[#bccabd]">Màu, giá và kích thước từng khu.</p>
                    </div>
                    <span className="rounded-full bg-[#0e1510] px-3 py-1 text-xs font-bold text-[#59de92]">{zones.length}</span>
                  </div>

                  {zones.length === 0 ? (
                    <p className="rounded-lg bg-[#0e1510] p-4 text-sm text-[#bccabd]">Chưa có zone nào.</p>
                  ) : (
                    <div className="space-y-3">
                      {zones.map((zone) => (
                        <div key={zone.id} className="rounded-lg border border-[#3d4a40] bg-[#0e1510] p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="mt-0.5 h-5 w-5 rounded-full" style={{ backgroundColor: zone.color }} />
                              <div>
                                <p className="font-bold text-white">{zone.name}</p>
                                <p className="mt-1 text-xs text-[#bccabd]">
                                  Vị trí {zone.pos_x}, {zone.pos_y} · {zone.width} x {zone.length}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-[#59de92]">{zone.seats_count || zone.width * zone.length} ghế</span>
                          </div>
                          <p className="mt-3 text-sm font-black text-[#59de92]">{formatCurrency(zone.price)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </aside>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

export default OrganizerEventDetailPage
