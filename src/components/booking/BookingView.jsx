import { FiCalendar, FiCreditCard, FiMapPin, FiTag } from 'react-icons/fi'
import { formatCurrency, formatEventDateTime, getEventImage } from '../../utils/eventDisplay'
import { getSeatLabel } from '../../utils/seatMap'
import SeatZone from './SeatZone'

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#0e1510] px-2 py-2 text-[#bccabd]">
      <span className={`h-3 w-3 rounded border ${color}`} />
      <span>{label}</span>
    </div>
  )
}

function BookingView({ event, mapError, onCheckout, onSeatToggle, selectedSeats, selectedSeatIds, zones, isBusy }) {
  const total = selectedSeats.reduce((sum, seat) => sum + Number(seat.zone?.price || 0), 0)
  const hasSeatMap = zones.length > 0

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0e1510] text-[#dde5dc]">
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_380px] lg:px-8">
        <section className="min-w-0 space-y-5">
          <div className="overflow-hidden rounded-xl border border-[#3d4a40] bg-[#1a211c]">
            <div className="relative h-56">
              <img alt={event?.name || 'Sự kiện'} className="h-full w-full object-cover" src={getEventImage(event, 'banner')} />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#59de92]">Chọn ghế</p>
                <h1 className="mt-2 text-3xl font-black text-white">{event?.name || 'Đặt vé sự kiện'}</h1>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#dde5dc]">
                  <span className="inline-flex items-center gap-2"><FiCalendar />{formatEventDateTime(event?.starts_at)}</span>
                  <span className="inline-flex items-center gap-2"><FiMapPin />{event?.venue || 'Đang cập nhật địa điểm'}</span>
                </div>
              </div>
            </div>
          </div>

          {mapError && (
            <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
              {mapError}
            </div>
          )}

          <div className="rounded-xl border border-[#3d4a40] bg-[#101711] p-4">
            <div className="mb-5 flex h-14 items-center justify-center rounded-lg border border-[#59de92]/50 bg-[#59de92]/10 text-xs font-black uppercase tracking-[0.22em] text-[#59de92] shadow-[0_0_18px_rgba(89,222,146,0.12)]">
              Sân khấu
            </div>
            {hasSeatMap ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {zones.map((zone) => (
                  <SeatZone
                    key={zone.id}
                    onSeatToggle={onSeatToggle}
                    selectedSeatIds={selectedSeatIds}
                    zone={zone}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[#3d4a40] bg-[#09100b] p-8 text-center">
                <p className="text-lg font-black text-white">Chưa có dữ liệu sơ đồ ghế</p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#bccabd]">
                  FE đã vào được phiên booking, nhưng backend chưa trả danh sách zone và seat cho customer. Khi có endpoint seat map, khu vực này sẽ render ghế thật.
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#869488]">Tóm tắt ghế</p>
                <h2 className="mt-1 text-xl font-black text-white">Thanh toán</h2>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#20b36c] text-[#00210f]">
                <FiTag size={22} />
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <Legend color="bg-[#161d18] border-[#3d4a40]" label="Trống" />
              <Legend color="bg-[#20b36c] border-[#59de92]" label="Đã chọn" />
              <Legend color="bg-red-950 border-red-500/30" label="Đã bán" />
            </div>

            <div className="mt-5 space-y-3">
              {selectedSeats.length === 0 ? (
                <p className="rounded-lg bg-[#0e1510] p-4 text-sm text-[#bccabd]">Chọn tối đa 10 ghế còn trống trên sơ đồ.</p>
              ) : (
                selectedSeats.map((seat) => (
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-[#3d4a40] bg-[#0e1510] p-3" key={seat.id}>
                    <div>
                      <p className="font-bold text-white">{seat.zone?.name} - Ghế {getSeatLabel(seat)}</p>
                      <p className="mt-1 text-xs text-[#bccabd]">Sẽ giữ chỗ khi bấm Thanh toán</p>
                    </div>
                    <span className="text-sm font-black text-[#59de92]">{formatCurrency(seat.zone?.price)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 border-t border-[#3d4a40] pt-5">
              <div className="flex items-center justify-between text-sm text-[#bccabd]">
                <span>Tạm tính</span>
                <span className="font-black text-white">{formatCurrency(total)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-[#869488]">
                <span>Phương thức</span>
                <span>Mock payment</span>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#20b36c] px-5 py-3 text-sm font-black text-[#00210f] shadow-[0_0_22px_rgba(32,179,108,0.28)] transition-colors hover:bg-[#59de92] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isBusy || !hasSeatMap || selectedSeats.length === 0}
                onClick={onCheckout}
                type="button"
              >
                <FiCreditCard />
                Thanh toán
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default BookingView
