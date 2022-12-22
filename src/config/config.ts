import { Booster, JwksUriTokenVerifier } from '@boostercloud/framework-core'
import { BoosterConfig, Level } from '@boostercloud/framework-types'
import { Environment, packageOfProvider, EnvironmentProvider, productionEnvironment, developmentEnvironment, localEnvironment } from './environment'
import * as dotenv from 'dotenv'

function buildEnvironment(environment: Environment): void {

  Booster.configure(environment.name, (config: BoosterConfig): void => {
    config.appName = environment.appName
    config.providerPackage = packageOfProvider(environment.provider)

    switch (environment.provider) {
      case EnvironmentProvider.Local:
        config.logLevel = Level.debug
        break

      case EnvironmentProvider.AWS:
        config.logLevel = Level.debug
        config.assets = ['.env'] // Needed for secrets. Fill your secrets in the .env file.
        config.tokenVerifiers = [
          new JwksUriTokenVerifier(
            environment.auth0Issuer,
            environment.jwksURL,
            "custom:roles"
          )
        ]

        break
    }
  })
}

buildEnvironment(productionEnvironment)
buildEnvironment(developmentEnvironment)
buildEnvironment(localEnvironment)
dotenv.config()