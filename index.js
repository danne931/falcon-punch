import isPlainObject from 'lodash/isPlainObject'
import isEmpty from 'lodash/isEmpty'

module.exports = function flattenObjectDeep (o = {}, delimiter) {
  if (!isPlainObject(o) || isEmpty(o)) return o
  if (delimiter == null ||
    typeof delimiter !== 'string' &&
    typeof delimiter !== 'number'
  ) delimiter = '_'

  function recur (result, val, key) {
    if (!isPlainObject(val) || isEmpty(val)) {
      result[key] = val
    }

    Object.keys(val).forEach(nestedKey => {
      const nestedVal = val[nestedKey]
      if (isPlainObject(nestedVal)) {
        recur(result, nestedVal, `${key}${delimiter}${nestedKey}`)
      } else {
        result[`${key}${delimiter}${nestedKey}`] = nestedVal
      }
    })
  }

  return Object.keys(o).reduce((acc, val) => {
    recur(acc, o[val], val)
    return acc
  }, {})
}
