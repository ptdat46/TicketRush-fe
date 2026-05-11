import { FaHeart, FaMicrophoneAlt, FaRegSmile, FaTheaterMasks, FaTicketAlt, FaTrophy, FaUsers } from 'react-icons/fa'
import { MdOutlineGroups, MdOutlineMusicNote, MdOutlinePresentToAll } from 'react-icons/md'

const iconMap = {
  disc: MdOutlineMusicNote,
  heart: FaHeart,
  music: FaMicrophoneAlt,
  presentation: MdOutlinePresentToAll,
  smile: FaRegSmile,
  theater: FaTheaterMasks,
  ticket: FaTicketAlt,
  trophy: FaTrophy,
  users: FaUsers,
}

function CategoryNav({ activeCategory, categories = [], onCategoryChange, variant = 'tabs' }) {
  const isPills = variant === 'pills'

  return (
    <nav className={`${isPills ? 'w-max bg-black' : 'sticky top-20 z-40 overflow-x-auto border-b border-zinc-800 bg-zinc-950'}`}>
      <div className={`flex items-center px-8 ${isPills ? 'w-max gap-3 py-3' : 'mx-auto max-w-7xl min-w-max gap-8 py-4'}`}>
        <button
          className={
            isPills
              ? `flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors ${!activeCategory ? 'bg-[#20b36c] text-white' : 'bg-zinc-700 text-white hover:bg-zinc-600'}`
              : `flex items-center gap-2 whitespace-nowrap border-b-2 pb-1 transition-colors ${!activeCategory ? 'border-[#20b36c] font-bold text-[#20b36c]' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`
          }
          onClick={() => onCategoryChange('')}
          type="button"
        >
          <MdOutlineGroups />
          Tất cả
        </button>

        {categories.map((category) => {
          const CategoryIcon = iconMap[category.icon] || FaTicketAlt

          return (
            <button
              className={
                isPills
                  ? `flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors ${activeCategory === category.key ? 'bg-[#20b36c] text-white' : 'bg-zinc-700 text-white hover:bg-zinc-600'}`
                  : `flex items-center gap-2 whitespace-nowrap border-b-2 pb-1 transition-colors ${activeCategory === category.key ? 'border-[#20b36c] font-bold text-[#20b36c]' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`
              }
              key={category.key}
              onClick={() => onCategoryChange(category.key)}
              type="button"
            >
              <CategoryIcon />
              {category.name}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default CategoryNav
