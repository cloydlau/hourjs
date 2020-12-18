# hourjs

Sometimes we deal with **TIME ONLY** strings like '10:01' or '10:01:02' which are considered wrong formats by dayjs or
momentjs.

<p align="center">
  <a href="https://www.npmjs.com/package/hourjs"><img src="https://img.shields.io/npm/v/hourjs.svg?style=flat-square&colorB=51C838" alt="NPM Version"></a>
  <a href="https://travis-ci.com/cloydlau/hourjs"><img src="https://img.shields.io/travis/cloydlau/hourjs.svg?style=flat-square" alt="Build Status"></a>
  <a href="https://codecov.io/gh/cloydlau/hourjs"><img src="https://img.shields.io/codecov/c/github/cloydlau/hourjs.svg?style=flat-square" alt="Codecov"></a>
  <img src="https://david-dm.org/cloydlau/hourjs.svg" alt="Dependencies Status">
  <a href="https://github.com/cloydlau/hourjs/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square" alt="License"></a>
</p>

<br/>

### Features

- Parse, validate, manipulate, and display times in JavaScript
- Same modern API with dayjs and momentjs
- Written with TypeScript, > 98% unit test coverage
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

- There's a third argument that controls inclusion relation ('[]' by default)

  ```hourjs('01:02').isBetween('01:02', '23:59:59', '(]')``` // will return false

  possible options:

  - []
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
  isAfter: false,
  isSameOrAfter: false,
}
```
