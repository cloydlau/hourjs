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
  fiducial: number

  constructor (initTime?: HourJs | string) {
    if (initTime) {
      if (initTime instanceof HourJs) {
        this.hours = initTime.hours
        this.minutes = initTime.minutes
        this.seconds = initTime.seconds
        this.fiducial = initTime.fiducial
      } else {
        const paramFormat = this.validateParam(initTime)
        const [hours, minutes, seconds] = initTime.split(':')
        this.hours = hours
        this.minutes = minutes
        if (paramFormat === ParamFormat.HHmm) {
          this.seconds = '00'
          this.fiducial = this.str2num(initTime + ':' + this.seconds)
        } else {
          this.seconds = seconds
          this.fiducial = this.str2num(initTime)
        }
      }
    }
    // 没传参取当前时间
    else {
      const now = new Date()
      this.seconds = this.toStr(now.getSeconds())
      this.minutes = this.toStr(now.getMinutes())
      this.hours = this.toStr(now.getHours())
      this.fiducial = Number(
        this.hours +
        this.minutes +
        this.seconds
      )
    }
  }

  validateParam (time: string) {
    if (time) {
      if (/^\d{2}:\d{2}$/.test(time)) {
        return ParamFormat.HHmm
      } else if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
        return ParamFormat.HHmmss
      } else {
        throw Error(`[hourjs] 参数格式为 HH:mm 或 HH:mm:ss `)
      }
    } else {
      throw Error(`[hourjs] 参数为空`)
    }
  }

  toStr (time: number): string {
    return (time < 10 ? '0' : '') + time
  }

  str2num (initTime: string): number {
    return Number(initTime.replace(/:/g, ''))
  }

  format (self: string, addend: number, divisor: number) {
    const num = Math.abs((Number(self) + addend) % divisor)
    return this.toStr(num)
  }

  preciseDiff (time: HourJs | string) {
    const handler = ({ hours, minutes, seconds, latterFiducial }:
      { hours: string, minutes: string, seconds: string, latterFiducial: number }) => {
      const diffNum = latterFiducial - this.fiducial
      const isAfter = diffNum < 0
      const isSameOrAfter = diffNum <= 0

      let hourDiff = Number(hours) - Number(this.hours)
      let minDiff = Number(minutes) - Number(this.minutes)
      let secDiff = Number(seconds) - Number(this.seconds)
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
        hours: time.hours,
        minutes: time.minutes,
        seconds: time.seconds,
        latterFiducial: time.fiducial,
      })
    } else {
      const paramFormat = this.validateParam(time)
      const [hours, minutes, seconds] = time.split(':')
      return handler({
        hours,
        minutes,
        seconds: seconds || '00',
        latterFiducial: this.str2num(time),
      })
    }
  }

  addOrSubtract (value: number, unit: Unit, isSubtract: boolean) {
    if (value === 0) {
      return this
    } else {
      if (isSubtract) {
        value = -value
      }
      switch (unit) {
        case Unit.hour: {
          return hourjs(`${this.format(this.hours, value, 24)}:${this.minutes}:${this.seconds}`)
        }
        case Unit.minute: {
          return hourjs(`${this.hours}:${this.format(this.minutes, value, 60)}:${this.seconds}`)
        }
        case Unit.second: {
          return hourjs(`${this.hours}:${this.minutes}:${this.format(this.seconds, value, 60)}`)
        }
        default: {
          throw Error('[hourjs] unit需为hour/minute/second其中之一')
        }
      }
    }
  }

  add (value: number, unit: Unit) {
    return this.addOrSubtract(value, unit, value < 0)
  }

  subtract (value: number, unit: Unit) {
    return this.addOrSubtract(value, unit, value > 0)
  }

  isBetween (start: HourJs | string, end: HourJs | string, boundary: string = '[]') {
    if (!/^[\[\(][\]\)]$/.test(boundary)) {
      throw Error(`[hourjs] ${boundary}不是一个有效的边界值`)
    }
    return (boundary.startsWith('[') ? this.isSameOrAfter(start) : this.isAfter(start)) &&
      (boundary.endsWith(']') ? this.isSameOrBefore(end) : this.isBefore(end))
  }

  isBefore (time: HourJs | string) {
    if (time instanceof HourJs) {
      return time.fiducial > this.fiducial
    } else {
      const paramFormat = this.validateParam(time)
      const [hours, minutes] = time.split(':')
      if (paramFormat === ParamFormat.HHmm) {
        return hours > this.hours
          || (hours === this.hours && minutes > this.minutes)
      } else {
        return this.str2num(time) > this.fiducial
      }
    }
  }

  isSameOrBefore (time: HourJs | string) {
    if (time instanceof HourJs) {
      return time.fiducial >= this.fiducial
    } else {
      const paramFormat = this.validateParam(time)
      const [hours, minutes] = time.split(':')
      if (paramFormat === ParamFormat.HHmm) {
        return hours > this.hours
          || (hours === this.hours && minutes >= this.minutes)
      } else {
        return this.str2num(time) >= this.fiducial
      }
    }
  }

  isAfter (time: HourJs | string) {
    if (time instanceof HourJs) {
      return time.fiducial < this.fiducial
    } else {
      const paramFormat = this.validateParam(time)
      const [hours, minutes] = time.split(':')
      if (paramFormat === ParamFormat.HHmm) {
        return hours < this.hours
          || (hours === this.hours && minutes < this.minutes)
      } else {
        return this.str2num(time) < this.fiducial
      }
    }
  }

  isSameOrAfter (time: HourJs | string) {
    if (time instanceof HourJs) {
      return time.fiducial <= this.fiducial
    } else {
      const paramFormat = this.validateParam(time)
      const [hours, minutes] = time.split(':')
      if (paramFormat === ParamFormat.HHmm) {
        return hours < this.hours
          || (hours === this.hours && minutes <= this.minutes)
      } else {
        return this.str2num(time) <= this.fiducial
      }
    }
  }

  isSame (time: HourJs | string) {
    if (time instanceof HourJs) {
      return time.fiducial === this.fiducial
    } else {
      const paramFormat = this.validateParam(time)
      const [hours, minutes, seconds] = time.split(':')
      if (paramFormat === ParamFormat.HHmm) {
        return hours === this.hours
          && minutes === this.minutes
      } else {
        return hours === this.hours
          && minutes === this.minutes
          && seconds === this.seconds
      }
    }
  }
}

export default function hourjs (initTime?: HourJs | string) {
  return new HourJs(initTime)
}
