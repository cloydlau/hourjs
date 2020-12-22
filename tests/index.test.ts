import hourjs from '../src/index'

const sameResult = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  isAfter: false,
  isSameOrAfter: true,
}

describe('比较运算', () => {
  describe('isSame', () => {
    it('HH:mm', () => {
      expect(hourjs('05:12').isSame('05:12')).toBe(true)
    })
    it('HH:mm:ss', () => {
      expect(hourjs('05:12:01').isSame('05:12:01')).toBe(true)
    })
    it('HH:mm - HH:mm:ss', () => {
      expect(hourjs('05:12').isSame('05:12:01')).toBe(false)
    })
  })

  describe('isBetween', () => {
    describe('[]', () => {
      it('HH:mm', () => {
        expect(hourjs('05:12').isBetween('05:12', '05:13')).toBe(true)
      })
      it('HH:mm:ss', () => {
        expect(hourjs('05:12:01').isBetween('05:12:01', '05:13:01')).toBe(true)
      })
      it('HH:mm:ss - HH:mm - HH:mm:ss', () => {
        expect(hourjs('05:12:01').isBetween('05:12', '05:13:01')).toBe(true)
      })
      it('HH:mm:ss - HH:mm:ss - HH:mm', () => {
        expect(hourjs('05:12:01').isBetween('05:12:01', '05:13')).toBe(true)
      })
      it('HH:mm - HH:mm - HH:mm:ss', () => {
        expect(hourjs('05:12').isBetween('05:12', '05:13:01')).toBe(true)
      })
      it('HH:mm - HH:mm:ss - HH:mm', () => {
        expect(hourjs('05:12').isBetween('05:12:00', '05:13')).toBe(true)
      })
    })

    describe('()', () => {
      it('HH:mm', () => {
        expect(hourjs('05:12').isBetween('05:11', '05:13', '()')).toBe(true)
      })
      it('HH:mm:ss', () => {
        expect(hourjs('05:12:01').isBetween('05:11:01', '05:13:01', '()')).toBe(true)
      })
      it('HH:mm:ss - HH:mm - HH:mm:ss', () => {
        expect(hourjs('05:12:01').isBetween('05:12', '05:13:01', '()')).toBe(true)
      })
      it('HH:mm:ss - HH:mm:ss - HH:mm', () => {
        expect(hourjs('05:12:01').isBetween('05:12:00', '05:13', '()')).toBe(true)
      })
      it('HH:mm - HH:mm - HH:mm:ss', () => {
        expect(hourjs('05:12').isBetween('05:11', '05:13:01', '()')).toBe(true)
      })
      it('HH:mm - HH:mm:ss - HH:mm', () => {
        expect(hourjs('05:12').isBetween('05:11:59', '05:13', '()')).toBe(true)
      })
    })

    describe('[)', () => {
      it('HH:mm', () => {
        expect(hourjs('05:12').isBetween('05:12', '05:13', '[)')).toBe(true)
      })
      it('HH:mm:ss', () => {
        expect(hourjs('05:12:01').isBetween('05:12:01', '05:13:01', '[)')).toBe(true)
      })
      it('HH:mm:ss - HH:mm - HH:mm:ss', () => {
        expect(hourjs('05:12:00').isBetween('05:12', '05:13:01', '[)')).toBe(true)
      })
      it('HH:mm:ss - HH:mm:ss - HH:mm', () => {
        expect(hourjs('05:12:01').isBetween('05:12:01', '05:13', '[)')).toBe(true)
      })
      it('HH:mm - HH:mm - HH:mm:ss', () => {
        expect(hourjs('05:12').isBetween('05:12', '05:13:01', '[)')).toBe(true)
      })
      it('HH:mm - HH:mm:ss - HH:mm', () => {
        expect(hourjs('05:12').isBetween('05:12:00', '05:13', '[)')).toBe(true)
      })
    })

    describe('(]', () => {
      it('HH:mm', () => {
        expect(hourjs('05:12').isBetween('05:11', '05:12', '(]')).toBe(true)
      })
      it('HH:mm:ss', () => {
        expect(hourjs('05:12:01').isBetween('05:12:00', '05:12:01', '(]')).toBe(true)
      })
      it('HH:mm:ss - HH:mm - HH:mm:ss', () => {
        expect(hourjs('05:12:00').isBetween('05:11', '05:12:00', '(]')).toBe(true)
      })
      it('HH:mm:ss - HH:mm:ss - HH:mm', () => {
        expect(hourjs('05:12:00').isBetween('05:11:59', '05:12', '(]')).toBe(true)
      })
      it('HH:mm - HH:mm - HH:mm:ss', () => {
        expect(hourjs('05:12').isBetween('05:11', '05:12:00', '(]')).toBe(true)
      })
      it('HH:mm - HH:mm:ss - HH:mm', () => {
        expect(hourjs('05:12').isBetween('05:11:59', '05:12', '(]')).toBe(true)
      })
    })
  })

  describe('isBefore', () => {
    it('HH:mm', () => {
      expect(hourjs('05:11').isBefore('05:12')).toBe(true)
    })
    it('HH:mm:ss', () => {
      expect(hourjs('05:11:01').isBefore('05:12:01')).toBe(true)
    })
    it('HH:mm:ss - HH:mm', () => {
      expect(hourjs('05:11:01').isBefore('05:12')).toBe(true)
      expect(hourjs('05:12:01').isBefore('05:12')).toBe(false)
    })
    it('HH:mm - HH:mm:ss', () => {
      expect(hourjs('05:11').isBefore('05:12:01')).toBe(true)
      expect(hourjs('05:12').isBefore('05:12:01')).toBe(true)
    })
  })

  describe('isAfter', () => {
    it('HH:mm', () => {
      expect(hourjs('05:12').isAfter('05:11')).toBe(true)
    })
    it('HH:mm:ss', () => {
      expect(hourjs('05:12:01').isAfter('05:11:01')).toBe(true)
    })
    it('HH:mm:ss - HH:mm', () => {
      expect(hourjs('05:12:01').isAfter('05:11')).toBe(true)
      expect(hourjs('05:12:01').isAfter('05:12')).toBe(true)
    })
    it('HH:mm - HH:mm:ss', () => {
      expect(hourjs('05:12').isAfter('05:11:01')).toBe(true)
      expect(hourjs('05:12').isAfter('05:12:01')).toBe(false)
    })
  })

  describe('isSameOrBefore', () => {
    describe('Same', () => {
      it('HH:mm', () => {
        expect(hourjs('05:12').isSameOrBefore('05:12')).toBe(true)
      })
      it('HH:mm:ss', () => {
        expect(hourjs('05:12:01').isSameOrBefore('05:12:01')).toBe(true)
      })
      it('HH:mm:ss - HH:mm', () => {
        expect(hourjs('05:12:00').isSameOrBefore('05:12')).toBe(true)
      })
      it('HH:mm - HH:mm:ss', () => {
        expect(hourjs('05:12').isSameOrBefore('05:12:00')).toBe(true)
      })
    })

    describe('Before', () => {
      it('HH:mm', () => {
        expect(hourjs('05:11').isSameOrBefore('05:12')).toBe(true)
      })
      it('HH:mm:ss', () => {
        expect(hourjs('05:11:01').isSameOrBefore('05:12:01')).toBe(true)
      })
      it('HH:mm:ss - HH:mm', () => {
        expect(hourjs('05:11:00').isSameOrBefore('05:12')).toBe(true)
      })
      it('HH:mm - HH:mm:ss', () => {
        expect(hourjs('05:11').isSameOrBefore('05:12:00')).toBe(true)
      })
    })
  })

  describe('isSameOrAfter', () => {
    describe('Same', () => {
      it('HH:mm', () => {
        expect(hourjs('05:12').isSameOrAfter('05:12')).toBe(true)
      })
      it('HH:mm:ss', () => {
        expect(hourjs('05:12:01').isSameOrAfter('05:12:01')).toBe(true)
      })
      it('HH:mm:ss - HH:mm', () => {
        expect(hourjs('05:12:00').isSameOrAfter('05:12')).toBe(true)
      })
      it('HH:mm - HH:mm:ss', () => {
        expect(hourjs('05:12').isSameOrAfter('05:12:00')).toBe(true)
      })
    })

    describe('Before', () => {
      it('HH:mm', () => {
        expect(hourjs('05:12').isSameOrAfter('05:11')).toBe(true)
      })
      it('HH:mm:ss', () => {
        expect(hourjs('05:12:01').isSameOrAfter('05:11:01')).toBe(true)
      })
      it('HH:mm:ss - HH:mm', () => {
        expect(hourjs('05:12:00').isSameOrAfter('05:11')).toBe(true)
      })
      it('HH:mm - HH:mm:ss', () => {
        expect(hourjs('05:12').isSameOrAfter('05:11:00')).toBe(true)
      })
    })
  })
})

