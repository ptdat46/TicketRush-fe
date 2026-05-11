import { Link } from 'react-router-dom'
import EventCard from './EventCard'

function EventSection({ activeCategory, events = [], limit, showViewAll = false, title }) {
  const visibleEvents = typeof limit === 'number' ? events.slice(0, limit) : events
  const viewAllUrl = activeCategory ? `/events?category=${activeCategory}` : '/events'

  if (!visibleEvents.length) {
    return null
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h3 className="text-2xl font-extrabold text-white sm:text-3xl">{title}</h3>
        {showViewAll && (
          <Link className="flex items-center gap-1 font-semibold text-[#78fcac] transition-colors hover:text-[#59de92]" to={viewAllUrl}>
            Xem tất cả <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleEvents.map((event) => (
          <EventCard event={event} key={event.id || event.name} />
        ))}
      </div>
    </section>
  )
}

export default EventSection
