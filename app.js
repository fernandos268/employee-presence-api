import express from 'express'
import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import depthLimit from 'graphql-depth-limit'
import { createServer } from 'http'

import typeDefs from './src/typeDefs'
import resolvers from './src/resolvers'
import reqAuth from './src/Middlewares/reqAuth'



// import {
//    APP_PORT,
//    DB_USERNAME,
//    DB_PASSWORD,
//    DB_PORT,
//    DB_NAME,
//    DB_HOST,
//    SESS_NAME,
//    SESS_SECRET,
//    SESS_LIFETIME,

//    REDIS_HOST,
//    REDIS_PORT,
//    REDIS_PASSWORD,

//    IN_PROD,
// } from './config'

import {
   MONGO_URI,
   MONGO_OPTIONS,
   REDIS_OPTIONS,
   SESSION_OPTIONS,
   APP_PORT,
   CORS_OPTIONS,
   IN_PROD
} from './config'

   ; (async () => {
      try {
         await mongoose.connect(
            MONGO_URI,
            MONGO_OPTIONS
         )

         mongoose.set('useFindAndModify', false)

         const RedisStore = connectRedis(session)

         const redisClient = new redis(REDIS_OPTIONS)

         const sessionStore = new RedisStore({ client: redisClient })

         const app = express()

         app.disable('x-powered-by')

         // app.use(reqAuth)

         const sessionMiddleware = session({
            ...SESSION_OPTIONS,
            store: sessionStore
         })

         app.use(sessionMiddleware)

         const apolloServer = new ApolloServer({
            typeDefs,
            resolvers,
            cors: CORS_OPTIONS,
            validationRules: [depthLimit(6)],
            playground: IN_PROD ? false : {
               subscriptionsEndpoint: `ws://localhost:${APP_PORT}/graphql`,
               settings: {
                  'request.credentials': 'include'
               }
            },
            subscriptions: {
               onConnect: (connectionParams, ws) => {
                  return new Promise(res => sessionMiddleware(ws.upgradeReq, {}, () => {
                     res({ req: ws.upgradeReq })
                  }))
               }
            },
            context: ({ req, res, connection }) => ({ req, res, connection }),
         })

         // apolloServer.applyMiddleware({ app })

         const httpServer = createServer(app);

         apolloServer.installSubscriptionHandlers(httpServer);

         httpServer.listen({ port: APP_PORT }, () => {
            console.log(`🚀 Server ready at http://10.111.2.243:${APP_PORT}${apolloServer.graphqlPath}`);
            console.log(`🚀 Subscriptions ready at ws://10.111.2.243:${APP_PORT}${apolloServer.subscriptionsPath}`);
         })

      }
      catch (e) {
         console.log(e);
      }
   })()
