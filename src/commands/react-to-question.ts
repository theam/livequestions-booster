import { Command } from '@boostercloud/framework-core'
import { Register, UUID } from '@boostercloud/framework-types'
import { getUserId } from '../common/user-utils'
import { QuestionReacted } from '../events/question-reacted'
import { UserRole } from '../config/roles'
import { CommonValidations } from '../common/common-validations'
import { LiveQuestionsErrors } from '../common/livequestions-errors'

@Command({
  authorize: [UserRole],
  before: [CommonValidations.userValidation]
})
export class ReactToQuestion {
  public constructor(
    readonly questionID: UUID,
    readonly like: boolean
  ) {}

  public static async handle(command: ReactToQuestion, register: Register): Promise<void> {
    const userID = getUserId(register)
    const question = await CommonValidations.validateQuestionExists(command.questionID)
    const topic = await CommonValidations.validateTopicExists(question.topicID)
    CommonValidations.validateTopicIsOpen(topic.status)

    if (question.creatorID === userID) {
      throw LiveQuestionsErrors.cannotReactToOwnQuestion
    }
        
    register.events(new QuestionReacted(command.questionID, userID, command.like, Date.now()) )
  }
}
