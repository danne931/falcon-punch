import test from 'ava'
import flattenObjectDeep from '../index'

const o1 = {
  a: {
    b: 3
  }
}
const o2 = {
  a: 1,
  c: {
    d: 2,
    e: {
      f: {
        g: {},
        h: 4
      },
      i: 5
    }
  },
  j: {
    k: 6,
    l: 7
  }
}
const o3 = [
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
          g: {}
        }
      }
    ]
  },
  [[1, [{}]]]
]

test('should return empty POJO if undefined is 1st arg', t => {
  t.deepEqual(flattenObjectDeep(), {})
})

test('should return first arg if passed anything other than a POJO', t => {
  t.is(flattenObjectDeep(null), null)
  t.is(flattenObjectDeep(1), 1)
  t.is(flattenObjectDeep('string'), 'string')
  t.deepEqual(flattenObjectDeep({}), {})
})

test('should flatten object deep', t => {
  const expected = {
    a: 1,
    c_d: 2,
    c_e_f_g: {},
    c_e_f_h: 4,
    c_e_i: 5,
    j_k: 6,
    j_l: 7
  }
  t.deepEqual(flattenObjectDeep(o2), expected)
})

test('flatten arrays', t => {
  const expected = {
    '0.a.0.0.b': 0,
    '0.a.0.0.c': 1,
    '0.a.0.1': 10,
    '0.a.1.d.e': null,
    '0.a.1.d.f': [],
    '0.a.1.d.g': {},
    '1.0.0': 1,
    '1.0.1.0': {}
  }
  t.deepEqual(flattenObjectDeep(o3, '.'), expected)
})

test('passing a delimiter of type string will separate keys by the delimiter', t => {
  const expected = { a$b: 3 }
  t.deepEqual(flattenObjectDeep(o1, '$'), expected)
})

test('passing a delimiter of type number will separate keys by the delimiter', t => {
  const expected = { a100b: 3 }
  t.deepEqual(flattenObjectDeep(o1, 100), expected)
})

test('if the delimiter passed is not of type string or number, the default _ will be used', t => {
  const expected = { a_b: 3 }
  t.deepEqual(flattenObjectDeep(o1, {}), expected)
})
