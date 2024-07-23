import sift from "sift"
import { products } from "./products"

const filteredProducts = products.filter(
  sift({
    price: { $lt: 100 },
    // 'services.broadband.linetype': { $eq: 'fibre' }
  })
)

console.log(filteredProducts)
