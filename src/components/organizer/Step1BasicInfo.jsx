import { useRef, useState } from 'react'
import { FaCloudUploadAlt, FaImage } from 'react-icons/fa'

const CATEGORIES = [
  { key: 'music', name: 'Nhac song / Concert' },
  { key: 'dj', name: 'DJ / EDM Festival' },
  { key: 'theater', name: 'San khau & Nghe thuat' },
  { key: 'sport', name: 'The thao / E-sports' },
  { key: 'workshop', name: 'Hoi thao / Workshop' },
  { key: 'conference', name: 'Hoi nghi' },
  { key: 'comedy', name: 'Hai kich' },
  { key: 'family', name: 'Gia dinh' },
  { key: 'other', name: 'Khac' },
]

function Step1BasicInfo({ data, onChange }) {
  const [descLength, setDescLength] = useState(data.description?.length || 0)
  const bannerRef = useRef(null)
  const thumbRef = useRef(null)

  const handleFileChange = (field, event) => {
    const file = event.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onChange(field, url)
  }

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div>
        <div className="mb-2 flex items-end justify-between">
          <h1 className="text-2xl font-bold text-[#dde5dc]">Thông tin sự kiện</h1>
          <span className="text-xs font-semibold text-[#59de92]">Bước 1/3</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-[#59de92] shadow-[0_0_10px_rgba(89,222,146,0.5)]" />
          <div className="h-2 flex-1 rounded-full bg-[#252c26]" />
          <div className="h-2 flex-1 rounded-full bg-[#252c26]" />
        </div>
      </div>

      {/* Event Info Card */}
      <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#bccabd]">
              Tên sự kiện <span className="text-[#ffb4ab]">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-[#3d4a40] bg-[#2f3631] px-4 py-3 text-[#dde5dc] outline-none transition-colors placeholder:text-[#bccabd]/50 focus:border-[#59de92] focus:ring-1 focus:ring-[#59de92]"
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Nhập tên sự kiện cực cháy của bạn..."
              type="text"
              value={data.name || ''}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#bccabd]">
              Danh mục <span className="text-[#ffb4ab]">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full cursor-pointer appearance-none rounded-lg border border-[#3d4a40] bg-[#2f3631] px-4 py-3 text-[#dde5dc] outline-none transition-colors focus:border-[#59de92] focus:ring-1 focus:ring-[#59de92]"
                onChange={(e) => onChange('category', e.target.value)}
                value={data.category || ''}
              >
                <option disabled value="">Chọn thể loại...</option>
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.name}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#bccabd]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Media Card */}
      <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        <h3 className="mb-4 text-lg font-bold text-[#dde5dc]">Hình ảnh truyền thông</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#bccabd]">
              Banner sự kiện (Tỷ lệ 16:9) <span className="text-[#ffb4ab]">*</span>
            </label>
            <div
              className="relative flex h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[#3d4a40] bg-[#161d18] transition-all hover:border-[#59de92] hover:bg-[#2f3631] sm:h-64"
              onClick={() => bannerRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <input
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange('banner_url', e)}
                ref={bannerRef}
                type="file"
              />
              {data.banner_url ? (
                <img alt="Banner" className="h-full w-full object-cover" src={data.banner_url} />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#bccabd]">
                  <FaCloudUploadAlt className="text-4xl" />
                  <span className="text-center text-xs font-semibold">
                    Kéo thả hoặc click để tải lên Banner<br />
                    <span className="text-[10px] font-normal opacity-70">Đề xuất: 1920x1080px (Max 5MB)</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#bccabd]">
              Thumbnail (Tỷ lệ 1:1) <span className="text-[#ffb4ab]">*</span>
            </label>
            <div
              className="relative flex h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[#3d4a40] bg-[#161d18] transition-all hover:border-[#59de92] hover:bg-[#2f3631] sm:h-64"
              onClick={() => thumbRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <input
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange('thumbnail_url', e)}
                ref={thumbRef}
                type="file"
              />
              {data.thumbnail_url ? (
                <img alt="Thumbnail" className="h-full w-full object-cover" src={data.thumbnail_url} />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#bccabd]">
                  <FaImage className="text-3xl" />
                  <span className="text-center text-xs font-semibold">
                    Tải lên Thumbnail<br />
                    <span className="text-[10px] font-normal opacity-70">Đề xuất: 800x800px</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col gap-2">
          <label className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[#bccabd]">
            <span>Mô tả sự kiện</span>
            <span className="font-normal opacity-70">{descLength} / 2000</span>
          </label>
          <textarea
            className="w-full resize-y rounded-lg border border-[#3d4a40] bg-[#2f3631] px-4 py-3 text-[#dde5dc] outline-none transition-colors placeholder:text-[#bccabd]/50 focus:border-[#59de92] focus:ring-1 focus:ring-[#59de92]"
            maxLength={2000}
            onChange={(e) => {
              setDescLength(e.target.value.length)
              onChange('description', e.target.value)
            }}
            placeholder="Kể cho khán giả nghe sự kiện này có gì hấp dẫn..."
            rows={6}
            value={data.description || ''}
          />
        </div>
      </div>

      {/* Venue & Schedule */}
      <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        <h3 className="mb-4 text-lg font-bold text-[#dde5dc]">Địa điểm & Lịch trình</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#bccabd]">
              Tên địa điểm <span className="text-[#ffb4ab]">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-[#3d4a40] bg-[#2f3631] px-4 py-3 text-[#dde5dc] outline-none transition-colors placeholder:text-[#bccabd]/50 focus:border-[#59de92] focus:ring-1 focus:ring-[#59de92]"
              onChange={(e) => onChange('venue', e.target.value)}
              placeholder="Nhập tên địa điểm tổ chức..."
              type="text"
              value={data.venue || ''}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#bccabd]">
                Bắt đầu sự kiện <span className="text-[#ffb4ab]">*</span>
              </label>
              <input
                className="w-full rounded-lg border border-[#3d4a40] bg-[#2f3631] px-3 py-3 text-[#dde5dc] outline-none transition-colors focus:border-[#59de92] scheme-dark"
                onChange={(e) => onChange('starts_at', e.target.value)}
                type="datetime-local"
                value={data.starts_at || ''}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#bccabd]">
                Kết thúc sự kiện <span className="text-[#ffb4ab]">*</span>
              </label>
              <input
                className="w-full rounded-lg border border-[#3d4a40] bg-[#2f3631] px-3 py-3 text-[#dde5dc] outline-none transition-colors focus:border-[#59de92] scheme-dark"
                onChange={(e) => onChange('ends_at', e.target.value)}
                type="datetime-local"
                value={data.ends_at || ''}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#bccabd]">Mở bán vé</label>
              <input
                className="w-full rounded-lg border border-[#3d4a40] bg-[#2f3631] px-3 py-3 text-[#dde5dc] outline-none transition-colors focus:border-[#59de92] scheme-dark"
                onChange={(e) => onChange('ticket_sale_starts_at', e.target.value)}
                type="datetime-local"
                value={data.ticket_sale_starts_at || ''}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#bccabd]">Đóng bán vé</label>
              <input
                className="w-full rounded-lg border border-[#3d4a40] bg-[#2f3631] px-3 py-3 text-[#dde5dc] outline-none transition-colors focus:border-[#59de92] scheme-dark"
                onChange={(e) => onChange('ticket_sale_ends_at', e.target.value)}
                type="datetime-local"
                value={data.ticket_sale_ends_at || ''}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step1BasicInfo
