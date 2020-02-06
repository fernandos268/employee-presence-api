import { Message } from "../Models"
import { PubSub, withFilter } from 'apollo-server';
import uuid from 'uuid/v4'
import moment from 'moment'

const pubsub = new PubSub();

export default {
    Query: {
        GetMails: async (parent, args, { req, connection, producer, kafka, consumer_options, consumerGroup }) => {

            const {
                topic,
                request_origin,
                entity,
                filter_fields,
                filter_values
            } = args.input

            const message = {
                topic,
                request_origin,
                entity,
                filter_fields,
                filter_values,
            }

            const kafka_message = {
                topic,
                timestamp: Date.now(),
                messages: [JSON.stringify(message)]
            }

            const payloads = [kafka_message]

            // const consumerGroup = new kafka.ConsumerGroup(consumer_options, ['query-response', 'response-sent-items'])

            // producer.on('ready', () => {
            //     console.log('KAFKA --> ON READY')
            // })
            producer.send(payloads, (error, data) => {
                console.log("query-request -> send -> error", error)
                console.log("query-request -> send -> data", data)
            })

            const expected_topic = topic === 'request-inbox' ?
                'response-inbox' :
                topic === 'request-sent-items' ?
                    'response-sent-items' :
                    ''

            const result = await new Promise((resolve, reject) => {
                consumerGroup.on('message', message => {
                    const {
                        topic: incoming_topic,
                        value
                    } = message

                    const response_message = JSON.parse(value)
                    const {
                        origin: response_origin,
                        list,
                    } = response_message

                    if (expected_topic === incoming_topic && response_origin === request_origin) {
                        resolve(list)
                    }
                })
            })

            return result
        },
        fetchMessage: async (parent, { id }) => {
            // return await Message.findById(id)

        }
    },
    Mutation: {
        createMessage: async (parent, { input }, { connection, producer, consumerGroup, consumer_options, kafka_pubsub }, info) => {
            const {
                sender,
                senderId,
                recipient,
                subject,
                body,
                topic
            } = input

            const message = {
                sender,
                senderId,
                recipient,
                subject,
                body,
                sent_date: moment().format()
            }

            const kafka_message = {
                topic,
                // partition: 0,
                timestamp: Date.now(),
                messages: [JSON.stringify(message)]
            }

            const payloads = [kafka_message]

            producer.send(payloads, (error, data) => {
                console.log("send -> error", error)
                console.log("send -> data", data)
            })

            // const data = await new Promise((res, rej) => {
            //     kafka_pubsub.subscribe('new-messages', data => {
            //         console.log('KAFKA PUBSUB SUBSCRIBE-->', data)
            //         res(res)
            //     })
            // })

            // pubsub.publish('new_message_created', data)

            return {
                status: 'Requested',
                action: 'CREATE_NODE',
                entity: 'Message'
            }
        },
        updateMessage: async (parent, { id, text, isFavorite }) => {
            try {
                const message = await Message.findByIdAndUpdate(
                    id,
                    {
                        text,
                        isFavorite
                    },
                    { new: true })

                // await pubsub.publish(MESSAGE_UPDATED, { message })

                return message
            } catch (error) {
                throw console.error();
            }
        }
    },
    Subscription: {
        newMessages: {
            resolve: (payload) => {
                console.log('RESOLVER messageCreated ==> ', payload)
                return payload
            },
            subscribe: (parent, args, { kafka_pubsub }) => kafka_pubsub.asyncIterator('new-messages'),

            // subscribe: withFilter(() => pubsub.asyncIterator('new_message_created'), (payload, variables) => {
            // return payload
            // })
        },
        messageList: {
            resolve: (payload, args, { connection }, info) => {
                console.log('========================================================================================')
                return payload
            },
            subscribe: (parent, args, { query_pubsub }) => pubsub.asyncIterator('any')
        },
    }
}
