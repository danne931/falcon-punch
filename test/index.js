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
          g: {},
          h: undefined
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
    '0.a.1.d.h': undefined,
    '1.0.0': 1,
    '1.0.1.0': {}
  }
  const opts = { delimiter: '.' }
  t.deepEqual(flattenObjectDeep(o3, opts), expected)
})

test('use default delimiter _ if delimiter opt is undefined', t => {
  const expected = { a_b: 3 }
  t.deepEqual(flattenObjectDeep(o1), expected)
})

test('passing a delimiter of type string will separate keys by the delimiter', t => {
  const expected = { a$b: 3 }
  const opts = { delimiter: '$' }
  t.deepEqual(flattenObjectDeep(o1, opts), expected)
})

test('passing a delimiter of type number will separate keys by the delimiter', t => {
  const expected = { a100b: 3 }
  const opts = { delimiter: 100 }
  t.deepEqual(flattenObjectDeep(o1, opts), expected)
})

test('allow consumer to specify maxDepth', t => {
  t.deepEqual(
    {
      0: o3[0],
      1: o3[1]
    },
    flattenObjectDeep(o3, { maxDepth: 1 })
  )

  t.deepEqual(
    {
      '0_a': o3[0].a,
      1: o3[1]
    },
    flattenObjectDeep(o3, { maxDepth: 2 })
  )

  t.deepEqual(
    {
      '0_a_0': o3[0].a[0],
      '0_a_1': o3[0].a[1],
      1: o3[1]
    },
    flattenObjectDeep(o3, { maxDepth: 3 })
  )

  t.deepEqual(
    {
      '0_a_0_0': o3[0].a[0][0],
      '0_a_0_1': o3[0].a[0][1],
      '0_a_1': o3[0].a[1],
      1: o3[1]
    },
    flattenObjectDeep(o3, { maxDepth: 4 })
  )

  t.deepEqual(
    {
      '0_a_0_0_b': o3[0].a[0][0].b,
      '0_a_0_0_c': o3[0].a[0][0].c,
      '0_a_0_1': o3[0].a[0][1],
      '0_a_1': o3[0].a[1],
      1: o3[1]
    },
    flattenObjectDeep(o3, { maxDepth: 5 })
  )
})

test('return props passed if consumer specifies maxDepth: 0', t => {
  t.deepEqual(
    o3,
    flattenObjectDeep(o3, { maxDepth: 0 })
  )
})
