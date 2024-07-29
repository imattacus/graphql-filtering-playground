import { makeExecutableSchema } from "@graphql-tools/schema"
import { typeDefs } from "./typeDefs"
import sift from "sift"

interface Product {
  id: number
  name: string
  price: number
  provider: string
  downloadSpeed: number
  uploadSpeed: number
}

const products: Product[] = [
  { id: 1, name: "Product 1 Sky £100 100 down 100 up", price: 100, downloadSpeed: 100, uploadSpeed: 100, provider: "Sky" },
  { id: 2, name: "Product 2 Sky £200 100 down 50 up", price: 200, downloadSpeed: 100, uploadSpeed: 50, provider: "Sky" },
  { id: 3, name: "Product 3 Plusnet £50 25 down 5 up", price: 50, downloadSpeed: 25, uploadSpeed: 5, provider: "Plusnet" },
  { id: 4, name: "Product 4 Plusnet £100 100 down 90 up", price: 100, downloadSpeed: 100, uploadSpeed: 90, provider: "Plusnet" },
  { id: 5, name: "Product 5 Vodafone £70 90 down 90 up", price: 70, downloadSpeed: 90, uploadSpeed: 90, provider: "Vodafone" },
  { id: 6, name: "Product 6 Vodafone £10 5 down 5 up", price: 10, downloadSpeed: 5, uploadSpeed: 5, provider: "Vodafone" }
]

const resolvers = {
  Query: {
    productList: () => {
      return {
        count: products.length,
        products,
      }
    }
  },
  ProductList: {
    filteredProducts: (parent, { filters }) => {
      const siftQuery = filters.reduce((acc, filter) => {
        return {
          ...acc,
          [filter.field]: filter.query
        }
      }, {})

      const filteredProducts = parent.products.filter(
        sift(siftQuery)
      )
      return {
        count: filteredProducts.length,
        products: filteredProducts
      }
    },
    facets(parent, { facets: requestedFacetGroups }) {
      const facetGroups: { [key: string]: { [key: string]: number } } = {}
      requestedFacetGroups.forEach((facetGroup) => {
        let baseFilters = parent.__appliedFilters

        if (facetGroup.composition === "OR") {
          // If the composition is OR.. We should not consider any already applied
          // filters applied from THIS facet group
          const predicatesInThisGroup = facetGroup.facets.map((facet) =>
            facet.predicate)

          baseFilters = baseFilters.reduce((acc, predicate) => {
            if (predicatesInThisGroup.some((facetPredicate) => {
              return JSON.stringify(facetPredicate) == JSON.stringify(predicate)
            })) {
              return acc
            }
            return [...acc, predicate]
          }, [])
        }

        // We use the original unfiltered list of products to calculate the
        // facet counts.
        const baseProducts = parent.__originalProducts.filter((product) => {
          return applyProductFilters(product, baseFilters)
        })

        console.log({ baseProducts, baseFilters })

        facetGroup.facets.forEach((facet) => {
          // Apply this predicate to the products to see how many would be left
          // if the filter was applied.
          const filteredProducts = baseProducts.filter((product) => {
            return applyProductFilter(product, facet.predicate)
          })
          if (!facetGroups[facetGroup.groupName]) {
            facetGroups[facetGroup.groupName] = {}
          }
          facetGroups[facetGroup.groupName][facet.name] = filteredProducts.length
        })
      })
      return Object.keys(facetGroups).map((groupName) => {
        return {
          groupName,
          facets: Object.keys(facetGroups[groupName]).map((facetName) => {
            return {
              name: facetName,
              count: facetGroups[groupName][facetName]
            }
          })
        }
      })
    }
  }
}

export const schema = makeExecutableSchema({
  resolvers,
  typeDefs
})
