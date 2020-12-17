# hourjs

Sometimes we deal with **TIME ONLY** strings like '10:01' or '10:01:02' which are considered wrong formats by dayjs or momentjs.

![NPM](https://nodei.co/npm/hourjs.png)

<br/>

### Features

- Written with TypeScript, >98% unit test coverage
- Bundled with rollup, support web & mini-program environment
- Parse, validate, manipulate, and display times in JavaScript
- Same modern API with dayjs and momentjs
- 0 dependency

<br/>

### Quick Start

``` bash
$ yarn add hourjs
```

```js
import hourjs from 'hourjs'

// Avaliable API for now
hourjs().isBetween()
hourjs().isBefore()
hourjs().isSameOrBefore()
hourjs().isAfter()
hourjs().isSameOrAfter()
hourjs().isSame()
hourjs().add()
hourjs().subtract()
hourjs().preciseDiff()
```
