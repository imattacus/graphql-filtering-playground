export const typeDefs = /* GraphQL */ `
  type Product {
    id: ID!
    name: String!
    price: Int!
    provider: String!
  }

  input StringFilter {
    eq: String
    contains: String
  }

  input IntFilter {
    eq: Int
    gt: Int
    gte: Int
    lt: Int
    lte: Int
  }

  input ProductFilters {
    name: StringFilter
    price: IntFilter
    provider: StringFilter
  }

  type Facet {
    name: String!
    count: Int!
  }

  type FacetGroup {
    groupName: String!
    facets: [Facet!]!
  }

  enum Composition {
    AND
    OR
  }

  input FacetPredicateInput {
    name: String!
    predicate: ProductFilters!
  }

  input FacetInput {
    groupName: String!
    composition: Composition
    facets: [FacetPredicateInput!]
  }

  input SiftInput {
    field: String!
    query: String!
  }

  type ProductList {
    count: Int!
    products: [Product!]!
    filteredProducts(filters: [SiftInput!]!): ProductList!
    facets(facets: [FacetInput!]!): [FacetGroup!]!
  }

  type Query {
    productList: ProductList!
  }
`
