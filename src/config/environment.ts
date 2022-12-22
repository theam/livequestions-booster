import { Booster } from "@boostercloud/framework-core"

export interface Environment {
  name: string,
  appName: string,
  provider: EnvironmentProvider,
  auth0Issuer: string,
  jwksURL: string
}

export enum EnvironmentProvider {
  AWS = 'AWS',
  Local = 'LOCAL'
}

export const developmentEnvironment: Environment = {
  name: 'dev',
  appName: 'livequestions-dev',
  provider: EnvironmentProvider.AWS,
  auth0Issuer: "<AUTH0_ISSUER>", // Example: "https://blablabla.eu.auth0.com/",
  jwksURL: "<AUTH0_JWKS_URL>" // Example: "https://blablabla.eu.auth0.com/.well-known/jwks.json"
}

export const productionEnvironment: Environment = {
  name: 'prod',
  appName: 'livequestions-prod',
  provider: EnvironmentProvider.AWS,
  auth0Issuer: "<AUTH0_ISSUER>", 
  jwksURL: "<AUTH0_JWKS_URL>" 
}

export const localEnvironment: Environment = {
  name: 'local',
  appName: 'livequestions-local',
  provider: EnvironmentProvider.Local,
  auth0Issuer: "",
  jwksURL: ""
}

export function packageOfProvider(provider: EnvironmentProvider): string {
  switch (provider) {
    case EnvironmentProvider.AWS:
      return '@boostercloud/framework-provider-aws'
    case EnvironmentProvider.Local:
      return '@boostercloud/framework-provider-local'
  }
}

export function currentEnvironment() {
  return (
    [developmentEnvironment, localEnvironment, productionEnvironment].find(
      (environment) => environment.appName === Booster.config.appName
    ) ?? developmentEnvironment
  )
}
