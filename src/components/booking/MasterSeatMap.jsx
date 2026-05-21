import { getSeatLabel } from '../../utils/seatMap'

function findZoneAt(zones, row, col) {
  return zones.find((zone) => {
    const zoneRow = Number(zone.pos_y || 0)
    const zoneCol = Number(zone.pos_x || 0)
    const zoneLength = Number(zone.length || 0)
    const zoneWidth = Number(zone.width || 0)
    return row >= zoneRow && row < zoneRow + zoneLength && col >= zoneCol && col < zoneCol + zoneWidth
  })
}

function findSeatAt(zone, row, col) {
  if (!zone) return null
  const localRow = row - Number(zone.pos_y || 0)
  const localCol = col - Number(zone.pos_x || 0)
  return zone.seats.find((seat) => Number(seat.row_index || 0) === localRow && Number(seat.col_index || 0) === localCol)
}

function getSeatVisual(seat, zone, isSelected) {
  if (isSelected) {
    return {
      className: 'border-[#59de92] bg-[#20b36c] shadow-[0_0_12px_rgba(32,179,108,0.35)]',
      style: undefined,
      dotColor: '#00210f',
    }
  }
  if (seat.status === 'sold') {
    return {
      className: 'cursor-not-allowed border-red-500/40 bg-red-950/70',
      style: undefined,
      dotColor: '#fca5a5',
    }
  }
  if (seat.status === 'locked') {
    return {
      className: 'cursor-not-allowed border-amber-500/40 bg-amber-500/15',
      style: undefined,
      dotColor: '#fcd34d',
    }
  }
  return {
    className: 'hover:brightness-150',
    style: { backgroundColor: `${zone.color}1F`, borderColor: `${zone.color}66` },
    dotColor: zone.color,
  }
}

function MasterSeatCell({ seat, zone, isSelected, onClick }) {
  const isUnavailable = seat.status === 'sold' || seat.status === 'locked'
  const { className, style, dotColor } = getSeatVisual(seat, zone, isSelected)

  return (
    <button
      aria-label={`Ghế ${getSeatLabel(seat)} - ${zone.name}`}
      className={`flex aspect-square min-w-0 w-full items-center justify-center rounded border transition-all ${className}`}
      disabled={isUnavailable && !isSelected}
      onClick={() => onClick(seat)}
      style={style}
      title={`${zone.name} - ${getSeatLabel(seat)}`}
      type="button"
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
    </button>
  )
}

function EmptyCell() {
  return <div className="aspect-square min-w-0 w-full rounded border border-transparent" />
}

function MasterSeatMap({ zones, masterWidth, masterLength, selectedSeatIds, onSeatToggle }) {
  const cols = Math.max(1, masterWidth)
  const rows = Math.max(1, masterLength)

  return (
    <div className="flex items-center justify-center overflow-auto rounded-lg bg-[#09100b] p-4">
      <div className="flex w-full flex-col items-center gap-5" style={{ maxWidth: `${cols * 44}px` }}>
        <div className="flex h-12 w-full items-center justify-center rounded border border-[#59de92]/60 bg-[#59de92]/10 text-xs font-bold uppercase tracking-wider text-[#59de92] shadow-[0_0_18px_rgba(89,222,146,0.12)]">
          Sân khấu
        </div>

        <div className="grid w-full gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: rows * cols }).map((_, index) => {
            const row = Math.floor(index / cols)
            const col = index % cols
            const zone = findZoneAt(zones, row, col)
            const seat = findSeatAt(zone, row, col)

            if (!zone || !seat) {
              return <EmptyCell key={`${row}-${col}`} />
            }

            return (
              <MasterSeatCell
                isSelected={selectedSeatIds.has(seat.id)}
                key={seat.id}
                onClick={onSeatToggle}
                seat={seat}
                zone={zone}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MasterSeatMap
