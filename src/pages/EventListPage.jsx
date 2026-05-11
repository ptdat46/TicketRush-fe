import { useEffect, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useSearchParams } from 'react-router-dom'
import CategoryNav from '../components/CategoryNav'
import EventCard from '../components/EventCard'
import Header from '../components/Header'
import { api } from '../utils/api'

const defaultCategories = [
  { key: 'music', name: 'Nhạc sống', icon: 'music' },
  { key: 'dj', name: 'DJ / EDM', icon: 'disc' },
  { key: 'theater', name: 'Sân khấu & Nghệ thuật', icon: 'theater' },
  { key: 'sport', name: 'Thể thao', icon: 'trophy' },
  { key: 'workshop', name: 'Hội thảo & Workshop', icon: 'users' },
  { key: 'conference', name: 'Hội nghị', icon: 'presentation' },
  { key: 'comedy', name: 'Hài kịch', icon: 'smile' },
  { key: 'family', name: 'Gia đình', icon: 'heart' },
  { key: 'other', name: 'Khác', icon: 'ticket' },
]

function EventListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || ''
  const page = searchParams.get('page') || '1'
  const q = searchParams.get('q') || ''
  const [categories, setCategories] = useState(defaultCategories)
  const [events, setEvents] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [meta, setMeta] = useState(null)
  const [searchValue, setSearchValue] = useState(q)
  const [categoryOffset, setCategoryOffset] = useState(0)

  const activeCategoryName = categories.find((category) => category.key === activeCategory)?.name || 'Tất cả các ngày'

  useEffect(() => {
    setSearchValue(q)
  }, [q])

  useEffect(() => {
    let isMounted = true

    async function fetchCategories() {
      const response = await api.get('/categories')

      if (!isMounted || !response.success || !response.data?.categories?.length) {
        return
      }

      setCategories(response.data.categories)
    }

    fetchCategories()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function fetchEvents() {
      setIsLoading(true)
      setError('')

      const params = new URLSearchParams()
      if (activeCategory) params.set('category', activeCategory)
      if (q) params.set('q', q)
      params.set('per_page', '12')
      params.set('page', page)

      const response = await api.get(`/events?${params.toString()}`)

      if (!isMounted) return

      if (!response.success) {
        setEvents([])
        setMeta(null)
        setError(response.error || 'Không thể tải danh sách sự kiện.')
        setIsLoading(false)
        return
      }

      setEvents(Array.isArray(response.data) ? response.data : [])
      setMeta(response.meta || null)
      setIsLoading(false)
    }

    fetchEvents()

    return () => {
      isMounted = false
    }
  }, [activeCategory, page, q])

  const handleCategoryChange = (categoryKey) => {
    const nextParams = new URLSearchParams(searchParams)

    if (categoryKey) {
      nextParams.set('category', categoryKey)
    } else {
      nextParams.delete('category')
    }

    nextParams.delete('page')
    setSearchParams(nextParams)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    const nextParams = new URLSearchParams(searchParams)

    if (searchValue.trim()) {
      nextParams.set('q', searchValue.trim())
    } else {
      nextParams.delete('q')
    }

    nextParams.delete('page')
    setSearchParams(nextParams)
  }

  const handlePageChange = (nextPage) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', String(nextPage))
    setSearchParams(nextParams)
  }

  const handleCategorySlide = (direction) => {
    setCategoryOffset((currentOffset) => {
      const nextOffset = currentOffset + direction * 220
      return Math.min(0, Math.max(nextOffset, -1100))
    })
  }

  return (
    <div className="min-h-screen bg-black text-[#dde5dc]">
      <Header />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-sm font-semibold text-[#20b36c]">Kết quả tìm kiếm:</h1>

          <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center">
            <form className="flex w-full shrink-0 gap-3 xl:w-80" onSubmit={handleSearchSubmit}>
              <input
                className="min-w-0 flex-1 rounded-full border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-[#20b36c]"
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Tìm kiếm sự kiện..."
                value={searchValue}
              />
              <button className="rounded-full bg-[#20b36c] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#17a35f]" type="submit">
                Tìm
              </button>
            </form>

            <div className="flex min-w-0 flex-1 items-center gap-2">
              <button
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-white transition-colors hover:bg-zinc-600"
                onClick={() => handleCategorySlide(1)}
                type="button"
              >
                <FaChevronLeft className="text-xs" />
              </button>

              <div className="flex-1 overflow-hidden">
                <div className="transition-transform duration-300 ease-out" style={{ transform: `translateX(${categoryOffset}px)` }}>
                  <CategoryNav activeCategory={activeCategory} categories={categories} onCategoryChange={handleCategoryChange} variant="pills" />
                </div>
              </div>

              <button
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-white transition-colors hover:bg-zinc-600"
                onClick={() => handleCategorySlide(-1)}
                type="button"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        </section>

        {activeCategory && (
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>Bộ lọc đang áp dụng:</span>
            <span className="rounded-full bg-[#20b36c] px-3 py-1 font-bold text-white">{activeCategoryName}</span>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="h-80 animate-pulse rounded-xl bg-[#1a211c]" key={index} />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-950/40 p-6 text-red-100">
            {error}
          </div>
        )}

        {!isLoading && !error && events.length === 0 && (
          <div className="rounded-2xl border border-[#3d4a40] bg-[#1a211c] p-10 text-center">
            <h2 className="text-2xl font-bold text-white">Không tìm thấy sự kiện</h2>
            <p className="mt-3 text-[#bccabd]">Thử chọn danh mục khác hoặc thay đổi từ khóa tìm kiếm.</p>
          </div>
        )}

        {!isLoading && !error && events.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {events.map((event) => (
                <EventCard event={event} key={event.id || event.name} />
              ))}
            </div>

            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-center gap-3">
                <button
                  className="rounded-full border border-[#3d4a40] px-4 py-2 font-bold text-[#bccabd] transition-colors hover:border-[#59de92] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={meta.current_page <= 1}
                  onClick={() => handlePageChange(meta.current_page - 1)}
                  type="button"
                >
                  Trước
                </button>
                <span className="text-sm text-[#bccabd]">
                  Trang {meta.current_page} / {meta.last_page}
                </span>
                <button
                  className="rounded-full border border-[#3d4a40] px-4 py-2 font-bold text-[#bccabd] transition-colors hover:border-[#59de92] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() => handlePageChange(meta.current_page + 1)}
                  type="button"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default EventListPage
