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


   type OTDuration {
      startDate: Date!
      endDate: Date!
      startTime: String!
      endTime: String
      total_unit: String!
      total_value: Float!
   }

   type Overtime {
      id: ID!
      ot_duration: OTDuration!
      description: String!
      createdBy: User!
      updatedBy: User
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
      ot_duration: String!
   }

   type OvertimeResponse {
      ok: Boolean!
      errors: [Error!]
      overtime: Overtime
      list: [Overtime!]
   }

`
