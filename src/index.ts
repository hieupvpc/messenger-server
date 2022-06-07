import { initContainer } from './container'

const main = async () => {
  const container = initContainer()
  await container.cradle.setup
  await container.cradle.startServer
}

main()
