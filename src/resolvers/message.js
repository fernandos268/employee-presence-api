import { Message } from "../Models"
import { PubSub, withFilter } from 'apollo-server';
require('dotenv').config();

const MESSAGE_CREATED = 'MESSAGE_CREATED'
const MESSAGE_UPDATED = 'MESSAGE_UPDATED'
const FETCHED_ALL_MESSAGES = 'FETCHED_ALL_MESSAGES'

const pubsub = new PubSub();

export default {
    Query: {
        allMessages: async () => {
            console.log('QUERY: allMessages')
            const messages = await Message.find({})
            await pubsub.publish(FETCHED_ALL_MESSAGES, { allMessages: messages })
            return messages
        },
        fetchMessage: async (parent, { id }) => {
            return await Message.findById(id)
        }
    },
    Mutation: {
        createMessage: async (parent, { text }, context) => {
            console.log('Resolver --> context', context)
            const message = new Message({
                text,
                isFavorite: false
            })

            await pubsub.publish(MESSAGE_CREATED, { messageCreated: message })
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

                await pubsub.publish(MESSAGE_UPDATED, { messageUpdated: message })

                return message
            } catch (error) {
                throw console.error();
            }
        },
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
