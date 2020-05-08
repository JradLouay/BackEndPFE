import mongoose, { Schema } from 'mongoose'

const deploySchema = new Schema({
  clientId: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

deploySchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      clientId: this.clientId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Deploy', deploySchema)

export const schema = model.schema
export default model
