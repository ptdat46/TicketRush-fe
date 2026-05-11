import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CategoryNav from '../components/CategoryNav'
import EventSection from '../components/EventSection'
import Footer from '../components/Footer'
import Header from '../components/Header'
import HeroCard from '../components/HeroCard'
import { api } from '../utils/api'

const initialHomepageData = {
  categories: [],
  featured_events: [],
  special_events: [],
  this_month_events: [],
  this_week_events: [],
  trending_events: [],
  upcoming_sale_events: [],
}

function getDateRangeParams(type) {
  const now = new Date()
  const start = new Date(now)
  const end = new Date(now)

  if (type === 'week') {
    const day = now.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    start.setDate(now.getDate() + diffToMonday)
    start.setHours(0, 0, 0, 0)
    end.setTime(start.getTime())
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)
  } else {
    start.setDate(1)
    start.setHours(0, 0, 0, 0)
    end.setMonth(now.getMonth() + 1, 0)
    end.setHours(23, 59, 59, 999)
  }

  return {
    starts_after: start.toISOString(),
    starts_before: end.toISOString(),
  }
}

function HomePage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('')
  const [activeTimeTab, setActiveTimeTab] = useState('week')
  const [data, setData] = useState(initialHomepageData)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchHomepageData() {
      setIsLoading(true)
      setError('')

      const weekRange = getDateRangeParams('week')
      const monthRange = getDateRangeParams('month')
      const now = new Date().toISOString()

      const [
        categoriesResponse,
        featuredResponse,
        specialResponse,
        trendingResponse,
        thisWeekResponse,
        thisMonthResponse,
        upcomingSaleResponse,
      ] = await Promise.all([
        api.get('/categories'),
        api.get('/events?is_featured=1&limit=2'),
        api.get('/events?is_special=1&limit=8'),
        api.get('/events?trending=1&limit=6'),
        api.get(`/events?starts_after=${encodeURIComponent(weekRange.starts_after)}&starts_before=${encodeURIComponent(weekRange.starts_before)}&limit=6`),
        api.get(`/events?starts_after=${encodeURIComponent(monthRange.starts_after)}&starts_before=${encodeURIComponent(monthRange.starts_before)}&limit=6`),
        api.get(`/events?sale_starts_after=${encodeURIComponent(now)}&limit=6`),
      ])

      if (!isMounted) return

      const failedResponse = [
        categoriesResponse,
        featuredResponse,
        specialResponse,
        trendingResponse,
        thisWeekResponse,
        thisMonthResponse,
        upcomingSaleResponse,
      ].find((response) => !response.success)

      if (failedResponse) {
        setError(failedResponse.error || 'Không thể tải dữ liệu trang chủ.')
        setData(initialHomepageData)
        setIsLoading(false)
        return
      }

      setData({
        categories: categoriesResponse.data || [],
        featured_events: featuredResponse.data || [],
        special_events: specialResponse.data || [],
        this_month_events: thisMonthResponse.data || [],
        this_week_events: thisWeekResponse.data || [],
        trending_events: trendingResponse.data || [],
        upcoming_sale_events: upcomingSaleResponse.data || [],
      })
      setIsLoading(false)
    }

    fetchHomepageData()

    return () => {
      isMounted = false
    }
  }, [])

  const timeTabEvents = activeTimeTab === 'week' ? data.this_week_events : data.this_month_events

  const handleCategoryChange = (categoryKey) => {
    if (!categoryKey) {
      setActiveCategory('')
      return
    }

    navigate(`/events?category=${categoryKey}`)
  }

  return (
    <div className="min-h-screen bg-[#0e1510] text-[#dde5dc]">
      <Header />
      <CategoryNav activeCategory={activeCategory} categories={data.categories} onCategoryChange={handleCategoryChange} />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-80 animate-pulse rounded-2xl bg-[#1a211c]" />
            <div className="h-80 animate-pulse rounded-2xl bg-[#1a211c]" />
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-950/40 p-6 text-red-100">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <>
            {data.featured_events.length > 0 && (
              <section className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
                {data.featured_events.slice(0, 2).map((event, index) => (
                  <HeroCard event={event} featured={index === 0} key={event.id || event.name} />
                ))}
              </section>
            )}

            <EventSection activeCategory={activeCategory} events={data.special_events} limit={8} showViewAll title="Sự kiện đặc biệt" />
            <EventSection activeCategory={activeCategory} events={data.trending_events} limit={6} title="Sự kiện xu hướng" />

            {(data.this_week_events.length > 0 || data.this_month_events.length > 0) && (
              <section className="w-full">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <h3 className="text-2xl font-extrabold text-white sm:text-3xl">Tuần này / Tháng này</h3>
                  <div className="flex w-max rounded-full border border-[#3d4a40] bg-[#1a211c] p-1">
                    <button
                      className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${activeTimeTab === 'week' ? 'bg-[#20b36c] text-black' : 'text-[#bccabd] hover:text-white'}`}
                      onClick={() => setActiveTimeTab('week')}
                      type="button"
                    >
                      Tuần này
                    </button>
                    <button
                      className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${activeTimeTab === 'month' ? 'bg-[#20b36c] text-black' : 'text-[#bccabd] hover:text-white'}`}
                      onClick={() => setActiveTimeTab('month')}
                      type="button"
                    >
                      Tháng này
                    </button>
                  </div>
                </div>

                <EventSection events={timeTabEvents} limit={6} title={activeTimeTab === 'week' ? 'Sự kiện tuần này' : 'Sự kiện tháng này'} />
              </section>
            )}

            <EventSection activeCategory={activeCategory} events={data.upcoming_sale_events} limit={6} title="Sự kiện sắp mở bán" />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
