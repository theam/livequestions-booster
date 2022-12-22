import { Command } from '@boostercloud/framework-core'
import { Register, UUID } from '@boostercloud/framework-types'
import { CommonValidations } from '../common/common-validations'
import { UserRole } from '../config/roles'
import { UserUnblocked } from '../events/user-unblocked'

@Command({
  authorize: [UserRole],
  before: [CommonValidations.userValidation]
})
export class UnblockUser {
  public constructor(
    readonly userID: UUID,
  ) {}

  public static async handle(command: UnblockUser , register: Register): Promise<void> {
    const user = await CommonValidations.validateUserExists(register)
    CommonValidations.validateUserIsBlocked(command.userID, user.blockedUserIDs)

    register.events(new UserUnblocked(user.id, command.userID))
  }
}
