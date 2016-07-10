const isPlainObject = require('lodash/isPlainObject')
const isEmpty = require('lodash/isEmpty')
const transform = require('lodash/transform')
const isString = require('lodash/isString')
const each = require('lodash/each')

module.exports = function flattenObjectDeep (o = {}, delimiter) {
  if (!isPlainObject(o) || isEmpty(o)) return o
  delimiter = delimiter != null && isString(delimiter)
    ? delimiter
    : '_'

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
