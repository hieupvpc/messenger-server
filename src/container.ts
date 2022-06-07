import { asFunction, createContainer } from 'awilix'
import { cache } from './cache'
import { initSequelize, setup, startServer } from './configs'
import { controllers } from './controllers'
import { envs } from './envs'
import { helpers } from './helpers'
import { middlwares } from './middlewares'
import { routers } from './routers'
import { services } from './services'

export interface ICradle {
  envs: ReturnType<typeof envs>
  cache: ReturnType<typeof cache>
  initSequelize: ReturnType<typeof initSequelize>
  setup: ReturnType<typeof setup>
  startServer: ReturnType<typeof startServer>
  routers: ReturnType<typeof routers>
  helpers: ReturnType<typeof helpers>
  middlwares: ReturnType<typeof middlwares>
  controllers: ReturnType<typeof controllers>
  services: ReturnType<typeof services>
}

export const initContainer = () =>
  createContainer().register({
    envs: asFunction(envs).singleton(),
    cache: asFunction(cache).singleton(),
    initSequelize: asFunction(initSequelize).singleton(),
    setup: asFunction(setup).singleton(),
    startServer: asFunction(startServer).singleton(),
    routers: asFunction(routers).singleton(),
    helpers: asFunction(helpers).singleton(),
    middlwares: asFunction(middlwares).singleton(),
    controllers: asFunction(controllers).singleton(),
    services: asFunction(services).singleton(),
  })
