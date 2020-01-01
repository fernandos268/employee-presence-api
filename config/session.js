import dotenv from 'dotenv'
dotenv.config()
import { IN_PROD } from './app'

const ONE_HOUR = 1000 * 60 * 60
const THIRTY_MINUTES = ONE_HOUR / 2
const ONE_DAY = ONE_HOUR * 12
const SIX_HOURS = ONE_DAY / 2

const {
    SESSION_SECRET,
    SESSION_NAME = 'SID',
    SESSION_IDLE_TIMEOUT = THIRTY_MINUTES,
} = process.env

export const SESSION_ABSOLUTE_TIMEOUT = +(process.env.SESSION_ABSOLUTE_TIMEOUT || SIX_HOURS)

export const SESSION_OPTIONS = {
    secret: SESSION_SECRET,
    name: SESSION_NAME,
    cookie: {
        maxAge: +SESSION_IDLE_TIMEOUT,
        secure: IN_PROD,
        sameSite: true
    },
    rolling: true,
    resave: false,
    saveUninitialized: false

}

