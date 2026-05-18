import { useState } from 'react'

const PRESET_COLORS = ['#59de92', '#ff4444', '#fcd34d', '#a78bfa', '#3b82f6', '#f97316']

function ZoneForm({ onAdd, disabled, selectedCount = 0 }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])

  const handleSubmit = () => {
    if (!name.trim() || !price.trim()) return
    onAdd({ name: name.trim(), price: Number(price), color })
    setName('')
    setPrice('')
    setColor(PRESET_COLORS[0])
  }

  return (
    <div className="rounded-lg border border-[#3d4a40] bg-[#161d18] p-4">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#bccabd]">Tạo zone mới</h4>
      <div className="mb-3 flex gap-2">
        <input
          className="min-w-0 flex-1 rounded-md border border-[#3d4a40] bg-[#1a211c] px-3 py-2 text-sm text-[#dde5dc] outline-none transition-colors placeholder:text-[#bccabd]/50 focus:border-[#59de92]"
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên zone"
          type="text"
          value={name}
        />
        <input
          className="w-28 rounded-md border border-[#3d4a40] bg-[#1a211c] px-3 py-2 text-sm text-[#dde5dc] outline-none transition-colors placeholder:text-[#bccabd]/50 focus:border-[#59de92]"
          min="0"
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Giá (VND)"
          type="number"
          value={price}
        />
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#bccabd]">Màu:</span>
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 ${
                color === c ? 'border-white ring-2 ring-[#59de92] ring-offset-2 ring-offset-[#161d18]' : 'border-[#3d4a40]'
              }`}
              aria-label={`Chọn màu ${c}`}
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              type="button"
            >
              {color === c && <span className="text-xs font-black leading-none text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">✓</span>}
            </button>
          ))}
        </div>
        <button
          className="flex w-full items-center justify-center gap-1 rounded-md bg-[#59de92] px-4 py-2.5 text-xs font-semibold text-[#00391e] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || !name.trim() || !price.trim()}
          onClick={handleSubmit}
          type="button"
        >
          Thêm Zone
        </button>
      </div>
      <p className="mt-2 text-xs italic text-[#bccabd]">
        {selectedCount > 0
          ? `Đã chọn ${selectedCount} block. Bấm Thêm Zone để áp dụng.`
          : '* Chọn các block chưa gán trên bản đồ ở trên để áp dụng zone này.'}
      </p>
    </div>
  )
}

export default ZoneForm
