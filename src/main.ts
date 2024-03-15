import { createServer } from "http"
import { createYoga } from 'graphql-yoga'

// import { schema as loginSchema } from './loginSchema'
// import { schema as greetingSchema } from "./greetingSchema"

import { schema as filterDemoSchema } from "./filters/filterDemoSchema"

function main() {
  // Set up the login graphql service
  // const loginYoga = createYoga({
  //   schema: loginSchema,
  // })
  // const loginServer = createServer(loginYoga)
  // loginServer.listen(4000, () => {
  //   console.info("Login server is running on http://localhost:4000")
  // })

  // // Set up the greeting graphql service
  // const greetingYoga = createYoga({
  //   schema: greetingSchema,
  // })
  // const greetingServer = createServer(greetingYoga)
  // greetingServer.listen(4001, () => {
  //   console.info("Greeting server is running on http://localhost:4001")
  // })

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