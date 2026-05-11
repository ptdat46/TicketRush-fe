import { FiCalendar, FiMapPin } from 'react-icons/fi'

function EventCard({ event }) {
  const isSoldOut = event.status === 'sold-out'

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-xl border border-[#3d4a40] bg-[#252c26] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#20b36c]/50 hover:bg-[#343b35] hover:shadow-[0_8px_30px_rgba(32,179,108,0.15)] ${isSoldOut ? 'opacity-70' : ''}`}>
      <div className={`relative aspect-[4/3] overflow-hidden ${isSoldOut ? 'grayscale' : ''}`}>
        <img
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={event.image}
        />

        {event.badge && !isSoldOut && (
          <div className={`absolute left-3 top-3 rounded-md border px-2.5 py-1 text-xs font-bold backdrop-blur-md ${event.badgeClass}`}>
            {event.badge}
          </div>
        )}

        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="rounded-lg border border-zinc-700 bg-black/80 px-4 py-2 font-bold text-white">Đã Hết Vé</div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h4 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-white">{event.title}</h4>

        <div className="mb-4 mt-auto space-y-2 text-sm text-[#bccabd]">
          <div className="flex items-center gap-2">
            <FiCalendar className="shrink-0 opacity-70" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin className="shrink-0 opacity-70" />
            <span>{event.location}</span>
          </div>
        </div>

        <button
          className={`mt-auto w-full rounded-lg border py-2.5 font-bold transition-colors ${
            isSoldOut
              ? 'cursor-not-allowed border-[#3d4a40] bg-[#161d18] text-[#bccabd]'
              : 'border-[#20b36c]/20 bg-[#2f3631] text-[#78fcac] group-hover:bg-[#20b36c] group-hover:text-black'
          }`}
          disabled={isSoldOut}
          type="button"
        >
          {isSoldOut ? 'Hết vé' : 'Mua vé'}
        </button>
      </div>
    </article>
  )
}

export default EventCard
