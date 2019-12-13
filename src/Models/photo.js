import mongoose, { Schema } from 'mongoose'

const photoSchema = new Schema({
    fileName: {
        type: String,
        required: true
    },
    fileLocation: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
}, { timestamps: true });


const Photo = mongoose.model("Photo", photoSchema);

export default Photo
