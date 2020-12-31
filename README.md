# hourjs

Sometimes we deal with **TIME ONLY** strings like '10:01' or '10:01:02' which are considered wrong formats by dayjs or
momentjs.

<p align="center">
  <a href="https://www.npmjs.com/package/hourjs"><img src="https://img.shields.io/npm/v/hourjs.svg" alt="NPM Version"></a>
  <a href="https://travis-ci.com/cloydlau/hourjs"><img src="https://img.shields.io/travis/cloydlau/hourjs.svg" alt="Build Status"></a>
  <a href="https://codecov.io/gh/cloydlau/hourjs"><img src="https://codecov.io/gh/cloydlau/hourjs/branch/master/graph/badge.svg" alt="Codecov"></a>
  <img src="https://david-dm.org/cloydlau/hourjs.svg" alt="Dependencies Status">
  <a href="https://github.com/cloydlau/hourjs/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="License"></a>
</p>

<br/>

### Features

- Parse, validate, manipulate, and display times in JavaScript
- Same modern API with dayjs and momentjs
- Written with TypeScript, 100% unit test coverage
- Support mini-program
- 0 dependency

<br/>

### Quick Start

![NPM](https://nodei.co/npm/hourjs.png)

``` bash
$ yarn add hourjs
```

```js
import hourjs from 'hourjs'

// Avaliable API for now
hourjs().isSame()
hourjs().isBetween()

hourjs().isBefore()
hourjs().isSameOrBefore()

hourjs().isAfter()
hourjs().isSameOrAfter()

hourjs().add()
hourjs().subtract()

hourjs().preciseDiff()
```

<br>

**arguments format (for all API)**

- Empty ```hourjs()``` means now
- HH:mm ```hourjs('01:02')```
- HH:mm:ss ```hourjs('23:59:59')```
- Instance of hourjs ```hourjs(hourjs('01:02'))```

<br>

**isBetween**

- The first argument and the second argument can be different in format

```isBetween('01:02', '23:59:59')```

- There's a third argument that controls inclusion relation, '[' indicates inclusion, '(' indicates exclusion

  ```hourjs('01:02').isBetween('01:02', '23:59:59', '(]')``` // will return false

  possible options:

  - [] (default)
  - ()
  - (]
  - [)

<br>

**preciseDiff**

> can be used to calculate a count down

```hourjs('01:02:03').preciseDiff('02:03:04')```

will return:

```
{
  hours: 1,
  minutes: 1,
  seconds: 1,
  isSame: false,
  isAfter: false,
  isBefore: true,
  isSameOrAfter: false,
  isSameOrBefore: true
}
```

<br>

### Use *dayjs* for same purpose

What's the difference?

- hourjs is more concise
- dayjs do not unify the usage between ordinary date strings and none-date strings
- dayjs didn't take in the *preciseDiff* PR, the plugin author publish [dayjs-precise-range](https://github.com/huangjinlin/dayjs-precise-range) under ISC licence
> *duration* plugin of dayjs can be used for diff calculation, but it's indirect to indicate sequence of time

```js
import dayjs from 'dayjs'
[
  'isBetween',
  'isSameOrAfter',
  'isSameOrBefore',
  'customParseFormat',
  'duration',
].map(v => {
  dayjs.extend(require(`dayjs/plugin/${v}.js`))
})

// isBefore
dayjs('10:13', 'HH:mm').isBefore(dayjs('10:13:59', 'HH:mm:ss'))
// isAfter
dayjs('10:13', 'HH:mm').isAfter(dayjs('10:13:59', 'HH:mm:ss'))
// isSame
dayjs('10:13', 'HH:mm').isSame(dayjs('10:13:59', 'HH:mm:ss'))
// isSameOrAfter
dayjs('01:02', 'HH:mm').isSameOrAfter(dayjs('01:02', 'HH:mm'))
// isSameOrBefore
dayjs('01:02', 'HH:mm').isSameOrBefore(dayjs('01:02', 'HH:mm'))
// isBetween
dayjs('01:02', 'HH:mm').isBetween(dayjs('01:02', 'HH:mm'), dayjs('23:59:59', 'HH:mm'), null, '(]')
// add
dayjs('01:02', 'HH:mm').add(1, 'hour').format('HH:mm')
// subtract
dayjs('01:02', 'HH:mm').subtract(1, 'hour').format('HH:mm')
// duration
// diff的调用者晚于参数时 结果为正数
dayjs.duration(dayjs('2020-01-01 01:01:01').diff()).$d
```
