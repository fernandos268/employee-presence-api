import { gql } from 'apollo-server-express'

export default gql`
     extend type Query {
          GetMails(input: QueryMailsInput!):  [Message!]!
          fetchMessage(id: Int!): Message
     }

     extend type Mutation {
          createMessage(input: CreateMessageInput!): Response
          updateMessage(
               id: ID!
               text: String!
               topic: String!
          ): Message
          deleteMessage(id: String!): Response
     }

     extend type Subscription {
          messageList (email: String!): [Message!]!
          newMessages: Message
          deletedMessage: Message
          messageUpdated (id: Int!): Message
     }

     type Message {
          id: ID
          sender: String
          senderId: String
          recipient: String
          subject: String
          body: String
          topic: String
          sent_date: String
     }

     input CreateMessageInput {
          sender: String
          senderId: String
          recipient: String
          subject: String
          body: String
          topic: String
     }

     input QueryMailsInput {
          topic: String!
          entity: String!
          request_origin: String!
          filter_fields:[String!]!
          filter_values: [String!]!
     }
`
