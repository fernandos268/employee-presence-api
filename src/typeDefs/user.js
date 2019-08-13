import { gql } from 'apollo-server-express'
import Overtime from '../Models/overtime';

export default gql`

   extend type Query {
      me: User
      user(id: ID!): FetchUserResponse!
      users: FetchUsersResponse!
   }

   extend type Mutation {
      signup(input: SignupInput): SignupResponse!
      signin(email:String!,password:String!): SigninResponse!
   }

   type User {
      id: ID!
      firstName: String
      lastName: String
      suffix: String
      email: String!
      username: String!
      userRole: String
      createdAt: Date
      updatedAt: Date
      createdOvertimes: [Overtime!]!
      assignedOvertimes: [Overtime!]!
   }

   input SignupInput {
      firstName: String!
      lastName: String!
      suffix: String
      email: String!
      username: String!
      password: String!
      userRole: String!
   }

   type SignupResponse {
      user:User
      token: String
      ok:Boolean!
      errors:[Error!]
   }

   type SigninResponse {
      ok:Boolean!
      token: String
      tokenExpiration: Int
      errors:[Error!]
   }

   type FetchUserResponse {
      ok:Boolean!
      errors:[Error!]
      user:User
   }

   type FetchUsersResponse {
      ok: Boolean!
      errors: [Error!]
      list: [User!]!
   }
`
