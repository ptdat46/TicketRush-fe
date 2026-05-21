export function rowLabel(index) {
  const normalized = Number(index || 0)
  return String.fromCharCode(65 + (normalized % 26))
}

export function getSeatLabel(seat) {
  return `${rowLabel(seat.row_index)}${Number(seat.col_index || 0) + 1}`
}

export function normalizeSeat(seat, zone) {
  return {
    ...seat,
    zone,
    zone_id: seat.zone_id || zone.id,
    row_index: Number(seat.row_index || 0),
    col_index: Number(seat.col_index || 0),
  }
}

function buildGeneratedSeats(zone) {
  const width = Number(zone.width || 1)
  const length = Number(zone.length || 1)
  const zoneSeed = Number(zone.id) || 9000

  return Array.from({ length: width * length }, (_, index) => ({
    id: zoneSeed * 10000 + index,
    row_index: Math.floor(index / width),
    col_index: index % width,
    status: 'available',
  }))
}

export function normalizeZones(zones) {
  return zones
    .filter((zone) => zone.is_seating !== false)
    .map((zone) => {
      const seats = Array.isArray(zone.seats) && zone.seats.length > 0 ? zone.seats : buildGeneratedSeats(zone)
      return {
        ...zone,
        price: Number(zone.price || 0),
        color: zone.color || '#59de92',
        seats: seats.map((seat) => normalizeSeat(seat, zone)),
      }
    })
}

export function getZonesFromResponse(response) {
  if (!response.success) return []
  if (Array.isArray(response.data)) return response.data
  if (Array.isArray(response.data?.zones)) return response.data.zones
  return []
}

export function getEventGridFromResponse(response) {
  if (!response.success) return null
  const event = response.data?.event
  if (!event) return null
  return {
    masterWidth: Number(event.master_width || 0),
    masterLength: Number(event.master_length || 0),
  }
}

export function inferGridSize(zones) {
  let cols = 0
  let rows = 0
  for (const zone of zones) {
    const right = Number(zone.pos_x || 0) + Number(zone.width || 0)
    const bottom = Number(zone.pos_y || 0) + Number(zone.length || 0)
    if (right > cols) cols = right
    if (bottom > rows) rows = bottom
  }
  return { masterWidth: cols, masterLength: rows }
}
