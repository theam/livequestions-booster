import { Booster, Command } from '@boostercloud/framework-core'
import { Register } from '@boostercloud/framework-types'
import { FileHandler } from '@boostercloud/rocket-file-uploads-core'
import { CommonValidations } from '../common/common-validations'
import { ConfigConstants } from '../common/config-constants'
import { UserRole } from '../config/roles'

export class ListItem {
  public constructor(
    readonly name: string,
    readonly properties: ListItemProperties,
    readonly metadata?: { [propertyName: string]: string }
  ){}
}

export class ListItemProperties {
  public constructor(
    readonly lastModified: Date,
    readonly createdOn?: Date,
    readonly contentLength?: number, // Size in bytes
    readonly contentType?: string
  ) {}
}

@Command({
  authorize: [UserRole],
  before: [CommonValidations.userValidation]
})
export class FilesList {
  public constructor() {}

  public static async handle(command: FilesList, register: Register): Promise<Array<ListItem>> {
    const boosterConfig = Booster.config
    const fileHandler = new FileHandler(boosterConfig, ConfigConstants.rocketFilesConfigurationDefault.storageName)    
    const listItems = await fileHandler.list(ConfigConstants.rocketFilesConfigurationDefault.directories[0])

    return listItems.map((item) => {
      return ({
        name: item.name,
        properties: ({
          lastModified: item.properties.lastModified,
          createdOn: item.properties.createdOn,
          contentLength: item.properties.contentLength, // Size in bytes
          contentType: item.properties.contentType
        }) as ListItemProperties,
        metadata: item.metadata,
        }) as ListItem
    })
  }
}