import { FaEye } from 'react-icons/fa'
import { MdCampaign, MdEditNote, MdMap } from 'react-icons/md'

const steps = [
  { key: 'details', label: 'Thông tin sự kiện', icon: MdEditNote },
  { key: 'venue', label: 'Bản đồ địa điểm', icon: MdMap },
  { key: 'marketing', label: 'Xuất bản', icon: MdCampaign },
]

function EventWizardSidebar({ activeStep, onStepChange }) {
  return (
    <aside className="fixed left-0 top-20 z-30 hidden h-[calc(100vh-80px)] w-64 flex-col border-r border-[#3d4a40] bg-[#1a211c] p-4 md:flex">
      <div className="mb-8 p-2">
        <h2 className="text-base font-bold leading-tight text-[#59de92]">Trình tạo sự kiện</h2>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#bccabd]">Chế độ nháp</span>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {steps.map((step) => {
          const Icon = step.icon
          const isActive = step.key === activeStep
          return (
            <button
              key={step.key}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-all duration-300 ${
                isActive
                  ? 'translate-x-1 bg-[#59de92] font-semibold text-[#00391e] shadow-[0_0_10px_rgba(89,222,146,0.2)]'
                  : 'text-[#bccabd] hover:bg-[#2f3631] hover:text-white'
              }`}
              onClick={() => onStepChange(step.key)}
              type="button"
            >
              <Icon className="text-lg" />
              <span className="text-xs font-semibold uppercase tracking-wider">{step.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-[#3d4a40] pt-4">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#3d4a40] px-4 py-3 text-xs font-semibold text-[#59de92] transition-colors hover:bg-[#2f3631]"
          type="button"
        >
          <FaEye className="text-sm" />
          Xem trước sự kiện
        </button>
      </div>
    </aside>
  )
}

export default EventWizardSidebar
