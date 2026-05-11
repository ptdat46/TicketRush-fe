import { getEventImage, getTicketBadge } from '../utils/eventDisplay'

function HeroCard({ event, featured = false }) {
  const badge = getTicketBadge(event)

  return (
    <article className="group relative min-h-[300px] cursor-pointer overflow-hidden rounded-2xl shadow-2xl">
      <img
        alt={event.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        src={getEventImage(event, 'banner')}
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/90 via-black/40 to-transparent p-6 sm:p-8">
        <span className={`mb-4 w-max rounded-full border px-3 py-1 text-xs font-bold ${badge.className}`}>{badge.text}</span>
        <h2 className={`${featured ? 'text-4xl sm:text-5xl' : 'text-2xl'} mb-2 font-extrabold leading-tight text-white`}>
          {event.name}
        </h2>
        <p className="mb-6 max-w-md text-zinc-300">{event.description}</p>
        <button className="w-max rounded-full bg-[#20b36c] px-8 py-3 font-bold text-black shadow-[0_0_20px_rgba(32,179,108,0.3)] transition-colors hover:bg-[#78fcac]" type="button">
          {badge.text}
        </button>
      </div>
    </article>
  )
}

export default HeroCard