describe('加减运算', () => {
  describe('add', () => {
    describe('zero', () => {
      it('HH:mm', () => {
        expect(hourjs('05:12').add(0, 'hour').isSame('05:12')).toBe(true)
        expect(hourjs('05:12:11').add(-0, 'second').isSame('05:12:11')).toBe(true)
      })
    })

    describe('hour', () => {
      it('HH:mm', () => {
        expect(hourjs('05:12').add(1, 'hour').isSame('06:12')).toBe(true)
      })
      it('HH:mm 进位', () => {
        expect(hourjs('05:12').add(23, 'hour').isSame('04:12')).toBe(true)
      })
      it('HH:mm 退位', () => {
        expect(hourjs('05:12').add(-6, 'hour').isSame('23:12')).toBe(true)
      })
      it('HH:mm:ss', () => {
        expect(hourjs('05:12:01').add(1, 'hour').isSame('06:12:01')).toBe(true)
      })
      it('HH:mm:ss 进位', () => {
        expect(hourjs('05:12:01').add(23, 'hour').isSame('04:12:01')).toBe(true)
      })
      it('HH:mm:ss 退位', () => {
        expect(hourjs('05:12:01').add(-6, 'hour').isSame('23:12:01')).toBe(true)
      })
    })

    describe('minute', () => {
      it('HH:mm', () => {
        expect(hourjs('05:12').add(1, 'minute').isSame('05:13')).toBe(true)
      })
      it('HH:mm 进位', () => {
        expect(hourjs('05:12').add(60, 'minute').isSame('06:12')).toBe(true)
      })
      it('HH:mm 退位', () => {
        expect(hourjs('05:12').add(-60, 'minute').isSame('04:12')).toBe(true)
      })
      it('HH:mm:ss', () => {
        expect(hourjs('05:12:01').add(1, 'minute').isSame('05:13:01')).toBe(true)
      })
      it('HH:mm:ss 进位', () => {
        expect(hourjs('05:12:01').add(60, 'minute').isSame('06:12:01')).toBe(true)
      })
      it('HH:mm:ss 退位', () => {
        expect(hourjs('05:12:01').add(-60, 'minute').isSame('04:12:01')).toBe(true)
      })
    })

    describe('second', () => {
      it('HH:mm', () => {
        expect(hourjs('05:12').add(1, 'second').isSame('05:12')).toBe(false)
      })
      it('HH:mm 进位', () => {
        expect(hourjs('05:12').add(60, 'second').isSame('05:13')).toBe(true)
      })
      it('HH:mm 退位', () => {
        expect(hourjs('05:12').add(-60, 'second').isSame('05:11')).toBe(true)
      })
      it('HH:mm:ss', () => {
        expect(hourjs('05:12:01').add(1, 'second').isSame('05:12:02')).toBe(true)
      })
      it('HH:mm:ss 进位', () => {
        expect(hourjs('05:12:01').add(60, 'second').isSame('05:13:01')).toBe(true)
      })
      it('HH:mm:ss 进两位', () => {
        expect(hourjs('05:59:59').add(1, 'second').isSame('06:00:00')).toBe(true)
      })
      it('HH:mm:ss 进三位', () => {
        expect(hourjs('23:59:59').add(1, 'second').isSame('00:00:00')).toBe(true)
      })
      it('HH:mm:ss 退位', () => {
        expect(hourjs('05:12:01').add(-60, 'second').isSame('05:11:01')).toBe(true)
      })
      it('HH:mm:ss 退两位', () => {
        expect(hourjs('05:00:01').add(-60, 'second').isSame('04:59:01')).toBe(true)
      })
      it('HH:mm:ss 退三位', () => {
        expect(hourjs('00:00:00').add(-1, 'second').isSame('23:59:59')).toBe(true)
      })
    })
  })

  describe('subtract', () => {
    describe('zero', () => {
      it('HH:mm', () => {
        expect(hourjs('05:12').subtract(0, 'hour').isSame('05:12')).toBe(true)
        expect(hourjs('05:12:11').subtract(-0, 'second').isSame('05:12:11')).toBe(true)
      })
    })

    describe('hour', () => {
      it('HH:mm', () => {
        expect(hourjs('05:12').subtract(1, 'hour').isSame('04:12')).toBe(true)
      })
      it('HH:mm 进位', () => {
        expect(hourjs('05:12').subtract(-6, 'hour').isSame('11:12')).toBe(true)
      })
      it('HH:mm 退位', () => {
        expect(hourjs('05:12').subtract(23, 'hour').isSame('06:12')).toBe(true)
      })
      it('HH:mm:ss', () => {
        expect(hourjs('05:12:01').subtract(1, 'hour').isSame('04:12:01')).toBe(true)
      })
      it('HH:mm:ss 进位', () => {
        expect(hourjs('05:12:01').subtract(-6, 'hour').isSame('11:12:01')).toBe(true)
      })
      it('HH:mm:ss 退位', () => {
        expect(hourjs('05:12:01').subtract(23, 'hour').isSame('06:12:01')).toBe(true)
      })
    })

    describe('minute', () => {
      it('HH:mm', () => {
        expect(hourjs('05:12').subtract(1, 'minute').isSame('05:11')).toBe(true)
      })
      it('HH:mm 进位', () => {
        expect(hourjs('05:12').subtract(-60, 'minute').isSame('06:12')).toBe(true)
      })
      it('HH:mm 退位', () => {
        expect(hourjs('05:12').subtract(60, 'minute').isSame('04:12')).toBe(true)
      })
      it('HH:mm:ss', () => {
        expect(hourjs('05:12:01').subtract(1, 'minute').isSame('05:11:01')).toBe(true)
      })
      it('HH:mm:ss 进位', () => {
        expect(hourjs('05:12:01').subtract(-60, 'minute').isSame('06:12:01')).toBe(true)
      })
      it('HH:mm:ss 退位', () => {
        expect(hourjs('05:12:01').subtract(60, 'minute').isSame('04:12:01')).toBe(true)
      })
    })

    describe('second', () => {
      it('HH:mm', () => {
        expect(hourjs('05:12').subtract(1, 'second').isSame('05:11')).toBe(false)
      })
      it('HH:mm 进位', () => {
        expect(hourjs('05:12').subtract(-60, 'second').isSame('05:13')).toBe(true)
      })
      it('HH:mm 退位', () => {
        expect(hourjs('05:12').subtract(60, 'second').isSame('05:11')).toBe(true)
      })
      it('HH:mm:ss', () => {
        expect(hourjs('05:12:01').subtract(1, 'second').isSame('05:12:00')).toBe(true)
      })
      it('HH:mm:ss 进位', () => {
        expect(hourjs('05:12:01').subtract(-60, 'second').isSame('05:13:01')).toBe(true)
      })
      it('HH:mm:ss 退位', () => {
        expect(hourjs('05:12:01').subtract(60, 'second').isSame('05:11:01')).toBe(true)
      })
    })
  })
})

