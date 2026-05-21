export const EVENT_CATEGORY_LABELS = {
  music: 'Nhạc sống',
  dj: 'DJ / EDM',
  theater: 'Sân khấu & Nghệ thuật',
  sport: 'Thể thao',
  workshop: 'Hội thảo & Workshop',
  conference: 'Hội nghị',
  comedy: 'Hài kịch',
  family: 'Gia đình',
  other: 'Khác',
}

export const EVENT_STATUS_LABELS = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
}

export const EVENT_STATUS_CLASSES = {
  pending: 'bg-[#2f3631] text-[#bccabd]',
  approved: 'bg-[#59de92]/10 text-[#59de92]',
  rejected: 'bg-red-500/10 text-red-300',
}

export const TICKET_STATUS_LABELS = {
  not_started: 'Chưa mở bán',
  on_sale: 'Đang mở bán',
  sold_out: 'Đã bán hết',
  ended: 'Đã kết thúc',
}

export function formatEventDateTime(value) {
  if (!value) return 'Chưa có'

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')} VND`
}

export function getTicketBadge(event) {
  if (event?.ticket_sale_status === 'on_sale' && event?.is_sold_out) {
    return {
      className: 'border-red-300/30 bg-red-950/90 text-red-100',
      text: 'Hết vé',
    }
  }

  if (event?.ticket_sale_status === 'sold_out') {
    return {
      className: 'border-red-300/30 bg-red-950/90 text-red-100',
      text: 'Đã hết vé',
    }
  }

  if (event?.ticket_sale_status === 'not_started') {
    return {
      className: 'border-amber-300/30 bg-amber-500/90 text-black',
      text: 'Sắp diễn ra',
    }
  }

  if (event?.ticket_sale_status === 'ended') {
    return {
      className: 'border-zinc-500/30 bg-zinc-700/90 text-zinc-100',
      text: 'Đã kết thúc',
    }
  }

  return {
    className: 'border-[#20b36c]/30 bg-[#20b36c] text-black',
    text: 'Mua vé ngay',
  }
}

export function getEventImage(event, type = 'thumbnail') {
  if (type === 'banner') {
    return event?.banner_url || event?.thumbnail_url || '/logo.png'
  }

  return event?.thumbnail_url || event?.banner_url || '/logo.png'
}

export function getDisplayTypeLabel(value) {
  return value === 'stadium' ? 'Sân vận động' : 'Chữ nhật'
}
