import { Booster, JwksUriTokenVerifier } from '@boostercloud/framework-core'
import { BoosterConfig, Level } from '@boostercloud/framework-types'
import { BoosterRocketFiles } from '@boostercloud/rocket-file-uploads-core'
import { Environment, packageOfProvider, EnvironmentProvider, productionEnvironment, developmentEnvironment, localEnvironment } from './environment'
import * as dotenv from 'dotenv'
import { ConfigConstants } from '../common/config-constants'

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
        config.rockets = [
          new BoosterRocketFiles(
            config, 
            [ConfigConstants.rocketFilesConfigurationDefault]
          ).rocketForAWS()
        ]

        break
    }
  })
}

buildEnvironment(productionEnvironment)
buildEnvironment(developmentEnvironment)
buildEnvironment(localEnvironment)
dotenv.config()