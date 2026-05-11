import { FiCalendar, FiMapPin } from 'react-icons/fi'
import { formatEventDateTime, getEventImage, getTicketBadge } from '../utils/eventDisplay'

function EventCard({ event }) {
  const badge = getTicketBadge(event)
  const isUnavailable = event.ticket_sale_status === 'sold_out' || event.ticket_sale_status === 'ended' || event.is_sold_out

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-xl border border-[#3d4a40] bg-[#252c26] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#20b36c]/50 hover:bg-[#343b35] hover:shadow-[0_8px_30px_rgba(32,179,108,0.15)] ${isUnavailable ? 'opacity-80' : ''}`}>
      <div className={`relative aspect-[4/3] overflow-hidden ${isUnavailable ? 'grayscale' : ''}`}>
        <img
          alt={event.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={getEventImage(event)}
        />

        <div className={`absolute left-3 top-3 rounded-md border px-2.5 py-1 text-xs font-bold backdrop-blur-md ${badge.className}`}>
          {badge.text}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h4 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-white">{event.name}</h4>

        <div className="mb-4 mt-auto space-y-2 text-sm text-[#bccabd]">
          <div className="flex items-center gap-2">
            <FiCalendar className="shrink-0 opacity-70" />
            <span>{formatEventDateTime(event.starts_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin className="shrink-0 opacity-70" />
            <span>{event.venue || 'Chưa cập nhật địa điểm'}</span>
          </div>
        </div>

        <button
          className={`mt-auto w-full rounded-lg border py-2.5 font-bold transition-colors ${
            isUnavailable
              ? 'cursor-not-allowed border-[#3d4a40] bg-[#161d18] text-[#bccabd]'
              : 'border-[#20b36c]/20 bg-[#2f3631] text-[#78fcac] group-hover:bg-[#20b36c] group-hover:text-black'
          }`}
          disabled={isUnavailable}
          type="button"
        >
          {badge.text}
        </button>
      </div>
    </article>
  )
}

export default EventCard
