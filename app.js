import mongoose from 'mongoose'
import express from 'express'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { ApolloServer } from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'
import typeDefs from './src/typeDefs'
import resolvers from './src/resolvers'
import reqAuth from './src/Middlewares/reqAuth'
import { createServer } from 'http'

import socketIO from 'socket.io'
import socketIOStream from 'socket.io-stream'

import {
   APP_PORT,
   DB_USERNAME,
   DB_PASSWORD,
   DB_PORT,
   DB_NAME,
   DB_HOST,
   IN_PROD
} from './config'

(async () => {
   try {
      await mongoose.connect(
         `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
         { useNewUrlParser: true }
      )

      mongoose.set('useFindAndModify', false)

      const app = express()

      app.disable('x-powered-by')

      // app.use(reqAuth)

      const apolloServer = new ApolloServer({
         typeDefs,
         resolvers,
         cors: {
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204,
            credentials: true
         },
         validationRules: [depthLimit(6)],
         playground: IN_PROD ? false : {
            subscriptionsEndpoint: `ws://localhost:${APP_PORT}/graphql`,
            settings: {
               'request.credentials': 'include'
            }
         },
         subscriptions: {
            onConnect: (connectionParams, webSocket, context) => {
               if (connectionParams && connectionParams.auth) {
                  console.log('authorization', connectionParams.auth)
               }
            }
         },
         context: ({ connection, payload, req }) => {
            // whatever you return here can be accessed from the middleware of the SubscriptionMiddleware with
            // applyMiddleware: (options, next) => options.getContext()
            if (payload && payload.auth) {
               console.log('authorization', payload.auth)
               return { authorization: payload.auth };
            }
         },
      })

      apolloServer.applyMiddleware({ app })

      const server = createServer(app);
      apolloServer.installSubscriptionHandlers(server);

      server.listen({ port: APP_PORT }, () => {
         console.log(`🚀 Server ready at http://10.111.2.243:${APP_PORT}${apolloServer.graphqlPath}`);
         console.log(`🚀 Subscriptions ready at ws://10.111.2.243:${APP_PORT}${apolloServer.subscriptionsPath}`);
      })

   }
   catch (e) {
      console.log(e);
   }
})()
