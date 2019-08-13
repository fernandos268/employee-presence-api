import mongoose , { Schema } from 'mongoose'

const overtimeSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
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
  createdBy: {
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
  },
  remarks: {
    type: String,
    required: false
  },
},{ timestamps: true });


const Overtime = mongoose.model("Overtime", overtimeSchema);

export default Overtime
