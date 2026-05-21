import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import BookingView from '../components/booking/BookingView'
import PaymentView from '../components/booking/PaymentView'
import WaitingRoomView from '../components/booking/WaitingRoomView'
import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'
import { useWaitingRoom } from '../hooks/useWaitingRoom'
import { api } from '../utils/api'
import { getEventGridFromResponse, getZonesFromResponse, inferGridSize, normalizeSeat, normalizeZones } from '../utils/seatMap'

const SEAT_MAP_ENDPOINTS = (eventId) => [
  `/customer/events/${eventId}/seat-map`,
  `/events/${eventId}/seat-map`,
  `/events/${eventId}/zones`,
  `/customer/events/${eventId}/zones`,
]

function BookingPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [event, setEvent] = useState(null)
  const [zones, setZones] = useState([])
  const [grid, setGrid] = useState({ masterWidth: 0, masterLength: 0 })
  const [selectedSeats, setSelectedSeats] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('momo')
  const [customerForm, setCustomerForm] = useState({
    fullName: user?.name || user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [isBusy, setIsBusy] = useState(false)
  const [mapError, setMapError] = useState('')

  const selectedSeatIds = useMemo(() => new Set(selectedSeats.map((seat) => seat.id)), [selectedSeats])

  const loadSeatMap = useCallback(async () => {
    for (const endpoint of SEAT_MAP_ENDPOINTS(eventId)) {
      const response = await api.get(endpoint)
      const responseZones = getZonesFromResponse(response)
      if (responseZones.length > 0) {
        const normalized = normalizeZones(responseZones)
        setZones(normalized)
        const fromResponse = getEventGridFromResponse(response)
        const fallback = inferGridSize(normalized)
        setGrid({
          masterWidth: fromResponse?.masterWidth || fallback.masterWidth,
          masterLength: fromResponse?.masterLength || fallback.masterLength,
        })
        setMapError('')
        return
      }
    }
    setZones([])
    setGrid({ masterWidth: 0, masterLength: 0 })
    setMapError('Chưa lấy được seat grid từ API. Backend chưa trả danh sách zone và seat cho customer hoặc chưa mở quyền.')
  }, [eventId])

  const { entry, phase, setPhase, isJoining, refresh } = useWaitingRoom({
    eventId,
    userId: user?.id,
    onAdmitted: loadSeatMap,
  })

  useEffect(() => {
    let isMounted = true
    api.get(`/events/${eventId}`).then((response) => {
      if (isMounted && response.success) setEvent(response.data)
    })
    return () => { isMounted = false }
  }, [eventId])

  const patchSeats = (updatedSeats) => {
    setZones((current) => current.map((zone) => ({
      ...zone,
      seats: zone.seats.map((seat) => {
        const updated = updatedSeats.find((item) => item.id === seat.id)
        return updated ? normalizeSeat({ ...seat, ...updated }, zone) : seat
      }),
    })))
    setSelectedSeats((current) => current.map((seat) => {
      const updated = updatedSeats.find((item) => item.id === seat.id)
      return updated ? { ...seat, ...updated, zone: seat.zone } : seat
    }))
  }

  const handleSeatToggle = (seat) => {
    if (selectedSeatIds.has(seat.id)) {
      setSelectedSeats((current) => current.filter((item) => item.id !== seat.id))
      return
    }
    if (selectedSeats.length >= 10) {
      toast.error('Bạn chỉ có thể chọn tối đa 10 ghế.')
      return
    }
    setSelectedSeats((current) => (current.some((item) => item.id === seat.id) ? current : [...current, seat]))
  }

  const handleCustomerChange = (changeEvent) => {
    const { name, value } = changeEvent.target
    setCustomerForm((current) => ({ ...current, [name]: value }))
  }

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) return

    setIsBusy(true)
    const response = await api.post(`/customer/events/${eventId}/seats/lock`, {
      seat_ids: selectedSeats.map((seat) => seat.id),
    })
    setIsBusy(false)

    if (!response.success) {
      toast.error(response.error || 'Có ghế đã có người chọn rồi, vui lòng chọn ghế khác.')
      return
    }

    const lockedSeats = Array.isArray(response.data) && response.data.length > 0
      ? response.data
      : selectedSeats.map((seat) => ({ ...seat, status: 'locked' }))

    patchSeats(lockedSeats)
    setSelectedSeats((current) => current.map((seat) => {
      const lockedSeat = lockedSeats.find((item) => item.id === seat.id)
      return lockedSeat
        ? { ...seat, ...lockedSeat, zone: seat.zone, status: lockedSeat.status || 'locked' }
        : { ...seat, status: 'locked' }
    }))
    setPhase('payment')
  }

  const handleConfirmPayment = async () => {
    setIsBusy(true)
    const response = await api.post(`/customer/events/${eventId}/orders`, {
      seat_ids: selectedSeats.map((seat) => seat.id),
      payment_method: paymentMethod,
      payment_reference: `MOCK-FE-${Date.now()}`,
    })
    setIsBusy(false)

    if (!response.success) {
      toast.error(response.error || 'Thanh toán chưa hoàn tất.')
      return
    }

    toast.success('Đặt vé thành công.')
    navigate(`/orders/${response.data.id}/success`, {
      state: { event, order: response.data, selectedSeats },
    })
  }

  return (
    <div className="min-h-screen bg-[#0e1510] text-[#dde5dc]">
      <Header />
      {phase === 'waiting' ? (
        <WaitingRoomView entry={entry} event={event} isJoining={isJoining} onRefresh={() => refresh()} />
      ) : phase === 'payment' ? (
        <PaymentView
          customerForm={customerForm}
          event={event}
          isBusy={isBusy}
          onBack={() => setPhase('booking')}
          onConfirm={handleConfirmPayment}
          onCustomerChange={handleCustomerChange}
          onPaymentMethodChange={setPaymentMethod}
          paymentMethod={paymentMethod}
          selectedSeats={selectedSeats}
        />
      ) : (
        <BookingView
          event={event}
          isBusy={isBusy}
          mapError={mapError}
          masterLength={grid.masterLength}
          masterWidth={grid.masterWidth}
          onCheckout={handleProceedToPayment}
          onSeatToggle={handleSeatToggle}
          selectedSeatIds={selectedSeatIds}
          selectedSeats={selectedSeats}
          zones={zones}
        />
      )}
    </div>
  )
}

export default BookingPage
