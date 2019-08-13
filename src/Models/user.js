import mongoose , { Schema } from 'mongoose'

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  suffix: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    required: true
  },
  createdLeaves: [
    {
      type: Schema.Types.ObjectId,
      ref: "Leave"
    }
  ],
  assignedLeaves: [
    {
      type: Schema.Types.ObjectId,
      ref: "Leave"
    }
  ],
  createdOvertimes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Overtime"
    }
  ],
  assignedOvertimes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Overtime"
    }
  ]
}, { timestamps: true });

const User = mongoose.model('User', userSchema)

export default User
