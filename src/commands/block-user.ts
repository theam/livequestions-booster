import { Command } from '@boostercloud/framework-core'
import { Register, UUID } from '@boostercloud/framework-types'
import { CommonValidations } from '../common/common-validations'
import { UserRole } from '../config/roles'
import { UserBlocked } from '../events/user-blocked'

@Command({
  authorize: [UserRole],
  before: [CommonValidations.userValidation]
})
export class BlockUser {
  public constructor(
    readonly userID: UUID
  ) {}

  public static async handle(command: BlockUser , register: Register): Promise<void> {
    const user = await CommonValidations.validateUserExists(register)
    CommonValidations.validateUserIsNotBlocked(user.id, user.blockedUserIDs)
    
    register.events(new UserBlocked(user.id, command.userID))
  }
}
