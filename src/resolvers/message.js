import { Message } from "../Models"
import { PubSub, withFilter } from 'apollo-server';
require('dotenv').config();

const MESSAGE_CREATED = 'MESSAGE_CREATED';
const MESSAGE_UPDATED = 'MESSAGE_UPDATED';

const pubsub = new PubSub();



export default {
    Query: {
        allMessages: async () => {
            return await Message.find({})
        },
        fetchMessage: async (parent, { id }) => {
            return await Message.findById(id)
        }
    },
    Mutation: {
        createMessage: async (_, { text }) => {
            const message = new Message({
                text,
                isFavorite: false
            })

            await pubsub.publish(MESSAGE_CREATED, { messageCreated: message })
            return await message.save()
        },
        updateMessage: async (parent, { id, text, isFavorite }) => {
            const message = await Message.findByIdAndUpdate(id, {
                text,
                isFavorite
            })

            await pubsub.publish(MESSAGE_UPDATED, { messageUpdated: message })

            return message
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
