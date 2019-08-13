import mongoose from 'mongoose'
import express from 'express'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import typeDefs from './src/typeDefs'
import resolvers from './src/resolvers'
import reqAuth from './src/Middlewares/reqAuth'

import {
   APP_PORT,
   DB_USERNAME,
   DB_PASSWORD,
   DB_PORT,
   DB_NAME,
   DB_HOST,
   IN_PROD,
   SESS_NAME,
   SESS_SECRET,
   SESS_LIFETIME,
   REDIS_HOST,
   REDIS_PORT,
   REDIS_PASSWORD
} from './config'


(async () => {
   try {
      await mongoose.connect(
         `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
         { useNewUrlParser: true }
      )

      const app = express()

      app.disable('x-powered-by')

      app.use(reqAuth)

      // const RedisStore = connectRedis(session)

      // const store = new RedisStore({
      //    host: REDIS_HOST,
      //    port: REDIS_PORT,
      //    pass: REDIS_PASSWORD
      // })

      // app.use(session({
      //    store,
      //    name: SESS_NAME,
      //    secret: SESS_SECRET,
      //    resave: true,
      //    rolling: true,
      //    saveUninitialized: false,
      //    cookie: {
      //       maxAge: parseInt(SESS_LIFETIME),
      //       sameSite: true,
      //       secure: IN_PROD
      //    }
      //    }))


      const server = new ApolloServer({
         typeDefs,
         resolvers,
         playground: IN_PROD ? false : {
            settings: {
               'request.credentials': 'include'
            }
         },
         context: ({ req, res }) => ({ req, res })
      })

      server.applyMiddleware({ app, cors: false })

      app.listen({ port: APP_PORT }, () =>
         console.log(`http://localhost:${APP_PORT}${server.graphqlPath}`)
      )
   }
   catch(e) {
      console.log(e);
   }
})()
