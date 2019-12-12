import mongoose from 'mongoose'
import express from 'express'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { ApolloServer, PubSub } from 'apollo-server-express'
import cors from 'cors'
import depthLimit from 'graphql-depth-limit'
import typeDefs from './src/typeDefs'
import resolvers from './src/resolvers'
import reqAuth from './src/Middlewares/reqAuth'
import http from 'http';


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

      const pubsub = new PubSub()

      const app = express()

      app.disable('x-powered-by')

      app.use(reqAuth)

      const server = new ApolloServer({
         cors: {
            origin: "*",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            preflightContinue: false,
            optionsSuccessStatus: 204,
            credentials: true
         },
         typeDefs,
         resolvers,
         validationRules: [depthLimit(6)],
         playground: IN_PROD ? false : {
            settings: {
               'request.credentials': 'include'
            }
         },
         // context: ({ req, res }) => ({ req, res })
      })

      server.applyMiddleware({ app })

      const httpServer = http.createServer(app);
      server.installSubscriptionHandlers(httpServer);

      httpServer.listen({ port: APP_PORT }, () => {
         console.log(`🚀 Server ready at http://localhost:${APP_PORT}${server.graphqlPath}`);
         console.log(`🚀 Subscriptions ready at ws://localhost:${APP_PORT}${server.subscriptionsPath}`);
      });


      // app.listen(
      //    {
      //       port: APP_PORT
      //    },
      //    () => console.log(`http://localhost:${APP_PORT}${server.graphqlPath}`)
      // )
   }
   catch (e) {
      console.log(e);
   }
})()
