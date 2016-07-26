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
  let currDepth = 0

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

export default function falconPunch (o = {}, opts = {}) {
  const {
    maxDepth,
    delimiter = '_'
  } = opts
  const keys = getKeys(o)
  if (maxDepth === 0 || keys.length === 0) return o

  const reducer = recurFlatten({ delimiter, maxDepth })
  return keys.reduce((acc, val) => {
    reducer(acc, o[val], val)
    return acc
  }, {})
}
