const test = require('ava')
const flattenObjectDeep = require('..')

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

test('should return empty POJO if undefined is 1st arg', t => {
  t.deepEqual(flattenObjectDeep(), {})
})

test('should return first arg if passed anything other than a POJO', t => {
  t.deepEqual(flattenObjectDeep(null), null)
  t.deepEqual(flattenObjectDeep(1), 1)
  t.deepEqual(flattenObjectDeep('string'), 'string')
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
