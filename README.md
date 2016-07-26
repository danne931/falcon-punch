# falcon-punch

Flatten your POJOs/Arrays by a delimiter

![](http://i.giphy.com/y4dfjHr6NsjsY.gif)

[![Build Status](https://travis-ci.org/danne931/falcon-punch.svg?branch=master)](https://travis-ci.org/danne931/falcon-punch)
[![npm version](https://img.shields.io/npm/v/falcon-punch.svg?style=flat-square)](https://www.npmjs.com/package/falcon-punch)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
![](https://img.shields.io/badge/license-MIT-blue.svg)

## Install

```
$ npm install --save falcon-punch
```

Not using Node or a module bundler? Use a UMD build via the `<script>` tag.
- [https://npmcdn.com/falcon-punch/dist/falcon-punch.js](https://npmcdn.com/falcon-punch/dist/falcon-punch.js)
- [https://npmcdn.com/falcon-punch/dist/falcon-punch.min.js](https://npmcdn.com/falcon-punch/dist/falcon-punch.min.js)

## Usage

```javascript
import falconPunch from 'falcon-punch'

const o = {
  a: 1,
  b: {
    c: 'falcon',
    d: {
      e: 'punch'
    }
  }
}
// { a: 1, 'b_c': 'falcon', 'b_d_e': 'punch' }
falconPunch(o)  

// Specify opts: delimiter & maxDepth
// { a: 1, 'b???c': 'falcon', 'b???d': { e: 'punch' } }
falconPunch(o, { delimiter: '???', maxDepth: 2 })

// go crazy
const arr = [
  {
    a: [
      [
        {
          b: 0,
          c: 1
        },
        10
      ],
      {
        d: {
          e: null,
          f: [],
          g: {},
          h: undefined
        }
      }
    ]
  },
  [[1, [{}]]]
]
/* {
  '0.a.0.0.b': 0,
  '0.a.0.0.c': 1,
  '0.a.0.1': 10,
  '0.a.1.d.e': null,
  '0.a.1.d.f': [],
  '0.a.1.d.g': {},
  '0.a.1.d.h': undefined,
  '1.0.0': 1,
  '1.0.1.0': {}
}
*/
flattenObjectDeep(arr, { delimiter: '.' })
```
