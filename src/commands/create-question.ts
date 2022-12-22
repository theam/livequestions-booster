import { Command } from '@boostercloud/framework-core'
import { Register, UUID } from '@boostercloud/framework-types'
import { getUserId } from '../common/user-utils'
import { QuestionCreated } from '../events/question-created'
import { UserRole } from '../config/roles'
import { TopicQuestionCreated } from '../events/topic-question-created'
import { CommonValidations } from '../common/common-validations'

@Command({
  authorize: [UserRole],
  before: [CommonValidations.userValidation]
})
export class CreateQuestion {
  public constructor(
    readonly topicID: UUID,
    readonly question: string,
    readonly isAnonymous: boolean
  ) {}

  public static async handle(command: CreateQuestion, register: Register): Promise<UUID> {
    const topic = await CommonValidations.validateTopicExists(command.topicID)
    CommonValidations.validateTopicIsOpen(topic.status)
    CommonValidations.validateQuestionLength(command.question)

    const userID = getUserId(register)
    const questionID = UUID.generate()
    const createdAt = Date.now()

    const questionCreated = new QuestionCreated(questionID, command.topicID, userID, command.question, createdAt, command.isAnonymous)
    const eventQuestionCreated = new TopicQuestionCreated(command.topicID, questionID, createdAt)
    
    register.events(questionCreated, eventQuestionCreated)

    return questionID
  }
}
