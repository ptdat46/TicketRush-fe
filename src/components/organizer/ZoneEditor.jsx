import { useCallback } from 'react'

function ZoneEditor({ zones, selectedBlocks, onBlockToggle, width, length, displayType, readOnly = false }) {
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

  const normalizeStadiumRows = (value) => {
    const rowsValue = Math.max(1, Math.floor(Number(value) || 1))
    return rowsValue % 2 === 1 ? rowsValue : rowsValue + 1
  }

  const normalizeStadiumCols = (value) => {
    const colsValue = Math.max(2, Math.floor(Number(value) || 2))
    return colsValue % 2 === 0 ? colsValue : colsValue + 1
  }

  const cols = displayType === 'stadium' ? normalizeStadiumCols(width || 6) : width || 6
  const rows = displayType === 'stadium' ? normalizeStadiumRows(length || 5) : length || 4

  const getStadiumCenter = () => {
    const startR = Math.floor(rows / 2)
    const startC = Math.floor(cols / 2) - 1
    return { startR, endR: startR + 1, startC, endC: startC + 2 }
  }

  const renderCell = (row, col, extraStyle = {}, extraClass = '') => {
    const zone = getZoneAt(row, col)
    const sel = isSelected(row, col)
    return (
      <button
        key={`${row}-${col}`}
        className={`aspect-square min-w-0 w-full rounded border transition-all ${extraClass} ${
          zone
            ? 'cursor-not-allowed border-transparent text-white'
            : readOnly
              ? 'cursor-default border-[#3d4a40] bg-[#161d18]'
            : sel
              ? 'border-[#59de92] bg-[#59de92]/20'
              : 'border-[#3d4a40] bg-[#161d18] hover:border-[#59de92]'
        }`}
        disabled={Boolean(zone) || readOnly}
        onClick={() => onBlockToggle(row, col)}
        style={{
          ...(zone ? { backgroundColor: `${zone.color}33`, borderColor: zone.color } : {}),
          ...extraStyle,
        }}
        type="button"
      >
        {zone && <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: zone.color }} />}
      </button>
    )
  }

  if (displayType === 'stadium') {
    const center = getStadiumCenter()
    return (
      <div className="flex items-center justify-center overflow-auto rounded-lg bg-[#09100b] p-4">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, width: '100%', maxWidth: `${cols * 44}px` }}
        >
          {Array.from({ length: rows * cols }).map((_, index) => {
            const r = Math.floor(index / cols)
            const c = index % cols
            const isCenter = r >= center.startR && r < center.endR && c >= center.startC && c < center.endC

            if (isCenter) {
              if (r === center.startR && c === center.startC) {
                return (
                  <div
                    key="grass"
                    className="flex items-center justify-center rounded-lg border border-[#59de92]/70 bg-[#59de92]/10 text-[#59de92] shadow-[0_0_18px_rgba(89,222,146,0.12)]"
                    style={{
                      gridColumn: `${center.startC + 1} / ${center.endC + 1}`,
                      gridRow: `${center.startR + 1} / ${center.endR + 1}`,
                    }}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider">Sân cỏ</span>
                  </div>
                )
              }
              return null
            }

            return renderCell(r, c)
          })}
        </div>
      </div>
    )
  }

  // rectangular (default)
  return (
    <div className="flex items-center justify-center overflow-auto rounded-lg bg-[#09100b] p-4">
      <div
        className="flex w-full flex-col items-center gap-5"
        style={{ maxWidth: `${cols * 44}px` }}
      >
        <div className="flex h-12 w-full items-center justify-center rounded border border-[#59de92]/60 bg-[#59de92]/10 text-xs font-bold uppercase tracking-wider text-[#59de92] shadow-[0_0_18px_rgba(89,222,146,0.12)]">
          Sân khấu
        </div>
        <div className="grid w-full gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: rows * cols }).map((_, index) => {
            const r = Math.floor(index / cols)
            const c = index % cols
            return renderCell(r, c)
          })}
        </div>
      </div>
    </div>
  )
}

export default ZoneEditor
