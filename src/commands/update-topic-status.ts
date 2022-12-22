import { Command } from '@boostercloud/framework-core'
import { Register, UUID } from '@boostercloud/framework-types'
import { getUserId } from '../common/user-utils'
import { UserRole } from '../config/roles'
import { TopicStatusUpdated } from '../events/topic-status-updated'
import { TopicStatus } from '../common/topic-status'
import { LiveQuestionsErrors } from '../common/livequestions-errors'
import { CommonValidations } from '../common/common-validations'

@Command({
  authorize: [UserRole],
  before: [CommonValidations.userValidation]
})
export class UpdateTopicStatus {
  public constructor(
    readonly topicID: UUID,
    readonly status: TopicStatus
  ) {}

  public static async handle(command: UpdateTopicStatus , register: Register): Promise<void> {
    const userID = getUserId(register)
    const topic = await CommonValidations.validateTopicExists(command.topicID)
    CommonValidations.validateUserIsAuthorized(topic.hostID, userID)

    switch (command.status) {
      case TopicStatus.Open:
        throw LiveQuestionsErrors.openTopicNotSupported
      case TopicStatus.Closed:
        if (topic.status === TopicStatus.Closed) {
          throw LiveQuestionsErrors.topicAlreadyClosed
        } else if (topic.status === TopicStatus.Deleted) {
          throw LiveQuestionsErrors.topicAlreadyDeleted
        }
        break
      case TopicStatus.Deleted:
        if (topic.status === TopicStatus.Deleted) {
          throw LiveQuestionsErrors.topicAlreadyDeleted
        }  
    }
    
    register.events(new TopicStatusUpdated(command.topicID, command.status, Date.now()))
  }
}