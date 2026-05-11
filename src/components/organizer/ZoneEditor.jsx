import { useCallback } from 'react'

function ZoneEditor({ zones, selectedBlocks, onBlockToggle, width, length }) {
  const getZoneAt = useCallback(
    (row, col) => {
      return zones.find((z) => {
        const zRow = z.pos_y
        const zCol = z.pos_x
        return row >= zRow && row < zRow + z.length && col >= zCol && col < zCol + z.width
      })
    },
    [zones]
  )

  const isSelected = (row, col) => selectedBlocks.some((b) => b.row === row && b.col === col)

  const gridCols = width || 6
  const gridRows = length || 4

  return (
    <div className="flex items-center justify-center overflow-auto rounded-lg bg-[#09100b] p-6">
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: gridRows * gridCols }).map((_, index) => {
          const row = Math.floor(index / gridCols)
          const col = index % gridCols
          const zone = getZoneAt(row, col)
          const sel = isSelected(row, col)

          return (
            <button
              key={`${row}-${col}`}
              className={`flex h-10 w-10 items-center justify-center rounded border transition-all sm:h-12 sm:w-12 ${
                zone
                  ? 'border-transparent text-white'
                  : sel
                    ? 'border-[#59de92] bg-[#59de92]/20'
                    : 'border-[#3d4a40] bg-[#161d18] hover:border-[#59de92]'
              }`}
              onClick={() => onBlockToggle(row, col)}
              style={zone ? { backgroundColor: `${zone.color}33`, borderColor: zone.color } : {}}
              type="button"
            >
              {zone && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: zone.color }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ZoneEditor
