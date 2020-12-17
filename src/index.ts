import { name } from '../package.json'
const errPrefix = `[${name}] `

enum Unit {
  hour = 'hour',
  minute = 'minute',
  second = 'second'
}

enum ParamFormat {
  HHmm = 'HH:mm',
  HHmmss = 'HH:mm:ss',
  hourjs = 'hourjs'
}

class HourJs {
  hours: string
  minutes: string
  seconds: string
  hours_num: number
  minutes_num: number
  seconds_num: number
  fiducial: number

  constructor (initTime?: HourJs | string) {
    if (initTime) {
      if (initTime instanceof HourJs) {
        this.hours = initTime.hours
        this.hours_num = initTime.hours_num
        this.minutes = initTime.minutes
        this.minutes_num = initTime.minutes_num
        this.seconds = initTime.seconds
        this.seconds_num = initTime.seconds_num
        this.fiducial = initTime.fiducial
      } else {
        const { paramFormat } = this.handleParam(initTime)
        const [hours, minutes, seconds] = initTime.split(':')
        this.hours = hours
        this.hours_num = Number(hours)
        this.minutes = minutes
        this.minutes_num = Number(minutes)
        if (paramFormat === ParamFormat.HHmm) {
          this.seconds = '00'
          this.seconds_num = 0
          this.fiducial = this.getFiducial(initTime)
        } else {
          this.seconds = seconds
          this.seconds_num = Number(seconds)
          this.fiducial = this.getFiducial(initTime)
        }
      }
    }
    // 没传参取当前时间
    else {
      const { hours_num, minutes_num, seconds_num, hours, minutes, seconds } = this.getCurrentTime()
      this.seconds_num = seconds_num
      this.seconds = seconds
      this.minutes_num = minutes_num
      this.minutes = minutes
      this.hours_num = hours_num
      this.hours = hours
      this.fiducial = Number(hours + minutes + seconds)
    }
  }

  getCurrentTime () {
    const now = new Date()
    const hours_num = now.getHours()
    const minutes_num = now.getMinutes()
    const seconds_num = now.getSeconds()
    const hours = this.toStr(hours_num, Unit.hour)
    const minutes = this.toStr(minutes_num, Unit.minute)
    const seconds = this.toStr(seconds_num, Unit.second)
    return {
      hours_num,
      minutes_num,
      seconds_num,
      hours,
      minutes,
      seconds,
      fiducial: this.getFiducial(hours + minutes + seconds)
    }
  }

