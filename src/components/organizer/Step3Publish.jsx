import { FaRocket } from 'react-icons/fa'

const BANKS = ['Vietcombank', 'Techcombank', 'MB Bank', 'ACB', 'BIDV', 'VietinBank']

function Step3Publish({ data, onChange, onSubmit, isSubmitting }) {
  return (
    <div className="space-y-8">
      {/* Header & Stepper */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#dde5dc]">Thong tin thanh toan & Hoan tat</h1>
        <p className="mt-2 text-base text-[#bccabd]">Buoc cuoi cung de dua su kien cua ban den voi khan gia.</p>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-[#59de92] opacity-50" />
          <div className="h-2 flex-1 rounded-full bg-[#59de92] opacity-50" />
          <div className="h-2 flex-1 rounded-full bg-[#59de92] shadow-[0_0_10px_rgba(89,222,146,0.5)]" />
          <span className="ml-2 text-xs font-semibold text-[#59de92]">Buoc 3/3</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Form */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#dde5dc]">
              <span className="text-[#59de92]">&#127974;</span>
              Nhan doanh thu ban ve
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#bccabd]">Ten ngan hang</label>
                <div className="relative">
                  <select
                    className="w-full cursor-pointer appearance-none rounded-lg border border-[#3d4a40] bg-[#1a211c] p-3 text-[#dde5dc] outline-none transition-colors focus:border-[#59de92] focus:ring-1 focus:ring-[#59de92]"
                    onChange={(e) => onChange('bank_name', e.target.value)}
                    value={data.bank_name || ''}
                  >
                    <option value="">Chon ngan hang...</option>
                    {BANKS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#bccabd]">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                  </span>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#bccabd]">So tai khoan</label>
                <input
                  className="w-full rounded-lg border border-[#3d4a40] bg-[#1a211c] p-3 text-[#dde5dc] outline-none transition-colors placeholder:text-[#bccabd]/50 focus:border-[#59de92] focus:ring-1 focus:ring-[#59de92]"
                  onChange={(e) => onChange('bank_account_number', e.target.value)}
                  placeholder="Nhap so tai khoan hop le"
                  type="text"
                  value={data.bank_account_number || ''}
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#bccabd]">Ten chu tai khoan</label>
                <input
                  className="w-full rounded-lg border border-[#3d4a40] bg-[#1a211c] p-3 text-[#dde5dc] outline-none transition-colors placeholder:text-[#bccabd]/50 focus:border-[#59de92] focus:ring-1 focus:ring-[#59de92]"
                  onChange={(e) => onChange('bank_account_name', e.target.value)}
                  placeholder="VIET HOA CHU KHONG DAU"
                  type="text"
                  value={data.bank_account_name || ''}
                />
                <p className="mt-1 text-[10px] text-[#bccabd]">* Ten chu tai khoan phai trung khop voi ten dang ky tai khoan to chuc.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="space-y-4 lg:col-span-5">
          <div className="relative overflow-hidden rounded-xl border border-[#3d4a40] bg-[#161d18] p-6">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#59de92]/5 to-transparent" />
            <h3 className="relative z-10 mb-4 border-b border-[#3d4a40] pb-2 text-lg font-bold text-[#dde5dc]">
              Tom tat su kien
            </h3>
            <div className="relative z-10 space-y-4">
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-[#3d4a40] bg-[#2f3631]">
                  {data.thumbnail_url ? (
                    <img alt="thumb" className="h-full w-full rounded-lg object-cover" src={data.thumbnail_url} />
                  ) : (
                    <span className="text-2xl text-[#bccabd]">&#127909;</span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold leading-tight text-[#dde5dc]">{data.name || 'Chua co ten'}</h4>
                  <p className="mt-1 flex items-center gap-1 text-xs text-[#bccabd]">
                    <span>&#128197;</span>
                    {data.starts_at ? new Date(data.starts_at).toLocaleString('vi-VN') : 'Chua dat lich'}
                  </p>
                </div>
              </div>

              <div className="border-t border-dashed border-[#3d4a40] pt-4">
                <h5 className="mb-2 text-xs font-semibold text-[#bccabd]">Loai ve da tao</h5>
                <div className="space-y-2">
                  {(data.zones || []).length === 0 && (
                    <p className="text-sm text-[#bccabd]">Chua co zone nao.</p>
                  )}
                  {(data.zones || []).map((zone, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-[#3d4a40] bg-[#0e1510] p-2">
                      <span className="text-sm font-medium text-[#dde5dc]">{zone.name}</span>
                      <span className="text-xs font-bold text-[#59de92]">{Number(zone.price).toLocaleString()} VND</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#59de92] py-4 text-base font-bold text-[#00391e] shadow-[0_0_20px_rgba(89,222,146,0.3)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting || !data.name || !data.category}
            onClick={onSubmit}
            type="button"
          >
            <FaRocket className="text-lg" />
            {isSubmitting ? 'Dang xu ly...' : 'Hoan tat & Dang su kien'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Step3Publish
