import { FiCheckCircle, FiEdit3, FiStar, FiXCircle } from 'react-icons/fi'
import { EVENT_CATEGORY_LABELS, EVENT_STATUS_CLASSES, EVENT_STATUS_LABELS, TICKET_STATUS_LABELS, formatEventDateTime, getDisplayTypeLabel, getEventImage } from '../../utils/eventDisplay'

function EventMeta({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold uppercase tracking-wider text-[#869488]">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-[#dde5dc]">{value || 'Chưa có'}</p>
    </div>
  )
}

function AdminEventCard({ event, isUpdating, onEdit, onHomepageChange, onReview }) {
  const canReview = event.status === 'pending'
  const availableSeats = event.available_seats_count ?? 0
  const seatsCount = event.seats_count ?? 0
  const organizerName = event.organizer?.organizer_name || event.organizer?.name

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-xl border border-[#3d4a40] bg-[#1a211c] lg:flex-row">
      <div className="h-48 bg-[#09100b] lg:h-auto lg:w-72 lg:shrink-0">
        <img alt={event.name} className="h-full w-full object-cover" src={getEventImage(event)} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-5 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${EVENT_STATUS_CLASSES[event.status] || 'bg-[#2f3631] text-[#bccabd]'}`}>
                {EVENT_STATUS_LABELS[event.status] || event.status || 'Chưa rõ'}
              </span>
              <span className="rounded-full border border-[#3d4a40] px-3 py-1 text-xs font-semibold text-[#bccabd]">
                {EVENT_CATEGORY_LABELS[event.category] || event.category || 'Khác'}
              </span>
              <span className="rounded-full border border-[#3d4a40] px-3 py-1 text-xs font-semibold text-[#bccabd]">
                {TICKET_STATUS_LABELS[event.ticket_sale_status] || 'Chưa rõ trạng thái vé'}
              </span>
              {event.is_featured && <span className="rounded-full bg-[#59de92]/10 px-3 py-1 text-xs font-bold text-[#59de92]">Featured</span>}
              {event.is_special && <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-200">Special</span>}
            </div>

            <h2 className="truncate text-2xl font-black text-white">{event.name}</h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#bccabd]">{event.description || 'Chưa có mô tả.'}</p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#3d4a40] px-4 py-2 text-sm font-bold text-[#dde5dc] transition hover:border-[#59de92] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isUpdating}
              onClick={() => onEdit(event)}
              type="button"
            >
              <FiEdit3 />
              Sửa
            </button>
            {canReview && (
              <>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#59de92] px-4 py-2 text-sm font-bold text-[#00391e] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isUpdating}
                  onClick={() => onReview(event.id, 'approved')}
                  type="button"
                >
                  <FiCheckCircle />
                  Duyệt
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isUpdating}
                  onClick={() => onReview(event.id, 'rejected')}
                  type="button"
                >
                  <FiXCircle />
                  Từ chối
                </button>
              </>
            )}
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#59de92]/50 px-4 py-2 text-sm font-bold text-[#59de92] transition hover:bg-[#59de92]/10 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isUpdating}
              onClick={() => onHomepageChange(event.id, { is_special: !event.is_special })}
              type="button"
            >
              <FiStar />
              {event.is_special ? 'Bỏ special' : 'Special'}
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <EventMeta label="Organizer" value={organizerName} />
          <EventMeta label="Địa điểm" value={event.venue} />
          <EventMeta label="Bắt đầu" value={formatEventDateTime(event.starts_at)} />
          <EventMeta label="Sơ đồ" value={`${getDisplayTypeLabel(event.display_type)} · ${event.zones_count ?? 0} zone`} />
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#3d4a40] pt-4 text-sm text-[#bccabd]">
          <span>
            Ghế còn trống: <strong className="text-white">{availableSeats}</strong> / {seatsCount}
          </span>
          <span>
            Thứ tự hiển thị: <strong className="text-white">{event.sort_order ?? 0}</strong>
          </span>
          <span>
            Mở bán: <strong className="text-white">{formatEventDateTime(event.ticket_sale_starts_at)}</strong>
          </span>
        </div>
      </div>
    </article>
  )
}

export default AdminEventCard
