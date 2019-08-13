import mongoose , { Schema } from 'mongoose'

const leaveSchema = new Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  approver: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    required: true
  }
}, { timestamps: true });


const Leave = mongoose.model('User', leaveSchema)

export default Leave
