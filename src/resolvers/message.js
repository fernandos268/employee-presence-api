import { Message } from "../Models"
import { PubSub, withFilter } from 'apollo-server';
require('dotenv').config();

const MESSAGE_CREATED = 'MESSAGE_CREATED'
const MESSAGE_UPDATED = 'MESSAGE_UPDATED'
const FETCHED_ALL_MESSAGES = 'FETCHED_ALL_MESSAGES'

const pubsub = new PubSub();

export default {
    Query: {
        allMessages: async (parent, args, { req }) => {
            console.log('QUERY: allMessages --> req', req)
            const messages = await Message.find({})
            await pubsub.publish(FETCHED_ALL_MESSAGES, { allMessages: messages })
            return messages
        },
        fetchMessage: async (parent, { id }) => {
            return await Message.findById(id)
        }
    },
    Mutation: {
        createMessage: async (parent, { input }, { connection }) => {
            console.log('connection', connection)
            const { text } = input
            if (!connection.context.req.session.userId) {
                throw new Error("Signin is required");
            }
            const message = new Message({
                text,
                isFavorite: false
            })

            await pubsub.publish(MESSAGE_CREATED, { message })
            return await message.save()
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

                await pubsub.publish(MESSAGE_UPDATED, { message })

                return message
            } catch (error) {
                throw console.error();
            }
        }
    },
    Subscription: {
        messageCreated: {
            subscribe: () => pubsub.asyncIterator([MESSAGE_CREATED]),
        },
        messageUpdated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('MESSAGE_UPDATED'),
                (payload, variables) => {
                    return payload.messageUpdated.id === variables.id
                },
            ),
        },
    }
}
