import { gql } from 'apollo-server-express'

export default gql`

   extend type Query {
      overtime(id: ID!): OvertimeResponse!
      overtimes: OvertimeResponse!
   }

   extend type Mutation {
      createOvertime(input: OvertimeInput!): OvertimeResponse!
      updateOvertime(input: OvertimeInput!): OvertimeResponse!
      deleteOvertime(id: ID!): OvertimeResponse!
      overtimeApproval(input: ApprovalInput!): OvertimeResponse!
   }

   type Overtime {
      id: ID!
      startDate: Date!
      endDate: Date!
      startTime: String!
      endTime: String!
      description: String!
      createdBy: User!
      approver: User!
      status: String!
      remarks: String
   }

   input OvertimeInput {
      startDate: Date!
      endDate: Date!
      startTime: String!
      endTime: String!
      description: String
      approverId: ID!
      duration: String!
   }

   type OvertimeResponse {
      ok: Boolean!
      errors: [Error!]
      overtime: Overtime
      list: [Overtime!]
   }

`
