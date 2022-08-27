'use strict'

function getFullWeek (now) {
  let thisYear = now.getFullYear()
  let that = new Date(thisYear, 0, 1)
  let firstDay = that.getDay()
  let numsOfToday = (now - that) / 24 / 360 / 1000
  return Math.ceil((numsOfToday + firstDay) / 7)
}

function getWeek (now) {
  let today = now.getDate()
  let year = now.getFullYear()
  let month = now.getMonth()
  let firstDay = new Date(year, month, 1).getDay()
  return Math.ceil((today + firstDay) / 7)
}

function dateFormat (time = new Date(), str = 'Y-m-d H:i:s') {
  if (/^\d+$/.test(str)) {
    time = str
    str = 'Y-m-d H:i:s'
    if (ms) {
      str = 'Y-m-d H:i:s:S'
    }
  }
  let now = new Date(time)

  let week = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']

  let dt = {
    fullyear: now.getFullYear(),
    year: now.getYear(),
    fullweek: getFullWeek(now),
    month: now.getMonth() + 1,
    week: week[getWeek(now)],
    date: now.getDate(),
    day: now.getDay(),
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    getMilliseconds: now.getMilliseconds()
  }
  let reg = null

  dt.g = dt.hours > 12 ? dt.hours - 12 : dt.hours

  reg = {
    Y: dt.fullyear,
    y: dt.year,
    m: dt.month < 10 ? '0' + dt.month : dt.month,
    n: dt.month,
    d: dt.date < 10 ? '0' + dt.date : dt.date,
    j: dt.date,
    H: dt.hours < 10 ? '0' + dt.hours : dt.hours,
    h: dt.g < 10 ? '0' + dt.g : dt.g,
    G: dt.hours,
    g: dt.g,
    i: dt.minutes < 10 ? '0' + dt.minutes : dt.minutes,
    s: dt.seconds < 10 ? '0' + dt.seconds : dt.seconds,
    S: dt.getMilliseconds < 10 ? '00' + dt.getMilliseconds : dt.getMilliseconds < 100 ? '0' + dt.getMilliseconds : dt.getMilliseconds,
    W: dt.fullweek,
    w: dt.week,
    D: dt.day
  }
  for (let i in reg) {
    str = str.replace(new RegExp(i, 'g'), reg[i])
  }
  return str
}

// module.exports = dateFormat
export default dateFormat