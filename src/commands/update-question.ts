import { Command } from '@boostercloud/framework-core'
import { CommandInput, Register, UserEnvelope, UUID } from '@boostercloud/framework-types'
import { getEnvelopeUserId } from '../common/user-utils'
import { QuestionUpdated } from '../events/question-updated'
import { UserRole } from '../config/roles'
import { CommonValidations } from '../common/common-validations'

@Command({
  authorize: [UserRole],
  before: [CommonValidations.userValidation, UpdateQuestion.validate]
})
export class UpdateQuestion {
  public constructor(
    readonly questionID: UUID,
    readonly question: string
  ) {}

  public static async handle(command: UpdateQuestion , register: Register): Promise<void> {
    register.events(new QuestionUpdated(command.questionID, command.question, Date.now()))
  }

  static async validate(
    input: CommandInput,
    currentUser?: UserEnvelope
  ): Promise<CommandInput> {
    const userID = getEnvelopeUserId(currentUser)
    const question = await CommonValidations.validateQuestionExists(input.questionID)
    CommonValidations.validateQuestionLength(input.question)
    CommonValidations.validateUserIsAuthorized(question.creatorID, userID)

    const topic = await CommonValidations.validateTopicExists(question.topicID)
    CommonValidations.validateTopicIsOpen(topic.status)
    
    return input
  } 
}
