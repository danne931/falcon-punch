import isPOJO from 'lodash/isPlainObject'

const isEmptyPOJO = o => Object.keys(o).length === 0
const recurFlatten = delimiter => function recur (acc, val, key) {
  if (!isPOJO(val) || isEmptyPOJO(val)) {
    acc[key] = val
  }

  Object.keys(val).forEach(nestedKey => {
    const nestedVal = val[nestedKey]
    if (isPOJO(nestedVal)) {
      recur(acc, nestedVal, `${key}${delimiter}${nestedKey}`)
    } else {
      acc[`${key}${delimiter}${nestedKey}`] = nestedVal
    }
  })
}

export default function flattenObjectDeep (o = {}, delimiter) {
  if (!isPOJO(o) || isEmptyPOJO(o)) return o
  if (delimiter == null ||
    typeof delimiter !== 'string' &&
    typeof delimiter !== 'number'
  ) delimiter = '_'

  const reducer = recurFlatten(delimiter)
  return Object.keys(o).reduce((acc, val) => {
    reducer(acc, o[val], val)
    return acc
  }, {})
}
