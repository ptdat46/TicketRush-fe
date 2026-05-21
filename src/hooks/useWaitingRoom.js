import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '../utils/api'

const ACTIVE_HEARTBEAT_SECONDS = 60

export function useWaitingRoom({ eventId, userId, onAdmitted }) {
  const [entry, setEntry] = useState(null)
  const [phase, setPhase] = useState('waiting')
  const [isJoining, setIsJoining] = useState(true)

  const refresh = useCallback(async ({ silent = false } = {}) => {
    const response = await api.get(`/customer/events/${eventId}/waiting-room`)

    if (!response.success) {
      if (!silent) toast.error(response.error || 'Không thể cập nhật phòng chờ.')
      return
    }

    setEntry(response.data)
    if (response.data?.can_enter_booking) {
      setPhase((current) => (current === 'waiting' ? 'booking' : current))
    } else {
      setPhase('waiting')
    }
  }, [eventId])

  useEffect(() => {
    let isMounted = true

    async function join() {
      setIsJoining(true)
      const response = await api.post(`/customer/events/${eventId}/waiting-room`)
      if (!isMounted) return

      if (!response.success) {
        toast.error(response.error || 'Không thể vào phòng chờ.')
        setIsJoining(false)
        return
      }

      setEntry(response.data)
      if (response.data?.can_enter_booking) {
        setPhase('booking')
        onAdmitted?.()
      }
      setIsJoining(false)
    }

    join()
    return () => { isMounted = false }
  }, [eventId, onAdmitted])

  useEffect(() => {
    const baseSeconds = Math.max(3, Number(entry?.poll_after_seconds || 5))
    const seconds = phase === 'waiting' ? baseSeconds : ACTIVE_HEARTBEAT_SECONDS
    const timer = window.setInterval(() => refresh({ silent: true }), seconds * 1000)
    return () => window.clearInterval(timer)
  }, [phase, entry?.poll_after_seconds, refresh])

  useEffect(() => {
    if (!window.Echo || !userId) return undefined

    const summaryChannel = window.Echo.private(`events.${eventId}.waiting-room`)
    const entryChannel = window.Echo.private(`events.${eventId}.customers.${userId}.waiting-room`)

    summaryChannel.listen('.waiting-room.summary.updated', (payload) => {
      setEntry((current) => ({ ...current, ...payload }))
    })

    entryChannel.listen('.waiting-room.entry.updated', (payload) => {
      setEntry(payload)
      if (payload?.can_enter_booking) {
        setPhase((current) => {
          if (current === 'waiting') {
            onAdmitted?.()
            return 'booking'
          }
          return current
        })
      }
    })

    return () => {
      window.Echo.leave(`events.${eventId}.waiting-room`)
      window.Echo.leave(`events.${eventId}.customers.${userId}.waiting-room`)
    }
  }, [eventId, userId, onAdmitted])

  return { entry, phase, setPhase, isJoining, refresh }
}
