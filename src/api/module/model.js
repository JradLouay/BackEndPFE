import mongoose, { Schema } from 'mongoose'

const moduleSchema = new Schema({
  moduleName: {
    type: String
  },
  version: {
    type: String
  },
  lastUpdate: {
    type: String
  },
  description: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

moduleSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      moduleName: this.moduleName,
      version: this.version,
      lastUpdate: this.lastUpdate,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Module', moduleSchema)

export const schema = model.schema
export default model