describe('差值运算', () => {
  describe('isAfter', () => {
    it('HH:mm', () => {
      expect(hourjs('06:01').preciseDiff('05:11')).toEqual({
        hours: 0,
        minutes: 50,
        seconds: 0,
        isAfter: true,
        isSameOrAfter: true,
      })
    })
    it('HH:mm:ss', () => {
      expect(hourjs('06:12:19').preciseDiff('05:11:20')).toEqual({
        hours: 1,
        minutes: 0,
        seconds: 59,
        isAfter: true,
        isSameOrAfter: true,
      })
    })
    it('HH:mm:ss - HH:mm', () => {
      expect(hourjs('06:01:01').preciseDiff('05:11')).toEqual({
        hours: 0,
        minutes: 50,
        seconds: 1,
        isAfter: true,
        isSameOrAfter: true,
      })
    })
    it('HH:mm - HH:mm:ss', () => {
      expect(hourjs('05:12').preciseDiff('05:11:01')).toEqual({
        hours: 0,
        minutes: 0,
        seconds: 59,
        isAfter: true,
        isSameOrAfter: true,
      })
    })
  })

  describe('isSameOrAfter', () => {
    it('HH:mm', () => {
      expect(hourjs('05:11').preciseDiff('05:11')).toEqual(sameResult)
    })
    it('HH:mm:ss', () => {
      expect(hourjs('05:12:01').preciseDiff('05:12:01')).toEqual(sameResult)
    })
    it('HH:mm:ss - HH:mm', () => {
      expect(hourjs('05:12:00').preciseDiff('05:12')).toEqual(sameResult)
    })
    it('HH:mm - HH:mm:ss', () => {
      expect(hourjs('05:12').preciseDiff('05:12:00')).toEqual(sameResult)
    })
  })
})

