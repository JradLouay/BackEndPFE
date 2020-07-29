const _ = require('lodash')
const LogSchema = require('./Activity')
const { getDiff } = require('./diff')

const plugin = function (schema, options) {
  schema.post('init', doc => {
    doc._original = doc.toObject({transform: false})
  })
  schema.pre('save', function (next) {
    if (this.isNew) {
      next()
    }else {
      this._diff = getDiff(this, this._original)
      next()
    }
})
  schema.methods.log = (data) => {
    data.diff = {
      before: this._original,
      after: this._diff,
    }
    console.log("log creation ................");
    return LogSchema.create(data)
  }
}

module.exports = plugin