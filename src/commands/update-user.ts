import { Command } from '@boostercloud/framework-core'
import { Register } from '@boostercloud/framework-types'
import { UserUpdated } from '../events/user-updated'
import { UserRole } from '../config/roles'
import { CommonValidations } from '../common/common-validations'

@Command({
  authorize: [UserRole],
  before: [CommonValidations.userValidation]
})
export class UpdateUser {
  public constructor(
    readonly displayName: string
  ) {}

  public static async handle(command: UpdateUser, register: Register): Promise<void> {
    const user = await CommonValidations.validateUserExists(register)
    CommonValidations.validateUserDisplayName(command.displayName)

    register.events(new UserUpdated(user.id, command.displayName))
  }
}
