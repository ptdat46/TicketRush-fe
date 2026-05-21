import { FiArrowLeft, FiArrowRight, FiCalendar, FiCreditCard, FiMail, FiMapPin, FiPhone, FiTag, FiUser } from 'react-icons/fi'
import { formatCurrency, formatEventDateTime, getEventImage } from '../../utils/eventDisplay'
import { getSeatLabel } from '../../utils/seatMap'

const PAYMENT_OPTIONS = [
  { icon: <FiCreditCard />, label: 'Ví MoMo', value: 'momo' },
  { icon: <FiTag />, label: 'Chuyển khoản ngân hàng', value: 'bank_transfer' },
  { icon: <FiCreditCard />, label: 'Thẻ Visa / Mastercard', value: 'credit_card' },
]

const inputClass = 'w-full rounded-lg border border-[#3d4a40] bg-[#2f3631] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#869488] focus:border-[#20b36c] focus:ring-1 focus:ring-[#20b36c]'
const inputWithIconClass = 'w-full rounded-lg border border-[#3d4a40] bg-[#2f3631] py-3 pl-11 pr-4 text-white outline-none transition-colors placeholder:text-[#869488] focus:border-[#20b36c] focus:ring-1 focus:ring-[#20b36c]'

function CustomerInfoForm({ customerForm, onChange }) {
  return (
    <div className="rounded-xl border border-[#2f3631] bg-[#161d18] p-6">
      <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-white">
        <FiUser className="text-[#20b36c]" />
        Thông tin khách hàng
      </h2>
      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#bccabd]">Họ và tên</span>
          <input className={inputClass} name="fullName" onChange={onChange} placeholder="Nhập họ và tên của bạn" type="text" value={customerForm.fullName} />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#bccabd]">Email</span>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#869488]" />
              <input className={inputWithIconClass} name="email" onChange={onChange} placeholder="example@email.com" type="email" value={customerForm.email} />
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#bccabd]">Số điện thoại</span>
            <div className="relative">
              <FiPhone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#869488]" />
              <input className={inputWithIconClass} name="phone" onChange={onChange} placeholder="0901234567" type="tel" value={customerForm.phone} />
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}

function PaymentMethodList({ paymentMethod, onChange }) {
  return (
    <div className="rounded-xl border border-[#2f3631] bg-[#161d18] p-6">
      <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-white">
        <FiCreditCard className="text-[#20b36c]" />
        Phương thức thanh toán
      </h2>
      <div className="space-y-3">
        {PAYMENT_OPTIONS.map((option) => {
          const isSelected = paymentMethod === option.value
          return (
            <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${isSelected ? 'border-[#20b36c] bg-[#2f3631]' : 'border-[#3d4a40] bg-[#252c26] hover:border-[#869488]'}`} key={option.value}>
              <input checked={isSelected} className="h-4 w-4 accent-[#20b36c]" name="payment_method" onChange={() => onChange(option.value)} type="radio" value={option.value} />
              <span className={`${isSelected ? 'text-[#20b36c]' : 'text-[#bccabd]'}`}>{option.icon}</span>
              <span className="font-bold text-white">{option.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

function OrderSummary({ event, selectedSeats, total, isBusy, onConfirm }) {
  return (
    <aside className="h-fit rounded-xl border border-[#2f3631] bg-[#161d18] p-6 lg:sticky lg:top-24">
      <h2 className="border-b border-[#2f3631] pb-4 text-xl font-black text-white">Tóm tắt đơn hàng</h2>
      <div className="my-5 flex items-start gap-4">
        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-[#2f3631]">
          <img alt={event?.name || 'Sự kiện'} className="h-full w-full object-cover" src={getEventImage(event, 'poster')} />
        </div>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-lg font-black leading-tight text-white">{event?.name || 'Sự kiện'}</h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-[#bccabd]"><FiCalendar />{formatEventDateTime(event?.starts_at)}</p>
          <p className="mt-1 flex items-center gap-2 text-sm text-[#bccabd]"><FiMapPin />{event?.venue || 'Đang cập nhật địa điểm'}</p>
        </div>
      </div>

      <div className="mb-5 space-y-3">
        {selectedSeats.map((seat) => (
          <div className="flex items-center justify-between gap-4 border-b border-dashed border-[#3d4a40] py-2" key={seat.id}>
            <span className="text-sm font-semibold text-white">1x {seat.zone?.name}-{getSeatLabel(seat)}</span>
            <span className="text-sm font-bold text-[#dde5dc]">{formatCurrency(seat.zone?.price)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#2f3631] pt-5">
        <div className="flex items-end justify-between gap-4">
          <span className="text-lg font-bold text-[#bccabd]">Tổng tiền</span>
          <span className="text-2xl font-black text-[#20b36c]">{formatCurrency(total)}</span>
        </div>
        <button
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#20b36c] px-6 py-4 text-base font-black text-[#00391e] shadow-[0_0_18px_rgba(32,179,108,0.28)] transition-colors hover:bg-[#59de92] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isBusy || selectedSeats.length === 0}
          onClick={onConfirm}
          type="button"
        >
          Xác nhận thanh toán
          <FiArrowRight />
        </button>
        <p className="mt-4 text-center text-xs leading-5 text-[#869488]">Bằng việc xác nhận, bạn đồng ý với Điều khoản và Chính sách bảo mật của TicketRush.</p>
      </div>
    </aside>
  )
}

function PaymentView({ customerForm, event, isBusy, onBack, onConfirm, onCustomerChange, onPaymentMethodChange, paymentMethod, selectedSeats }) {
  const total = selectedSeats.reduce((sum, seat) => sum + Number(seat.zone?.price || 0), 0)

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0e1510] text-[#dde5dc]">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-8">
        <div className="mb-8">
          <button className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#3d4a40] px-4 py-2 text-sm font-bold text-[#bccabd] transition-colors hover:border-[#59de92] hover:text-white" onClick={onBack} type="button">
            <FiArrowLeft />
            Quay lại chọn ghế
          </button>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#59de92]">Bước 3/3: Xác nhận</p>
              <h1 className="mt-2 text-3xl font-black text-white">Thanh toán</h1>
            </div>
            <div className="hidden w-64 grid-cols-3 gap-2 sm:grid">
              <span className="h-1 rounded-full bg-[#20b36c]" />
              <span className="h-1 rounded-full bg-[#20b36c]" />
              <span className="h-1 rounded-full bg-[#2f3631]" />
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <section className="space-y-4">
            <CustomerInfoForm customerForm={customerForm} onChange={onCustomerChange} />
            <PaymentMethodList paymentMethod={paymentMethod} onChange={onPaymentMethodChange} />
          </section>
          <OrderSummary event={event} isBusy={isBusy} onConfirm={onConfirm} selectedSeats={selectedSeats} total={total} />
        </div>
      </main>
    </div>
  )
}

export default PaymentView
