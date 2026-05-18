import { useState } from 'react'
import ZoneEditor from './ZoneEditor'
import ZoneForm from './ZoneForm'

const SHAPES = [
  { key: 'rectangular', label: 'Chữ nhật', icon: '▭' },
  { key: 'stadium', label: 'Sân vận động', icon: '◎' },
]

function Step2Seating({ data, onChange }) {
  const [selectedBlocks, setSelectedBlocks] = useState([])
  const displayType = SHAPES.some((shape) => shape.key === data.display_type) ? data.display_type : 'rectangular'

  const toPositiveInt = (value, fallback = 1) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? Math.max(1, Math.floor(parsed)) : fallback
  }

  const normalizeStadiumRows = (value, currentValue = null) => {
    const rowsValue = toPositiveInt(value)
    if (rowsValue % 2 === 1) return rowsValue

    const isDecreasing = currentValue !== null && rowsValue < currentValue
    return isDecreasing ? Math.max(1, rowsValue - 1) : rowsValue + 1
  }

  const normalizeStadiumCols = (value, currentValue = null) => {
    const colsValue = Math.max(2, toPositiveInt(value, 2))
    if (colsValue % 2 === 0) return colsValue

    const isDecreasing = currentValue !== null && colsValue < currentValue
    return isDecreasing ? Math.max(2, colsValue - 1) : colsValue + 1
  }

  const handleShapeChange = (shapeKey) => {
    onChange('display_type', shapeKey)
    setSelectedBlocks([])

    if (shapeKey === 'stadium') {
      onChange('master_length', normalizeStadiumRows(data.master_length || 5))
      onChange('master_width', normalizeStadiumCols(data.master_width || 6))
    }
  }

  const handleDimensionChange = (field, value) => {
    const currentValue =
      field === 'master_length'
        ? normalizeStadiumRows(data.master_length || 5)
        : normalizeStadiumCols(data.master_width || 6)

    const nextValue =
      displayType === 'stadium' && field === 'master_length'
        ? normalizeStadiumRows(value, currentValue)
        : displayType === 'stadium' && field === 'master_width'
          ? normalizeStadiumCols(value, currentValue)
          : toPositiveInt(value)

    onChange(field, nextValue)
    setSelectedBlocks([])
  }

  const displayedRows = displayType === 'stadium' ? normalizeStadiumRows(data.master_length || 5) : data.master_length || 4
  const displayedCols = displayType === 'stadium' ? normalizeStadiumCols(data.master_width || 6) : data.master_width || 6

  const getZoneAt = (row, col) => {
    return (data.zones || []).find((zone) => {
      const startRow = zone.pos_y
      const startCol = zone.pos_x
      return row >= startRow && row < startRow + zone.length && col >= startCol && col < startCol + zone.width
    })
  }

  const handleBlockToggle = (row, col) => {
    if (getZoneAt(row, col)) return

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
    const width = maxCol - minCol + 1
    const length = maxRow - minRow + 1

    const newZone = {
      ...zone,
      pos_x: minCol,
      pos_y: minRow,
      width,
      length,
      is_seating: true,
    }

    const zones = [...(data.zones || []), newZone]
    onChange('zones', zones)
    setSelectedBlocks([])
  }

  const removeZone = (index) => {
    const zones = (data.zones || []).filter((_, i) => i !== index)
    onChange('zones', zones)
    setSelectedBlocks([])
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#3d4a40] pb-4">
        <h1 className="text-4xl font-extrabold text-[#dde5dc]">Sơ đồ ghế ngồi</h1>
        <p className="mt-2 max-w-2xl text-base text-[#bccabd]">
          Định nghĩa bản đồ trực quan các khu vực ghế ngồi để tối ưu hóa doanh thu bán vé.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-[#59de92] opacity-50" />
          <div className="h-2 flex-1 rounded-full bg-[#59de92] shadow-[0_0_10px_rgba(89,222,146,0.5)]" />
          <div className="h-2 flex-1 rounded-full bg-[#252c26]" />
          <span className="ml-2 text-xs font-semibold text-[#59de92]">Bước 2/3</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        {/* Left Column: Forms */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          {/* Venue Selection */}
          <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[#59de92]">&#128205;</span>
              <h3 className="text-xl font-bold text-[#dde5dc]">Chọn địa điểm</h3>
            </div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#bccabd]">
              Địa điểm tổ chức <span className="text-[#ffb4ab]">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-[#3d4a40] bg-[#161d18] px-4 py-3 text-[#dde5dc] outline-none transition-colors placeholder:text-[#bccabd]/50 focus:border-[#59de92] focus:ring-1 focus:ring-[#59de92]"
              onChange={(e) => onChange('venue', e.target.value)}
              placeholder="Nhập hoặc chọn địa điểm tổ chức..."
              type="text"
              value={data.venue || ''}
            />
            <p className="mt-2 text-xs text-[#bccabd]">
              Địa điểm này sẽ được dùng cho bản đồ ghế và thông tin xuất bản sự kiện.
            </p>
          </div>

          {/* Layout Architecture */}
          <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[#59de92]">&#9974;</span>
              <h3 className="text-xl font-bold text-[#dde5dc]">Kiến trúc bản đồ</h3>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-xs font-semibold text-[#bccabd]">Hình dạng cơ bản</label>
              <div className="grid grid-cols-2 gap-2">
                {SHAPES.map((s) => (
                  <button
                    key={s.key}
                    className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-3 transition-all ${
                      displayType === s.key
                        ? 'border-[#59de92] bg-[#59de92]/10 text-[#59de92]'
                        : 'border-[#3d4a40] bg-[#161d18] text-[#bccabd] hover:border-[#869488]'
                    }`}
                    onClick={() => handleShapeChange(s.key)}
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
                <label className="mb-1 block text-xs font-semibold text-[#bccabd] whitespace-nowrap">
                  Số hàng (Chiều cao)
                </label>
                <input
                  className="w-full rounded-lg border border-[#3d4a40] bg-[#161d18] px-4 py-3 text-[#dde5dc] outline-none transition-colors focus:border-[#59de92]"
                  min={1}
                  onChange={(e) => handleDimensionChange('master_length', e.target.value)}
                  type="number"
                  value={displayedRows}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#bccabd]">
                  Số cột (Chiều rộng)
                </label>
                <input
                  className="w-full rounded-lg border border-[#3d4a40] bg-[#161d18] px-4 py-3 text-[#dde5dc] outline-none transition-colors focus:border-[#59de92]"
                  min={displayType === 'stadium' ? 2 : 1}
                  onChange={(e) => handleDimensionChange('master_width', e.target.value)}
                  type="number"
                  value={displayedCols}
                />
              </div>
            </div>
            {displayType === 'stadium' && (
              <p className="mt-3 text-xs text-[#bccabd]">
                Sân vận động yêu cầu số hàng là số lẻ, số cột là số chẵn. Sân cỏ ở giữa cố định 1 hàng x 2 cột.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Map & Zones */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[#3d4a40] bg-[#1a211c]">
            {/* Map Header */}
            <div className="flex items-center justify-between border-b border-[#3d4a40] bg-[#2f3631]/30 p-4">
              <div className="flex items-center gap-2">
                <span className="text-[#59de92]">&#9638;</span>
                <h3 className="text-xl font-bold text-[#dde5dc]">Chỉnh sửa bản đồ</h3>
              </div>
            </div>

            {/* Map Canvas */}
            <div className="grow p-4">
              <ZoneEditor
                displayType={displayType}
                length={displayedRows}
                onBlockToggle={handleBlockToggle}
                selectedBlocks={selectedBlocks}
                width={displayedCols}
                zones={data.zones || []}
              />
            </div>

            {/* Zone Panel */}
            <div className="grid grid-cols-1 gap-6 border-t border-[#3d4a40] bg-[#1a211c] p-4 md:grid-cols-2">
              {/* Legend */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#bccabd]">Zone đã gán</h4>
                <div className="space-y-2">
                  {(data.zones || []).length === 0 && (
                    <p className="text-sm text-[#bccabd]">Chưa có zone nào. Chọn block trên bản đồ và thêm zone.</p>
                  )}
                  {(data.zones || []).map((zone, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-[#3d4a40] bg-[#161d18] p-2">
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full shadow-[0_0_8px_rgba(89,222,146,0.5)]" style={{ backgroundColor: zone.color }} />
                        <span className="text-sm text-[#dde5dc]">{zone.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-[#bccabd]">{zone.width * zone.length} ô</span>
                        <span className="text-xs font-bold text-[#59de92]">{Number(zone.price).toLocaleString()} VND</span>
                        <button className="text-xs text-[#ffb4ab] hover:underline" onClick={() => removeZone(index)} type="button">Xóa</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create Zone Form */}
              <ZoneForm disabled={selectedBlocks.length === 0} onAdd={handleAddZone} selectedCount={selectedBlocks.length} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step2Seating
