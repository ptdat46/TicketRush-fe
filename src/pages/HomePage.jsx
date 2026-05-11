import CategoryNav from '../components/CategoryNav'
import EventCard from '../components/EventCard'
import Footer from '../components/Footer'
import Header from '../components/Header'
import HeroCard from '../components/HeroCard'

const heroEvents = [
  {
    title: 'Neon Nights Festival 2024',
    description: 'Đêm nhạc điện tử bùng nổ nhất năm với dàn line-up quốc tế cực khủng.',
    badge: 'HOT DEAL',
    badgeClass: 'bg-[#20b36c] text-black shadow-[0_0_15px_rgba(32,179,108,0.4)]',
    actionLabel: 'Mua vé ngay',
    buttonClass: 'bg-[#20b36c] text-black hover:bg-[#78fcac] shadow-[0_0_20px_rgba(32,179,108,0.3)]',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=80',
  },
  {
    title: 'Chung Kết Cúp Bóng Đá Vô Địch Quốc Gia',
    description: 'Trận thư hùng quyết định ngôi vương của mùa giải.',
    badge: 'THỂ THAO',
    badgeClass: 'bg-[#343b35] border border-[#3d4a40] text-white',
    actionLabel: 'Xem chi tiết',
    buttonClass: 'bg-white text-black hover:bg-zinc-200',
    image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1400&q=80',
  },
]

const specialEvents = [
  {
    title: 'The Midnight Sounds - Asia Tour 2024',
    time: '20:00, 15 Thg 11, 2024',
    location: 'Nhà thi đấu Phú Thọ',
    badge: 'Sắp diễn ra',
    badgeClass: 'border-[#20b36c]/30 bg-black/60 text-[#78fcac]',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Tech Summit Vietnam: AI & Tương lai',
    time: '08:00, 22 Thg 11, 2024',
    location: 'GEM Center, TP.HCM',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Ravetopia 2024: Đêm Giao Thừa',
    time: '19:00, 31 Thg 12, 2024',
    location: 'Khu Đô Thị Sala, TP.HCM',
    badge: 'Sắp hết vé',
    badgeClass: 'border-red-300/30 bg-red-950/90 text-red-100',
    image: 'https://images.unsplash.com/photo-1571266028243-d220c9c3b6d2?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Vở Nhạc Kịch: Tiếng Gọi Nơi Hoang Dã',
    time: '20:00, 05 Thg 12, 2024',
    location: 'Nhà Hát Thành Phố',
    status: 'sold-out',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80',
  },
]

function HomePage() {
  return (
    <div className="min-h-screen bg-[#0e1510] text-[#dde5dc]">
      <Header />
      <CategoryNav />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
          {heroEvents.map((event, index) => (
            <HeroCard event={event} featured={index === 0} key={event.title} />
          ))}
        </section>

        <section className="mt-8 w-full">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h3 className="text-3xl font-extrabold text-white sm:text-4xl">Sự kiện đặc biệt</h3>
            <a className="flex items-center gap-1 font-semibold text-[#78fcac] transition-colors hover:text-[#59de92]" href="#">
              Xem tất cả
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {specialEvents.map((event) => (
              <EventCard event={event} key={event.title} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
