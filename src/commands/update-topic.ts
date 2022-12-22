import { Command } from '@boostercloud/framework-core'
import { Register, UUID } from '@boostercloud/framework-types'
import { CommonValidations } from '../common/common-validations'
import { getUserId } from '../common/user-utils'
import { UserRole } from '../config/roles'
import { TopicUpdated } from '../events/topic-updated'

@Command({
  authorize: [UserRole],
  before: [CommonValidations.userValidation]
})
export class UpdateTopic {
  public constructor(
    readonly topicID: UUID,
    readonly title: string
  ) {}

  public static async handle(command: UpdateTopic , register: Register): Promise<void> {
    const userID = getUserId(register)

    const topic = await CommonValidations.validateTopicExists(command.topicID)
    CommonValidations.validateTopicTitle(command.title)
    CommonValidations.validateUserIsAuthorized(topic.hostID, userID)

    register.events(new TopicUpdated(command.topicID, command.title, Date.now()))
  }
}
