import { makeExecutableSchema } from "@graphql-tools/schema"
import { typeDefs } from "./typeDefs"
import { products } from "../products"

const stringFilter = (value: string, filter: { eq?: string, contains?: string }) => {
  if (filter.eq && filter.eq !== value) {
    return false
  }
  if (filter.contains && !value.includes(filter.contains)) {
    return false
  }
  return true
}

const intFilter = (value: number, filter: { eq?: number, gt?: number, gte?: number, lt?: number, lte?: number }) => {
  if (filter.eq && !(filter.eq == value)) {
    return false
  }
  if (filter.gt && !(value > filter.gt)) {
    return false
  }
  if (filter.gte && !(value >= filter.gte)) {
    return false
  }
  if (filter.lt && !(value < filter.lt)) {
    console.log(`value: ${value}, filter.lt: ${filter.lt} `)
    return false
  }
  if (filter.lte && !(value <= filter.lte)) {
    return false
  }
  return true
}

const applyProductFilter = (product, filter) => {
  if (filter.name) {
    if (stringFilter(product.name, filter.name) === false) {
      return false
    }
  }
  if (filter.price) {
    if (intFilter(product.price, filter.price) === false) {
      return false
    }
  }
  if (filter.provider) {
    if (stringFilter(product.provider, filter.provider) === false) {
      return false
    }
  }
  return true
}

const applyProductFilters = (product, filters) => {
  return filters.every((filter) => {
    return applyProductFilter(product, filter)
  })
}


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
      const filteredProducts = parent.products.filter((product) => {
        return applyProductFilters(product, filters)
      })
      return {
        count: filteredProducts.length,
        products: filteredProducts,
        __originalProducts: parent.products,
        __appliedFilters: filters
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
          console.log({ predicatesInThisGroup })

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

        console.log({ facetGroup, baseProducts, baseFilters: JSON.stringify(baseFilters) })

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
