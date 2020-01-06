import express from 'express'
import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import depthLimit from 'graphql-depth-limit'
import { createServer } from 'http'

import typeDefs from './src/typeDefs'
import resolvers from './src/resolvers'
import reqAuth from './src/Middlewares/reqAuth'

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
         await mongoose.connect(MONGO_URI, MONGO_OPTIONS)

         mongoose.set('useFindAndModify', false)

         const RedisStore = connectRedis(session)

         const redisClient = new Redis(REDIS_OPTIONS)

         const store = new RedisStore({ client: redisClient })

         const app = express()

         app.disable('x-powered-by')

         const sessionMiddleware = session({
            ...SESSION_OPTIONS,
            store
         })

         app.use(sessionMiddleware)

         const apolloServer = new ApolloServer({
            typeDefs,
            resolvers,
            validationRules: [depthLimit(6)],
            playground: IN_PROD ? false : {
               subscriptionsEndpoint: `ws://localhost:${APP_PORT}/graphql`,
               settings: {
                  'request.credentials': 'include'
               }
            },
            subscriptions: {
               onConnect: (connectionParams, webSocket) => {
                  return new Promise(resolve =>
                     sessionMiddleware(webSocket.upgradeReq, {}, () => {
                        resolve({ req: webSocket.upgradeReq })
                     })
                  )
               }
            },
            context: ({ req, res, connection }) => {
               console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
               console.log('sess', connection.context.req.session)
               console.log('headers', connection.context.req.headers)
               return { req, res, context: connection.context }
            },
         })

         apolloServer.applyMiddleware({
            app,
            cors: {
               origin: 'http://localhost:9000',
               credentials: 'include'
            }
         })

         const httpServer = createServer(app)

         apolloServer.installSubscriptionHandlers(httpServer)

         httpServer.listen({ port: APP_PORT }, () => {
            console.log(`🚀 Server ready at http:localhost:${APP_PORT}${apolloServer.graphqlPath}`);
            console.log(`🚀 Subscriptions ready at ws:localhost:${APP_PORT}${apolloServer.subscriptionsPath}`);
         })

      }
      catch (e) {
         console.log(e);
      }
   })()
