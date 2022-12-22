import { Command } from '@boostercloud/framework-core'
import { Register, UUID } from '@boostercloud/framework-types'
import { UserRole } from '../config/roles'
import { TopicJoined } from '../events/topic-joined'
import { CommonValidations } from '../common/common-validations'
import { LiveQuestionsErrors } from '../common/livequestions-errors'
import { UserUnblocked } from '../events/user-unblocked'

@Command({
  authorize: [UserRole],
  before: [CommonValidations.userValidation]
})
export class JoinTopic {
  public constructor(
    readonly topicID: UUID
  ) {}

  public static async handle(command: JoinTopic , register: Register): Promise<void> {
    const user = await CommonValidations.validateUserExists(register)
    const topic = await CommonValidations.validateTopicExists(command.topicID)

    if (topic.participantIDs.findIndex((id) => id === user.id) !== -1) {
      throw LiveQuestionsErrors.topicAlreadyJoined
    }
  
    register.events(new TopicJoined(command.topicID, user.id, Date.now()))

    if (user.blockedUserIDs.find((id) => id === topic.hostID)) {
      register.events(new UserUnblocked(user.id, topic.hostID))
    }
  }
}
