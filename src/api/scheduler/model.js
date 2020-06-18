import mongoose, { Schema } from 'mongoose'

const schedulerSchema = new Schema({
  schedulerName: {
    type: String
  },
  description: {
    type: String
  },
  date: {
    type: Date
  },
  time: {
    type: Date
  },
  version: {
    type: String
  },
  type: {
    type: String
  },
  status: {
    type: String
  },
  feedBack: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

schedulerSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      schedulerName: this.schedulerName,
      description: this.description,
      date: this.date,
      time: this.time,
      version: this.version,
      type: this.type,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Scheduler', schedulerSchema)

export const schema = model.schema
export default model
