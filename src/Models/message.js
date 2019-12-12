import mongoose, { Schema } from 'mongoose'

const messageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    isFavorite: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });


const Message = mongoose.model("Message", messageSchema);

export default Message
