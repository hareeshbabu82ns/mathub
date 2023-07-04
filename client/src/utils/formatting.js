import moment from "moment"

export const remainingDurationFormat = (durationInSec) => {
  const d = moment.duration(durationInSec, 'seconds')
  const h = Math.floor(d.asHours())
  const m = Math.floor(d.minutes())
  const s = Math.floor(d.seconds())
  let res = h > 0 ? `${h}:`.padStart(3, '0') : ''
  res = m > 0 ? res + `${m}:`.padStart(3, '0') : `${res}`
  res = res + `${s}s`.padStart(3, '0')
  return res
  // return `${h}:${m}:${s}s`
}
