import dotenv from 'dotenv'
dotenv.config()

const {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
} = process.env

export const REDIS_OPTIONS = {
    port: +REDIS_PORT,
    host: REDIS_HOST,
    password: REDIS_PASSWORD
}