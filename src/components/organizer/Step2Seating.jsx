import { useState } from 'react'
import ZoneEditor from './ZoneEditor'
import ZoneForm from './ZoneForm'

const SHAPES = [
  { key: 'rectangular', label: 'Rectangle', icon: 'crop_square' },
  { key: 'arc', label: 'Arc', icon: 'panorama_horizontal' },
  { key: 'stadium', label: 'Stadium', icon: 'stadium' },
]

function Step2Seating({ data, onChange }) {
  const [selectedBlocks, setSelectedBlocks] = useState([])
  const [activeZoneIndex, setActiveZoneIndex] = useState(null)

  const handleBlockToggle = (row, col) => {
    if (activeZoneIndex === null) return
    const exists = selectedBlocks.some((b) => b.row === row && b.col === col)
    if (exists) {
      setSelectedBlocks(selectedBlocks.filter((b) => !(b.row === row && b.col === col)))
    } else {
      setSelectedBlocks([...selectedBlocks, { row, col }])
    }
  }

  const handleAddZone = (zone) => {
    if (selectedBlocks.length === 0) return
    const rows = selectedBlocks.map((b) => b.row)
    const cols = selectedBlocks.map((b) => b.col)
    const minRow = Math.min(...rows)
    const maxRow = Math.max(...rows)
    const minCol = Math.min(...cols)
    const maxCol = Math.max(...cols)

    const newZone = {
      ...zone,
      pos_x: minCol,
      pos_y: minRow,
      width: maxCol - minCol + 1,
      length: maxRow - minRow + 1,
      is_seating: true,
    }

    const zones = [...(data.zones || []), newZone]
    onChange('zones', zones)
    setSelectedBlocks([])
    setActiveZoneIndex(null)
  }

  const removeZone = (index) => {
    const zones = (data.zones || []).filter((_, i) => i !== index)
    onChange('zones', zones)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#3d4a40] pb-4">
        <div className="mb-2 flex items-center gap-2 text-[#59de92]">
          <span className="text-xs font-semibold uppercase tracking-widest">Buoc 2 Cau hinh</span>
        </div>
        <h1 className="text-4xl font-extrabold text-[#dde5dc]">Time & Seating Plan</h1>
        <p className="mt-2 max-w-2xl text-base text-[#bccabd]">
          Dinh nghia khi su kien dien ra va ban do truc quan cac khu vuc ghe ngoi de toi uu hoa doanh thu ban ve.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        {/* Left Column: Forms */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          {/* Venue & Schedule */}
          <div className="relative overflow-hidden rounded-xl border border-[#3d4a40] bg-[#1a211c] p-6 transition-colors hover:border-[#869488]">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[#59de92]">&#127758;</span>
              <h3 className="text-xl font-bold text-[#dde5dc]">Venue & Schedule</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#bccabd]">Venue Name</label>
                <input
                  className="w-full rounded-lg border border-[#3d4a40] bg-[#161d18] px-4 py-3 text-[#dde5dc] outline-none transition-colors focus:border-[#59de92] focus:ring-1 focus:ring-[#59de92]"
                  onChange={(e) => onChange('venue', e.target.value)}
                  type="text"
                  value={data.venue || ''}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#bccabd]">Event Start</label>
                  <input
                    className="w-full rounded-lg border border-[#3d4a40] bg-[#161d18] px-3 py-3 text-[#dde5dc] outline-none transition-colors focus:border-[#59de92] scheme-dark"
                    onChange={(e) => onChange('starts_at', e.target.value)}
                    type="datetime-local"
                    value={data.starts_at || ''}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#bccabd]">Event End</label>
                  <input
                    className="w-full rounded-lg border border-[#3d4a40] bg-[#161d18] px-3 py-3 text-[#dde5dc] outline-none transition-colors focus:border-[#59de92] scheme-dark"
                    onChange={(e) => onChange('ends_at', e.target.value)}
                    type="datetime-local"
                    value={data.ends_at || ''}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#bccabd]">Sales Open</label>
                  <input
                    className="w-full rounded-lg border border-[#3d4a40] bg-[#161d18] px-3 py-3 text-[#dde5dc] outline-none transition-colors focus:border-[#59de92] scheme-dark"
                    onChange={(e) => onChange('ticket_sale_starts_at', e.target.value)}
                    type="datetime-local"
                    value={data.ticket_sale_starts_at || ''}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#bccabd]">Sales Close</label>
                  <input
                    className="w-full rounded-lg border border-[#3d4a40] bg-[#161d18] px-3 py-3 text-[#dde5dc] outline-none transition-colors focus:border-[#59de92] scheme-dark"
                    onChange={(e) => onChange('ticket_sale_ends_at', e.target.value)}
                    type="datetime-local"
                    value={data.ticket_sale_ends_at || ''}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Layout Architecture */}
          <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[#59de92]">&#9974;</span>
              <h3 className="text-xl font-bold text-[#dde5dc]">Layout Architecture</h3>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-xs font-semibold text-[#bccabd]">Base Shape</label>
              <div className="grid grid-cols-3 gap-2">
                {SHAPES.map((s) => (
                  <button
                    key={s.key}
                    className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-3 transition-all ${
                      data.display_type === s.key
                        ? 'border-[#59de92] bg-[#59de92]/10 text-[#59de92]'
                        : 'border-[#3d4a40] bg-[#161d18] text-[#bccabd] hover:border-[#869488]'
                    }`}
                    onClick={() => onChange('display_type', s.key)}
                    type="button"
                  >
                    <span className="text-lg">{s.icon}</span>
                    <span className="text-[10px] font-semibold">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#bccabd]">Rows (Height)</label>
                <input
                  className="w-full rounded-lg border border-[#3d4a40] bg-[#161d18] px-4 py-3 text-[#dde5dc] outline-none transition-colors focus:border-[#59de92]"
                  min={1}
                  onChange={(e) => onChange('master_length', Number(e.target.value))}
                  type="number"
                  value={data.master_length || 4}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#bccabd]">Columns (Width)</label>
                <input
                  className="w-full rounded-lg border border-[#3d4a40] bg-[#161d18] px-4 py-3 text-[#dde5dc] outline-none transition-colors focus:border-[#59de92]"
                  min={1}
                  onChange={(e) => onChange('master_width', Number(e.target.value))}
                  type="number"
                  value={data.master_width || 6}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Map & Zones */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[#3d4a40] bg-[#1a211c]">
            {/* Map Header */}
            <div className="flex items-center justify-between border-b border-[#3d4a40] bg-[#2f3631]/30 p-4">
              <div className="flex items-center gap-2">
                <span className="text-[#59de92]">&#9638;</span>
                <h3 className="text-xl font-bold text-[#dde5dc]">Master Map Editor</h3>
              </div>
            </div>

            {/* Map Canvas */}
            <div className="grow p-4">
              <ZoneEditor
                length={data.master_length || 4}
                onBlockToggle={handleBlockToggle}
                selectedBlocks={selectedBlocks}
                width={data.master_width || 6}
                zones={data.zones || []}
              />
            </div>

            {/* Zone Panel */}
            <div className="grid grid-cols-1 gap-6 border-t border-[#3d4a40] bg-[#1a211c] p-4 md:grid-cols-2">
              {/* Legend */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#bccabd]">Assigned Zones</h4>
                <div className="space-y-2">
                  {(data.zones || []).length === 0 && (
                    <p className="text-sm text-[#bccabd]">Chua co zone nao. Chon block tren ban do va them zone.</p>
                  )}
                  {(data.zones || []).map((zone, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-[#3d4a40] bg-[#161d18] p-2">
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full shadow-[0_0_8px_rgba(89,222,146,0.5)]" style={{ backgroundColor: zone.color }} />
                        <span className="text-sm text-[#dde5dc]">{zone.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-[#bccabd]">{zone.width * zone.length} blocks</span>
                        <span className="text-xs font-bold text-[#59de92]">{Number(zone.price).toLocaleString()} VND</span>
                        <button className="text-xs text-[#ffb4ab] hover:underline" onClick={() => removeZone(index)} type="button">Xoa</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create Zone Form */}
              <ZoneForm disabled={selectedBlocks.length === 0} onAdd={handleAddZone} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step2Seating
