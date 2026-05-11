function HeroCard({ event, featured = false }) {
  return (
    <article className="group relative min-h-[300px] cursor-pointer overflow-hidden rounded-2xl shadow-2xl">
      <img
        alt={event.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        src={event.image}
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 sm:p-8">
        <span className={`mb-4 w-max rounded-full px-3 py-1 text-xs font-bold ${event.badgeClass}`}>{event.badge}</span>
        <h2 className={`${featured ? 'text-4xl sm:text-5xl' : 'text-2xl'} mb-2 font-extrabold leading-tight text-white`}>
          {event.title}
        </h2>
        <p className="mb-6 max-w-md text-zinc-300">{event.description}</p>
        <button className={`w-max rounded-full px-8 py-3 font-bold transition-colors ${event.buttonClass}`} type="button">
          {event.actionLabel}
        </button>
      </div>
    </article>
  )
}

export default HeroCard
