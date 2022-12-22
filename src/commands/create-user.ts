import { Booster, Command } from '@boostercloud/framework-core'
import { CommandInput, Register, UserEnvelope } from '@boostercloud/framework-types'
import { getEnvelopeUserId, getUserId } from '../common/user-utils'
import { UserCreated } from '../events/user-created'
import { UserRole } from '../config/roles'
import { CommonValidations } from '../common/common-validations'
import { ConfigConstants } from '../common/config-constants'
import { User } from '../entities/user'
import { UserReadModel } from '../read-models/user-read-model'
import { LiveQuestionsErrors } from '../common/livequestions-errors'

@Command({
  authorize: [UserRole],
  before: [CreateUser.createUserValidation]
})
export class CreateUser {
  public constructor(
    readonly displayName: string,
    readonly username: string,
    readonly email: string,
  ) {}

  public static async handle(command: CreateUser, register: Register): Promise<string> {
    const id = getUserId(register)
    register.events(new UserCreated(id, command.displayName, command.username, command.email))
    return id
  }

  /**
  * Validates that the user does not already exist and that all the inputs are valid.
  */    
  private static async createUserValidation(input: CommandInput, currentUser?: UserEnvelope): Promise<CommandInput> {
      const userId = getEnvelopeUserId(currentUser)
      const user = await Booster.entity(User, userId)
  
      if (user && user.isDeleted == false) {
        throw LiveQuestionsErrors.userAlreadyExists
      }
  
      CommonValidations.validateUserDisplayName(input.displayName)
  
      if (!/^[a-zA-Z0-9_]+$/.test(input.username)) {
        throw LiveQuestionsErrors.invalidUsername
      }
  
      const lowercasedUsername: string = input.username.toLowerCase()
  
      const users = await Booster.readModel(UserReadModel)
      .filter({ username: { eq: lowercasedUsername }})
      .search()
      .then ((readmodels) => { return (readmodels as UserReadModel[]) })
  
      if (users.length > 0) {
        throw LiveQuestionsErrors.usernameAlreadyTaken
      }
  
      if (input.username.length < ConfigConstants.minUsernameLength || input.username.length > ConfigConstants.maxUsernameLength) {
        throw LiveQuestionsErrors.invalidUsernameLength
      }
  
      if (!input.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw LiveQuestionsErrors.invalidEmailFormat
      }
  
      return {
        ...input,
        username: lowercasedUsername
      }
    }
}
