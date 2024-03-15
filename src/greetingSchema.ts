import { makeExecutableSchema } from "@graphql-tools/schema"

const typeDefs = /* GraphQL */ `
  type Query {
    hello: String!
  }

  type Mutation {
    personalisedGreeting: String!
  }
`

const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  },
  Mutation: {
    personalisedGreeting: (root, _args, _ctx) => {
      const user = _ctx.user
      return `Hello, ${user.name}`
    }
  }
}

export const schema = makeExecutableSchema({
  resolvers,
  typeDefs
})
