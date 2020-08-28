const mongoose = require('mongoose')
const activitylog = require('mongoose-activitylog')
 
const ActivitySchema = new mongoose.Schema()
ActivitySchema.plugin(activitylog)
 
const Activity = mongoose.model('Activity', ActivitySchema)
module.exports = Activity ;

