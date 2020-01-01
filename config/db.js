import dotenv from 'dotenv'
dotenv.config()

const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_PORT,
    DB_NAME,
    DB_HOST
} = process.env

export const MONGO_URI = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

export const MONGO_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}