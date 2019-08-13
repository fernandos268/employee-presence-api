import { gql } from 'apollo-server-express'

export default gql`
   scalar Date

   type Error {
      path: String
      message: String
   }

   input ApprovalInput {
      id: ID!
      status: String!
      remarks: String
   }
`
