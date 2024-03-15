import { makeExecutableSchema } from "@graphql-tools/schema"

const typeDefs = /* GraphQL */ `
  type User {
    name: String!
  }

  type Query {
    stub: String
  }

  type Mutation {
    login(name: String!): User!
  }
`

const resolvers = {
  Mutation: {
    login: (_parent, { name }, _ctx) => {
      _ctx.user = { name }
      return { name }
    }
  }
}

export const schema = makeExecutableSchema({
  resolvers,
  typeDefs
})