  handleParam (time?: string) {
    if (time) {
      if (/^\d{2}:\d{2}$/.test(time)) {
        const [hours, minutes] = time.split(':')
        return {
          paramFormat: ParamFormat.HHmm,
          hours,
          minutes,
          seconds: '00',
          hours_num: Number(hours),
          minutes_num: Number(minutes),
          seconds_num: 0,
          fiducial: this.getFiducial(time)
        }
      } else if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
        const [hours, minutes, seconds] = time.split(':')
        return {
          paramFormat: ParamFormat.HHmmss,
          hours,
          minutes,
          seconds,
          hours_num: Number(hours),
          minutes_num: Number(minutes),
          seconds_num: Number(seconds),
          fiducial: this.getFiducial(time)
        }
      } else {
        throw Error(errPrefix + `参数格式为 HH:mm 或 HH:mm:ss `)
      }
    } else {
      return {
        paramFormat: ParamFormat.HHmmss,
        ...this.getCurrentTime(),
      }
    }
  }

  validateUnit (unit: string) {
    let pass = false
    for (let k in Unit) {
      if (unit === Unit[k]) {
        pass = true
      }
    }
    if (!pass) {
      throw Error(errPrefix + `unit参数需为 ${Unit.hour}, ${Unit.minute}, ${Unit.second} 其中之一`)
    }
    return pass
  }

  toStr (time: number, unit: string,): string {
    this.validateUnit(unit)
    const system = unit === Unit.hour ? 24 : 60
    time %= system
    if (time < 0) {
      time += system
    }
    return (time < 10 ? '0' : '') + time
  }

  getFiducial (initTime: string): number {
    if (initTime.split(':').length - 1 === 1) {
      initTime += ':00'
    }
    return Number(initTime.replace(/:/g, ''))
  }

  preciseDiff (time?: HourJs | string) {
    const handler = ({ hours_num, minutes_num, seconds_num, latterFiducial }:
      { hours_num: number, minutes_num: number, seconds_num: number, latterFiducial: number }) => {
      const diffNum = latterFiducial - this.fiducial
      const isAfter = diffNum < 0
      const isSameOrAfter = diffNum <= 0

      let hourDiff = hours_num - this.hours_num
      let minDiff = minutes_num - this.minutes_num
      let secDiff = seconds_num - this.seconds_num
      if (isAfter) {
        if (hourDiff !== 0) {
          hourDiff = -hourDiff
        }
        if (minDiff !== 0) {
          minDiff = -minDiff
        }
        if (secDiff !== 0) {
          secDiff = -secDiff
        }
      }

      if (secDiff < 0) {
        minDiff -= 1
        secDiff += 60
      }
      if (minDiff < 0 || (minDiff === 0 && secDiff < 0)) {
        hourDiff -= 1
        minDiff += 60
      }

      return {
        isAfter,
        isSameOrAfter,
        hours: hourDiff,
        minutes: minDiff,
        seconds: secDiff,
      }
    }

    if (time instanceof HourJs) {
      return handler({
        hours_num: time.hours_num,
        minutes_num: time.minutes_num,
        seconds_num: time.seconds_num,
        latterFiducial: time.fiducial,
      })
    } else {
      const { hours_num, minutes_num, seconds_num, fiducial: latterFiducial } = this.handleParam(time)
      return handler({
        hours_num,
        minutes_num,
        seconds_num,
        latterFiducial,
      })
    }
  }

  addOrSubtract (value: number, unit: string) {
    if (value === 0) {
      return this
    } else {
      this.validateUnit(unit)
      switch (unit) {
        case Unit.hour: {
          const hours = this.toStr(this.hours_num + value, Unit.hour)
          return hourjs(`${hours}:${this.minutes}:${this.seconds}`)
        }
        case Unit.minute: {
          let hours = this.hours, minutes = this.toStr(this.minutes_num + value, Unit.minute)
          const carryHoursInt = Math.floor((this.minutes_num + value) / 60)
          if (Math.abs(carryHoursInt) >= 1) {
            hours = this.toStr(this.hours_num + carryHoursInt, Unit.hour)
          }
          return hourjs(`${hours}:${minutes}:${this.seconds}`)
        }
        case Unit.second: {
          let hours = this.hours,
            minutes = this.minutes,
            seconds = this.toStr(this.seconds_num + value, Unit.second)
          const carryMinutesInt = Math.floor((this.seconds_num + value) / 60)
          if (Math.abs(carryMinutesInt) >= 1) {
            minutes = this.toStr(this.minutes_num + carryMinutesInt, Unit.minute)
          }
          const carryHoursInt = Math.floor((this.minutes_num + carryMinutesInt) / 60)
          if (Math.abs(carryHoursInt) >= 1) {
            hours = this.toStr(this.hours_num + carryHoursInt, Unit.hour)
          }
          return hourjs(`${hours}:${minutes}:${seconds}`)
        }
      }
    }
  }

  add (value: number, unit: string) {
    return this.addOrSubtract(value, unit)
  }

  subtract (value: number, unit: string) {
    return this.addOrSubtract(-value, unit)
  }

  isBetween (start?: HourJs | string, end?: HourJs | string, boundary: string = '[]') {
    if (!['[]', '[)', '()', '(]'].includes(boundary)) {
      throw Error(errPrefix + `${boundary}边界表达式需为 '[]', '[)', '()', '(]' 其中一种`)
    }
    return (boundary.startsWith('[') ? this.isSameOrAfter(start) : this.isAfter(start)) &&
      (boundary.endsWith(']') ? this.isSameOrBefore(end) : this.isBefore(end))
  }

  isBefore (time?: HourJs | string) {
    return time instanceof HourJs ? time.fiducial > this.fiducial :
      this.handleParam(time).fiducial > this.fiducial
  }

  isSameOrBefore (time?: HourJs | string) {
    return time instanceof HourJs ? time.fiducial >= this.fiducial :
      this.handleParam(time).fiducial >= this.fiducial
  }

  isAfter (time?: HourJs | string) {
    return time instanceof HourJs ? time.fiducial < this.fiducial :
      this.handleParam(time).fiducial < this.fiducial
  }

  isSameOrAfter (time?: HourJs | string) {
    return time instanceof HourJs ? time.fiducial <= this.fiducial :
      this.handleParam(time).fiducial <= this.fiducial
  }

  isSame (time?: HourJs | string) {
    if (time instanceof HourJs) {
      return time.fiducial === this.fiducial
    } else {
      const { hours, minutes, seconds } = this.handleParam(time)
      return hours === this.hours
        && minutes === this.minutes
        && seconds === this.seconds
    }
  }
}

export default function hourjs (initTime?: HourJs | string) {
  return new HourJs(initTime)
}
