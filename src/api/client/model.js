import mongoose, { Schema } from 'mongoose'

const clientSchema = new Schema({
  clientName: {
    type: String
  },
  host: {
    type: String
  },
  port: {
    type: String
  },
  userName: {
    type: String
  },
  password: {
    type: String
  },
  image: {
    type: String
  },
  file: {
    type: String
  },
  version: {
    type: String
  },
  status: {
    type: String
  },
  lastUpdate: {
    type: String
  },
  deployedModules: [
    { type: Schema.Types.ObjectId, ref :'Module' } 
  ],
  variables: [
    {type: Schema.Types.ObjectId, ref: 'Variable'}
  ],
  schedulers: [{
    type: Schema.Types.ObjectId, ref: 'Scheduler'
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

clientSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      clientName: this.clientName,
      host: this.host,
      port: this.port,
      userName: this.userName,
      password: this.password,
      image: this.image,
      file: this.file,
      version: this.version,
      status: this.status,
      lastUpdate: this.lastUpdate,
      deployedModules: this.deployedModules,
      variables: this.variables,
      schedulers: this.schedulers,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Client', clientSchema)

export const schema = model.schema
export default model
