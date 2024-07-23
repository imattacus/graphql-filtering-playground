import { createServer } from "http"
import { createYoga } from 'graphql-yoga'

import { schema as filterDemoSchema } from "./filters/filterDemoSchema"

function main() {
  // Set up the filter demo graphql service
  const filterDemoYoga = createYoga({
    schema: filterDemoSchema,
  })
  const filterDemoServer = createServer(filterDemoYoga)
  filterDemoServer.listen(4002, () => {
    console.info("Filter demo server is running on http://localhost:4002")
  })
}

main()