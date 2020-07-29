const mongoose = require('mongoose')
const activitylog = require('mongoose-activitylog')
 
const ActivitySchema = new mongoose.Schema()
ActivitySchema.plugin(activitylog)
 
const Activity = mongoose.model('Activity', ActivitySchema)
module.exports = Activity ;

// const mongoose = require('mongoose')
// const Schema = mongoose.Schema
// const { ObjectId } = Schema

// const LogSchema = new Schema({
//   action: { type: String, required: true },
//   category: { type: String, required: true },
//   createdBy: { type: ObjectId, ref: 'User', required: true },
//   message: { type: String, required: true },
//   diff: { type: Schema.Types.Mixed },
// },{
//   timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
// })

// LogSchema.index({ action: 1, category: 1 })

// module.exports = mongoose.model('Log', LogSchema)