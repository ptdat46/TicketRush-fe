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
          <h1 className="text-2xl font-bold text-[#dde5dc]">Thong tin su kien</h1>
          <span className="text-xs font-semibold text-[#59de92]">Buoc 1/3</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#252c26]">
          <div className="h-full w-1/3 rounded-full bg-linear-to-r from-[#59de92] to-[#20b36c]" />
        </div>
      </div>

      {/* Event Info Card */}
      <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#bccabd]">
              Ten su kien <span className="text-[#ffb4ab]">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-[#3d4a40] bg-[#2f3631] px-4 py-3 text-[#dde5dc] outline-none transition-colors placeholder:text-[#bccabd]/50 focus:border-[#59de92] focus:ring-1 focus:ring-[#59de92]"
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Nhap ten su kien cuc chay cua ban..."
              type="text"
              value={data.name || ''}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#bccabd]">
              Danh muc <span className="text-[#ffb4ab]">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full cursor-pointer appearance-none rounded-lg border border-[#3d4a40] bg-[#2f3631] px-4 py-3 text-[#dde5dc] outline-none transition-colors focus:border-[#59de92] focus:ring-1 focus:ring-[#59de92]"
                onChange={(e) => onChange('category', e.target.value)}
                value={data.category || ''}
              >
                <option disabled value="">Chon the loai...</option>
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
        <h3 className="mb-4 text-lg font-bold text-[#dde5dc]">Hinh anh truyen thong</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#bccabd]">
              Banner su kien (Ty le 16:9) <span className="text-[#ffb4ab]">*</span>
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
                    Keo tha hoac click de tai len Banner<br />
                    <span className="text-[10px] font-normal opacity-70">De xuat: 1920x1080px (Max 5MB)</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#bccabd]">
              Thumbnail (Ty le 1:1) <span className="text-[#ffb4ab]">*</span>
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
                    Tai len Thumbnail<br />
                    <span className="text-[10px] font-normal opacity-70">De xuat: 800x800px</span>
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
            <span>Mo ta su kien</span>
            <span className="font-normal opacity-70">{descLength} / 2000</span>
          </label>
          <textarea
            className="w-full resize-y rounded-lg border border-[#3d4a40] bg-[#2f3631] px-4 py-3 text-[#dde5dc] outline-none transition-colors placeholder:text-[#bccabd]/50 focus:border-[#59de92] focus:ring-1 focus:ring-[#59de92]"
            maxLength={2000}
            onChange={(e) => {
              setDescLength(e.target.value.length)
              onChange('description', e.target.value)
            }}
            placeholder="Ke cho khan gia nghe su kien nay co gi hap dan..."
            rows={6}
            value={data.description || ''}
          />
        </div>
      </div>
    </div>
  )
}

export default Step1BasicInfo