describe('以hourjs实例作为参数', () => {
  it('构造参数', () => {
    expect(hourjs(hourjs('05:12')).isSame(hourjs('05:12'))).toBe(true)
  })
  it('isSame', () => {
    expect(hourjs('05:12').isSame(hourjs('05:12'))).toBe(true)
  })
  it('isBefore', () => {
    expect(hourjs('05:12').isBefore(hourjs('06:12'))).toBe(true)
  })
  it('isSameOrBefore', () => {
    expect(hourjs('05:12').isSameOrBefore(hourjs('05:12'))).toBe(true)
    expect(hourjs('05:12').isSameOrBefore(hourjs('06:12'))).toBe(true)
  })
  it('isAfter', () => {
    expect(hourjs('05:12').isAfter(hourjs('04:12'))).toBe(true)
  })
  it('isSameOrAfter', () => {
    expect(hourjs('05:12').isSameOrAfter(hourjs('04:12'))).toBe(true)
    expect(hourjs('05:12').isSameOrAfter(hourjs('05:12'))).toBe(true)
  })
  it('isBetween', () => {
    expect(hourjs('05:12').isBetween(hourjs('04:12'), hourjs('06:12'))).toBe(true)
    expect(hourjs('05:12').isBetween(hourjs('04:12'), '06:12')).toBe(true)
    expect(hourjs('05:12').isBetween('04:12', hourjs('06:12'))).toBe(true)
  })
  it('preciseDiff', () => {
    expect(hourjs('05:12').preciseDiff(hourjs('05:12'))).toEqual(sameResult)
  })
})

