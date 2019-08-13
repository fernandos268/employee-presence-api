import { gql } from 'apollo-server-express'

export default gql`
   scalar Date

   extend type Query {
      leave(id: ID!): Leave!
      leaves: [Leave!]!
   }

   extend type Mutation {
      createLeave(LeaveInput: LeaveInput!): LeaveResponse!
      updateLeave(LeaveInput: LeaveInput!): LeaveResponse!
      deleteLeave(id: ID!): LeaveResponse!
      leaveApproval(ApprovalInput: ApprovalInput!): LeaveResponse!
   }

   type Leave {
      id: ID!
      startDate: Date!
      endDate: Date!
      description: String!
      createdBy: User!
      approver: User!
      status: String!
   }

   type LeaveInput {
      startDate: Date!
      endDate: Date!
      description: String!
      createdBy: User!
      approver: User!
      status: String!
   }

   type LeaveResponse {
      ok: Boolean!
      errors: [Error!]
      leave: Leave
   }
`
