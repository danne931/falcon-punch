import test from 'ava'
import falconPunch from '../index'

const o1 = {
  a: {
    b: 3
  }
}
const o2 = {
  a: 1,
  b: () => 3,
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
  t.deepEqual(falconPunch(), {})
})

test('should return first arg if passed anything other than an object or array', t => {
  t.is(falconPunch(null), null)
  t.is(falconPunch(1), 1)
  t.is(falconPunch('string'), 'string')
  const date = new Date()
  date.a = {
    b: 1,
    c: {
      d: []
    }
  }
  t.deepEqual(falconPunch(date), date)
})

test('observe empty array/object + depth:1 array/object behavior', t => {
  const o = { a: 1, b: 2 }
  const arr = [1, 2, 3]

  t.deepEqual(falconPunch({}), {})
  t.deepEqual(falconPunch([]), [])

  t.deepEqual(falconPunch(o), o)
  t.deepEqual(
    {
      0: arr[0],
      1: arr[1],
      2: arr[2]
    },
    falconPunch(arr)
  )
})

test('should flatten object deep', t => {
  const expected = {
    a: o2.a,
    b: o2.b,
    c_d: o2.c.d,
    c_e_f_g: o2.c.e.f.g,
    c_e_f_h: o2.c.e.f.h,
    c_e_i: o2.c.e.i,
    j_k: o2.j.k,
    j_l: o2.j.l
  }
  t.deepEqual(falconPunch(o2), expected)
})

test('should flatten arrays', t => {
  const expected = {
    '0.a.0.0.b': o3[0].a[0][0].b,
    '0.a.0.0.c': o3[0].a[0][0].c,
    '0.a.0.1': o3[0].a[0][1],
    '0.a.1.d.e': o3[0].a[1].d.e,
    '0.a.1.d.f': o3[0].a[1].d.f,
    '0.a.1.d.g': o3[0].a[1].d.g,
    '0.a.1.d.h': o3[0].a[1].d.h,
    '1.0.0': o3[1][0][0],
    '1.0.1.0': o3[1][0][1][0]
  }
  const opts = { delimiter: '.' }
  t.deepEqual(falconPunch(o3, opts), expected)
})

test('use default delimiter _ if delimiter opt is undefined', t => {
  const expected = { a_b: o1.a.b }
  t.deepEqual(falconPunch(o1), expected)
})

test('passing a delimiter will separate keys by the delimiter', t => {
  let expected = { a$b: o1.a.b }
  let opts = { delimiter: '$' }
  t.deepEqual(falconPunch(o1, opts), expected)

  expected = { a100b: o1.a.b }
  opts = { delimiter: 100 }
  t.deepEqual(falconPunch(o1, opts), expected)

  expected = { anullb: o1.a.b }
  opts = { delimiter: null }
  t.deepEqual(falconPunch(o1, opts), expected)

  const date = new Date()
  expected = { [`a${date}b`]: o1.a.b }
  opts = { delimiter: date }
  t.deepEqual(falconPunch(o1, opts), expected)
})

test('allow consumer to specify maxDepth', t => {
  t.deepEqual(
    {
      '0_a': o3[0].a,
      1: o3[1]
    },
    falconPunch(o3, { maxDepth: 1 })
  )

  t.deepEqual(
    {
      '0_a_0': o3[0].a[0],
      '0_a_1': o3[0].a[1],
      1: o3[1]
    },
    falconPunch(o3, { maxDepth: 2 })
  )

  t.deepEqual(
    {
      '0_a_0_0': o3[0].a[0][0],
      '0_a_0_1': o3[0].a[0][1],
      '0_a_1': o3[0].a[1],
      1: o3[1]
    },
    falconPunch(o3, { maxDepth: 3 })
  )

  t.deepEqual(
    {
      '0_a_0_0_b': o3[0].a[0][0].b,
      '0_a_0_0_c': o3[0].a[0][0].c,
      '0_a_0_1': o3[0].a[0][1],
      '0_a_1': o3[0].a[1],
      1: o3[1]
    },
    falconPunch(o3, { maxDepth: 4 })
  )

  t.deepEqual(
    {
      a: o2.a,
      b: o2.b,
      c_d: o2.c.d,
      c_e: o2.c.e,
      j: o2.j
    },
    falconPunch(o2, { maxDepth: 1 })
  )

  t.deepEqual(
    {
      a: o2.a,
      b: o2.b,
      c_d: o2.c.d,
      c_e_f: o2.c.e.f,
      c_e_i: o2.c.e.i,
      j: o2.j
    },
    falconPunch(o2, { maxDepth: 2 })
  )
})

test('return 1st arg if consumer specifies maxDepth: 0', t => {
  t.deepEqual(
    o3,
    falconPunch(o3, { maxDepth: 0 })
  )
})
