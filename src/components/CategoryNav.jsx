import { FaMicrophoneAlt, FaTheaterMasks, FaUsers } from 'react-icons/fa'
import { MdSportsSoccer } from 'react-icons/md'

const categories = [
  { label: 'Nhạc sống', icon: FaMicrophoneAlt, active: true },
  { label: 'Sân khấu & Nghệ thuật', icon: FaTheaterMasks },
  { label: 'Thể thao', icon: MdSportsSoccer },
  { label: 'Hội thảo & Workshop', icon: FaUsers },
]

function CategoryNav() {
  return (
    <nav className="sticky top-20 z-40 overflow-x-auto border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl min-w-max items-center gap-8 px-8 py-4">
        {categories.map((category) => {
          const CategoryIcon = category.icon

          return (
            <a
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-1 transition-colors ${
                category.active
                  ? 'border-[#20b36c] font-bold text-[#20b36c]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
              href="#"
              key={category.label}
            >
              <CategoryIcon />
              {category.label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

export default CategoryNav
