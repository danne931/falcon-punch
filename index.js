import isPlainObject from 'lodash/isPlainObject'
import isEmpty from 'lodash/isEmpty'
import transform from 'lodash/transform'
import each from 'lodash/each'

module.exports = function flattenObjectDeep (o = {}, delimiter) {
  if (!isPlainObject(o) || isEmpty(o)) return o
  if (delimiter == null ||
    typeof delimiter !== 'string' &&
    typeof delimiter !== 'number'
  ) delimiter = '_'

  function recur (result, val, key) {
    if (!isPlainObject(val)) {
      result[key] = val
      return
    }

    each(val, (nestedVal, nestedKey) => {
      if (isPlainObject(nestedVal)) {
        recur(result, nestedVal, `${key}${delimiter}${nestedKey}`)
      } else {
        result[`${key}${delimiter}${nestedKey}`] = nestedVal
      }
    })
  }

  return transform(o, recur)
}