describe('默认参数', () => {
  it('isSame', () => {
    expect(hourjs().isSame()).toBe(true)
  })
  it('isBefore', () => {
    expect(hourjs().isBefore()).toBe(false)
  })
  it('isSameOrBefore', () => {
    expect(hourjs().isSameOrBefore()).toBe(true)
  })
  it('isAfter', () => {
    expect(hourjs().isAfter()).toBe(false)
  })
  it('isSameOrAfter', () => {
    expect(hourjs().isSameOrAfter()).toBe(true)
  })
  it('isBetween', () => {
    expect(hourjs().isBetween()).toBe(true)
  })
  it('isBetween ()', () => {
    expect(hourjs().isBetween(...[, , '()'])).toBe(false)
  })
  it('isBetween [)', () => {
    expect(hourjs().isBetween(...[, , '[)'])).toBe(false)
  })
  it('isSame (]', () => {
    expect(hourjs().isBetween(...[, , '(]'])).toBe(false)
  })
  it('preciseDiff', () => {
    expect(hourjs().preciseDiff()).toEqual(sameResult)
  })
})

describe('参数错误', () => {
  it('时间格式错误', () => {
    expect(() => {
      hourjs('05-12')
    }).toThrow()
  })
  it('unit格式错误', () => {
    expect(() => {
      hourjs('05:12').subtract(1, 'seconds').isSame('05:11')
    }).toThrow()
  })
  it('边界表达式格式错误', () => {
    expect(() => {
      hourjs('05:12').isBetween('05:12', '05:13', '[>')
    }).toThrow()
  })
})
