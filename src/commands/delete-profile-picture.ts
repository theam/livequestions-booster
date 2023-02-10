import { Booster, Command } from '@boostercloud/framework-core'
import { Register } from '@boostercloud/framework-types'
import { FileHandler } from '@boostercloud/rocket-file-uploads-core'
import { CommonValidations } from '../common/common-validations'
import { ConfigConstants } from '../common/config-constants'
import { profilePictureKey } from '../common/profilepicture-constants'
import { getUserId } from '../common/user-utils'
import { UserRole } from '../config/roles'

@Command({
  authorize: [UserRole],
  before: [CommonValidations.userValidation]
})
export class DeleteProfilePicture {
  public constructor() {}

  public static async handle(command: DeleteProfilePicture , register: Register): Promise<boolean> {
    const boosterConfig = Booster.config
    const fileHandler = new FileHandler(boosterConfig, ConfigConstants.rocketFilesConfigurationDefault.storageName)    
    return await fileHandler.deleteFile(ConfigConstants.rocketFilesConfigurationDefault.directories[0], `${getUserId(register)}/${profilePictureKey}`)
  }
}