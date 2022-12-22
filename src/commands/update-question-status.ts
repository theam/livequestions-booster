import { Command } from '@boostercloud/framework-core'
import { Register, UUID } from '@boostercloud/framework-types'
import { QuestionStatus } from '../common/question-status'
import { getUserId } from '../common/user-utils'
import { QuestionStatusUpdated } from '../events/question-status-updated'
import { UserRole } from '../config/roles'
import { TopicQuestionDeleted } from '../events/topic-question-deleted'

import { CommonValidations } from '../common/common-validations'
import { LiveQuestionsErrors } from '../common/livequestions-errors'

@Command({
  authorize: [UserRole],
  before: [CommonValidations.userValidation]
})
export class UpdateQuestionStatus {
  public constructor(
    readonly questionID: UUID,
    readonly status: QuestionStatus
  ) {}

  public static async handle(command: UpdateQuestionStatus , register: Register): Promise<void> {
    const userID = getUserId(register)
    const question = await CommonValidations.validateQuestionExists(command.questionID)

    if (question.status === QuestionStatus.Deleted) {
      throw LiveQuestionsErrors.questionAlreadyDeleted
    }

    const topic = await CommonValidations.validateTopicExists(question.topicID)
    CommonValidations.validateTopicIsOpen(topic.status)
    CommonValidations.validateUserIsAuthorized(topic.hostID, userID)

    const updatedAt = Date.now()
    const statusUpdated = new QuestionStatusUpdated(question.id, command.status, updatedAt)
    register.events(statusUpdated)

    if (command.status === QuestionStatus.Deleted) {
      const eventQuestionDeleted = new TopicQuestionDeleted(question.topicID, question.id, updatedAt)
      register.events(eventQuestionDeleted)
    }
  }
}
