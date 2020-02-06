import express from 'express'
import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import depthLimit from 'graphql-depth-limit'
import { createServer } from 'http'

import cors from 'cors'
import orientDB from 'orientjs'

import socketIOStream from 'socket.io-stream'
import kafka from 'kafka-node'

import { KafkaPubSub } from 'graphql-kafka-subscriptions'

import { PubSub, withFilter } from 'apollo-server'
const apollo_pubsub = new PubSub();

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
   IN_PROD,
   ORIENT_DB_OPTIONS,
   ORIENT_DB_SESSION,
   KAFKA_SERVERS
} from './config'

   ; (async () => {
      try {
         const orient_client = await orientDB.OrientDBClient.connect(ORIENT_DB_OPTIONS)

         let orient_pool = await orient_client.sessions(ORIENT_DB_SESSION);

         let orient_db = await orient_pool.acquire()

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

         app.use(cors(CORS_OPTIONS))

         const kafka_topics = [
            'new-messages',
            'query-response',
            'response-inbox',
            'response-sent-items'
         ]

         const consumer_options = {
            autoCommit: true,
            fromOffset: 'latest',
            // commitOffsetsOnFirstJoin: true
         }

         const consumerGroup = new kafka.ConsumerGroup(consumer_options, kafka_topics)

         const client = new kafka.KafkaClient({ kafkaHost: KAFKA_SERVERS })
         const HighLevelProducer = kafka.HighLevelProducer
         const producer = new HighLevelProducer(client)
         // const Producer = kafka.Producer
         // const producer = new Producer(client)

         const kafka_pubsub = new KafkaPubSub({
            topic: 'new-messages',
            host: KAFKA_SERVERS,
         })

         const query_pubsub = new KafkaPubSub({
            topic: 'query-response',
            host: KAFKA_SERVERS,
         })

         kafka_pubsub.subscribe('new-messages', data => {
            console.log('app --> new-messages: ', data)
         })

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
                        resolve(webSocket.upgradeReq)
                     })
                  )
               }
            },
            context: ({ req, res, connection }) => {
               // console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
               // console.log('sess', connection.context.req.session)
               // console.log('headers', connection.context.req.headers)
               return { req, res, connection, orient_db, producer, consumerGroup, kafka_pubsub, query_pubsub, kafka, consumer_options }
            },
         })

         apolloServer.applyMiddleware({
            app,
            cors: false
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
