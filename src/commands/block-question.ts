import { Command } from '@boostercloud/framework-core'
import { Register, UUID } from '@boostercloud/framework-types'
import { CommonValidations } from '../common/common-validations'
import { UserRole } from '../config/roles'
import { QuestionBlocked } from '../events/question-blocked'

@Command({
  authorize: [UserRole],
  before: [CommonValidations.userValidation]
})
export class BlockQuestion {
  public constructor(
    readonly questionID: UUID
  ) {}

  public static async handle(command: BlockQuestion , register: Register): Promise<void> {
    const user = await CommonValidations.validateUserExists(register)
    const question = await CommonValidations.validateQuestionExists(command.questionID)
    CommonValidations.validateQuestionIsFromAnotherUser(user.id, question.creatorID)
    CommonValidations.validateQuestionIsNotBlocked(question.id, user.blockedQuestionIDs)
    
    register.events(new QuestionBlocked(user.id, question.id))
  }
}
