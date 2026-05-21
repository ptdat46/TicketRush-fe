import { formatCurrency } from '../../utils/eventDisplay'
import { getSeatLabel } from '../../utils/seatMap'

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
  const width = Math.max(
    1,
    Number(zone.width || Math.max(...zone.seats.map((seat) => Number(seat.col_index || 0) + 1), 1)),
  )

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

export default SeatZone
