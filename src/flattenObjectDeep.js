const _ = require('lodash')

function flattenObjectDeep (o = {}, separator = '_') {
  if (_.isEmpty(o)) return o

  function recur (result, val, key) {
    if (!_.isPlainObject(val)) return

    _.each(val, (nestedVal, nestedKey) => {
      if (_.isPlainObject(nestedVal)) {
        recur(result, nestedVal, `${key}${separator}${nestedKey}`)
      } else {
        result[`${key}${separator}${nestedKey}`] = nestedVal
      }
    })
  }

  return _.transform(o, recur)
}

module.exports = {
  flattenObjectDeep
}
