import { gql } from 'apollo-server-express'

export default gql`
     extend type Query {
          allMessages: [Message]
          fetchMessage(id: Int!): Message
     }

     extend type Mutation {
          createMessage (input: CreateMessageInput!): Message
          updateMessage (
               id: ID!
               text: String!
               isFavorite: Boolean!
          ): Message
     }

     extend type Subscription {
          messageCreated: Message
          messageUpdated(id: Int!): Message
     }

     type Message {
          id: ID!,
          text: String!,
          isFavorite: Boolean!
     }

     input CreateMessageInput {
          text: String!
     }
`
