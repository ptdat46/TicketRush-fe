const statusTabs = [
  { label: 'Tất cả', value: '' },
  { label: 'Chờ duyệt', value: 'pending' },
  { label: 'Đã duyệt', value: 'approved' },
  { label: 'Từ chối', value: 'rejected' },
]

function AdminStatusTabs({ value, onChange }) {
  return (
    <div className="flex w-full gap-2 overflow-x-auto rounded-xl border border-[#3d4a40] bg-[#1a211c] p-2 sm:w-max">
      {statusTabs.map((tab) => (
        <button
          className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
            value === tab.value ? 'bg-[#20b36c] text-[#00391e]' : 'text-[#bccabd] hover:bg-[#2f3631] hover:text-white'
          }`}
          key={tab.value || 'all'}
          onClick={() => onChange(tab.value)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default AdminStatusTabs
