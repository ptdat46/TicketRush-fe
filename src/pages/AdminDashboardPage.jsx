import { useEffect, useMemo, useState } from 'react'
import { FiRefreshCw, FiSearch } from 'react-icons/fi'
import AdminEventCard from '../components/admin/AdminEventCard'
import AdminEventEditModal from '../components/admin/AdminEventEditModal'
import AdminPageHeader from '../components/admin/AdminPageHeader'
import AdminShell from '../components/admin/AdminShell'
import AdminStatCard from '../components/admin/AdminStatCard'
import AdminStatusTabs from '../components/admin/AdminStatusTabs'
import { api } from '../utils/api'
import { EVENT_CATEGORY_LABELS } from '../utils/eventDisplay'

const categoryOptions = Object.entries(EVENT_CATEGORY_LABELS).map(([value, label]) => ({ label, value }))

function AdminDashboardPage() {
  const [events, setEvents] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [editError, setEditError] = useState('')
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [filters, setFilters] = useState({ category: '', search: '', status: 'pending' })
  const [updatingId, setUpdatingId] = useState('')

  const stats = useMemo(() => {
    const pending = events.filter((event) => event.status === 'pending').length
    const homepage = events.filter((event) => event.is_featured || event.is_special).length
    const availableSeats = events.reduce((total, event) => total + Number(event.available_seats_count || 0), 0)

    return [
      { label: 'Kết quả', value: meta?.total ?? events.length },
      { label: 'Chờ duyệt trên trang', value: pending },
      { label: 'Đang lên homepage', value: homepage },
      { label: 'Ghế còn trống', value: availableSeats },
    ]
  }, [events, meta])

  useEffect(() => {
    let isMounted = true

    async function loadEvents() {
      setIsLoading(true)
      setError('')

      const params = new URLSearchParams()
      params.set('per_page', '12')
      params.set('page', String(page))
      if (filters.status) params.set('status', filters.status)
      if (filters.category) params.set('category', filters.category)
      if (filters.search) params.set('search', filters.search)

      const response = await api.get(`/admin/events?${params.toString()}`)

      if (!isMounted) return

      if (!response.success) {
        setEvents([])
        setMeta(null)
        setError(response.error || 'Không thể tải danh sách sự kiện admin.')
        setIsLoading(false)
        return
      }

      setEvents(Array.isArray(response.data) ? response.data : [])
      setMeta(response.meta || null)
      setIsLoading(false)
    }

    loadEvents()

    return () => {
      isMounted = false
    }
  }, [filters, page])

  const refreshEvents = () => {
    setFilters((current) => ({ ...current }))
  }

  const handleStatusChange = (status) => {
    setPage(1)
    setFilters((current) => ({ ...current, status }))
  }

  const handleCategoryChange = (event) => {
    setPage(1)
    setFilters((current) => ({ ...current, category: event.target.value }))
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    setPage(1)
    setFilters((current) => ({ ...current, search: searchInput.trim() }))
  }

  const handleReview = async (eventId, status) => {
    setUpdatingId(`${eventId}:review`)
    setError('')

    const response = await api.patch(`/admin/events/${eventId}/review`, { status })
    setUpdatingId('')

    if (!response.success) {
      setError(response.error || 'Không thể cập nhật trạng thái duyệt sự kiện.')
      return
    }

    refreshEvents()
  }

  const handleHomepageChange = async (eventId, payload) => {
    setUpdatingId(`${eventId}:homepage`)
    setError('')

    const response = await api.patch(`/admin/events/${eventId}/homepage`, payload)
    setUpdatingId('')

    if (!response.success) {
      setError(response.error || 'Không thể cập nhật cấu hình homepage.')
      return
    }

    setEvents((currentEvents) => (
      currentEvents.map((event) => (event.id === eventId ? { ...event, ...response.data } : event))
    ))
  }

  const handleEditOpen = (event) => {
    setEditError('')
    setSelectedEvent(event)
  }

  const handleEditClose = () => {
    if (isSavingEdit) return

    setEditError('')
    setSelectedEvent(null)
  }

  const handleEventUpdate = async (eventId, payload) => {
    setIsSavingEdit(true)
    setEditError('')

    const response = await api.put(`/admin/events/${eventId}`, payload)
    setIsSavingEdit(false)

    if (!response.success) {
      setEditError(response.error || 'Không thể cập nhật sự kiện.')
      return
    }

    const updatedEvent = response.data || {}
    setEvents((currentEvents) => (
      currentEvents.map((event) => (event.id === eventId ? { ...event, ...updatedEvent } : event))
    ))
    setSelectedEvent(null)
    refreshEvents()
  }

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
    window.scrollTo({ behavior: 'smooth', top: 0 })
  }

  return (
    <AdminShell>
      <AdminPageHeader
        action={(
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#59de92]/50 px-5 py-3 text-sm font-bold text-[#59de92] transition hover:bg-[#59de92]/10"
            onClick={refreshEvents}
            type="button"
          >
            <FiRefreshCw />
            Làm mới
          </button>
        )}
        description="Duyệt sự kiện organizer gửi lên, theo dõi trạng thái bán vé và chọn các event nổi bật cho trang chủ."
        title="Quản trị sự kiện"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <AdminStatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </section>

      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <AdminStatusTabs onChange={handleStatusChange} value={filters.status} />

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            className="rounded-full border border-[#3d4a40] bg-[#1a211c] px-4 py-2.5 text-sm font-semibold text-[#dde5dc] outline-none focus:border-[#59de92] focus:ring-2 focus:ring-[#59de92]/20"
            onChange={handleCategoryChange}
            value={filters.category}
          >
            <option value="">Tất cả danh mục</option>
            {categoryOptions.map((category) => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>

          <form className="flex min-w-0 gap-3" onSubmit={handleSearchSubmit}>
            <label className="relative min-w-0 flex-1 sm:w-80">
              <span className="sr-only">Tìm sự kiện</span>
              <input
                className="w-full rounded-full border border-[#3d4a40] bg-[#1a211c] py-2.5 pl-4 pr-10 text-sm text-white outline-none transition-colors placeholder:text-[#869488] focus:border-[#59de92] focus:ring-2 focus:ring-[#59de92]/20"
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Tìm theo tên hoặc địa điểm..."
                value={searchInput}
              />
              <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-[#59de92]" />
            </label>
            <button className="rounded-full bg-[#20b36c] px-5 py-2.5 text-sm font-bold text-[#00391e] transition hover:brightness-110" type="submit">
              Tìm
            </button>
          </form>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="h-56 animate-pulse rounded-xl border border-[#3d4a40] bg-[#1a211c]" key={index} />
          ))}
        </div>
      )}

      {!isLoading && events.length === 0 && (
        <div className="rounded-xl border border-[#3d4a40] bg-[#1a211c] p-8 text-center">
          <h2 className="text-xl font-bold text-white">Không có sự kiện phù hợp</h2>
          <p className="mt-2 text-sm text-[#bccabd]">Thử đổi trạng thái, danh mục hoặc từ khóa tìm kiếm.</p>
        </div>
      )}

      {!isLoading && events.length > 0 && (
        <section className="space-y-4">
          {events.map((event) => (
            <AdminEventCard
              event={event}
              isUpdating={updatingId.startsWith(`${event.id}:`)}
              key={event.id}
              onEdit={handleEditOpen}
              onHomepageChange={handleHomepageChange}
              onReview={handleReview}
            />
          ))}
        </section>
      )}

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

      <AdminEventEditModal
        error={editError}
        event={selectedEvent}
        isSaving={isSavingEdit}
        onClose={handleEditClose}
        onSubmit={handleEventUpdate}
      />
    </AdminShell>
  )
}

export default AdminDashboardPage
