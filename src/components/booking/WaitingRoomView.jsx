import { FiAlertTriangle, FiClock, FiRefreshCw } from 'react-icons/fi'

function QueueStat({ label, value }) {
  return (
    <div className="rounded-lg bg-[#0e1510] px-3 py-2">
      <p className="font-black text-white">{value}</p>
      <p className="mt-1 text-[#869488]">{label}</p>
    </div>
  )
}

function WaitingRoomView({ event, entry, isJoining, onRefresh }) {
  const estimatedMinutes = Math.max(1, Math.ceil(Number(entry?.estimated_wait_seconds || 0) / 60))
  const position = entry?.position ?? (entry?.people_ahead !== undefined ? Number(entry.people_ahead) + 1 : 0)

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col bg-[#0e1510] text-[#dde5dc]">
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-10">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="h-96 w-96 rounded-full bg-[#20b36c] blur-[100px]" />
        </div>

        <section className="relative z-10 flex w-full max-w-md flex-col items-center gap-8 text-center">
          <div className="relative mb-2 flex h-32 w-32 items-center justify-center">
            <div className="queue-pulse-ring absolute inset-0 rounded-full bg-[#20b36c]/20" />
            <div className="absolute h-24 w-24 animate-spin rounded-full border-4 border-[#59de92]/30 border-t-[#59de92]" />
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-[#2f3631] bg-[#1a211c] text-[#59de92]">
              <FiClock size={30} />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#59de92]">{event?.name || 'TicketRush'}</p>
            <h1 className="text-2xl font-black text-white">Bạn đang trong hàng chờ</h1>
            <p className="mt-3 leading-7 text-[#bccabd]">Vé sự kiện đang được mở bán. Vui lòng giữ nguyên trang web này để hệ thống tự động chuyển bạn vào sơ đồ chọn ghế.</p>
          </div>

          <div className="relative w-full overflow-hidden rounded-xl border border-[#2f3631] bg-[#1a211c] p-6 shadow-[0_4px_24px_rgba(32,179,108,0.08)]">
            <div className="absolute left-0 top-0 h-1 w-full bg-linear-to-r from-[#2f3631] via-[#59de92] to-[#2f3631] opacity-70" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bccabd]">Vị trí của bạn trong hàng đợi</p>
            <div className="mt-3 text-6xl font-black text-[#59de92] drop-shadow-[0_0_18px_rgba(32,179,108,0.4)]">
              {isJoining ? '...' : position || 0}
            </div>
            <p className="mt-3 text-sm text-[#bccabd]">
              Dự kiến thời gian chờ: <span className="font-bold text-white">~{estimatedMinutes} phút</span>
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
              <QueueStat label="Đang chờ" value={entry?.waiting_count ?? 0} />
              <QueueStat label="Đang mua" value={entry?.active_count ?? 0} />
              <QueueStat label="Sức chứa" value={entry?.capacity ?? 0} />
            </div>
          </div>

          <div className="flex w-full items-start gap-4 rounded-xl border border-[#ff5a36] bg-[#3d1911] p-4 text-left shadow-[0_0_20px_rgba(255,90,54,0.1)]">
            <FiAlertTriangle className="mt-1 shrink-0 text-[#ff8a70]" size={22} />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#ffb4a9]">Cảnh báo quan trọng</h2>
              <p className="mt-2 text-sm leading-6 text-[#ffd4ce]">Không tải lại trang hoặc đóng trình duyệt. Tải lại trang có thể khiến bạn mất vị trí hiện tại trong hàng chờ.</p>
            </div>
          </div>

          <button className="inline-flex items-center gap-2 rounded-full border border-[#3d4a40] px-5 py-2.5 text-sm font-bold text-[#bccabd] transition-colors hover:border-[#59de92] hover:text-white" onClick={onRefresh} type="button">
            <FiRefreshCw />
            Cập nhật trạng thái
          </button>
        </section>
      </main>
    </div>
  )
}

export default WaitingRoomView
