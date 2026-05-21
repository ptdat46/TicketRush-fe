export function getWeekRange(now = new Date()) {
  const day = now.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const start = new Date(now)
  start.setDate(now.getDate() + diffToMonday)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { starts_after: start.toISOString(), starts_before: end.toISOString() }
}

export function getMonthRange(now = new Date()) {
  const start = new Date(now)
  start.setDate(1)
  start.setHours(0, 0, 0, 0)

  const end = new Date(now)
  end.setMonth(now.getMonth() + 1, 0)
  end.setHours(23, 59, 59, 999)

  return { starts_after: start.toISOString(), starts_before: end.toISOString() }
}
