const getType = val => Object.prototype.toString.call(val)

const getKeys = props => {
  const type = getType(props)
  return type === '[object Object]' || type === '[object Array]'
    ? Object.keys(props)
    : []
}

const recurFlatten = ({
  delimiter,
  maxDepth
}) => {
  let currDepth = 1

  return function recur (acc, val, key) {
    const keys = getKeys(val)
    if (keys.length === 0 || currDepth === maxDepth) {
      acc[key] = val
      return
    }

    currDepth += 1

    keys.forEach(nestedKey => {
      const nestedVal = val[nestedKey]
      const nestedKeys = getKeys(nestedVal)
      const nextKey = key + delimiter + nestedKey

      if (nestedKeys.length > 0) {
        recur(acc, nestedVal, nextKey)
      } else {
        acc[nextKey] = nestedVal
      }
    })
  }
}

export default function flattenObjectDeep (o = {}, opts = {}) {
  let { delimiter } = opts
  const { maxDepth } = opts
  const keys = getKeys(o)

  if (maxDepth === 0 || keys.length === 0) return o
  if (delimiter == null ||
    typeof delimiter !== 'string' &&
    typeof delimiter !== 'number'
  ) delimiter = '_'

  const reducer = recurFlatten({ delimiter, maxDepth })
  return keys.reduce((acc, val) => {
    reducer(acc, o[val], val)
    return acc
  }, {})
}
