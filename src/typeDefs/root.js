import { gql } from 'apollo-server-express'

export default gql`

  type Query {
    root: String
  }

  type Mutation {
    root: String
  }

  type Subscription {
    root: String
  }
`
