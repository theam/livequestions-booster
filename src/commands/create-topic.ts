import { Command } from '@boostercloud/framework-core'
import { Register, UUID } from '@boostercloud/framework-types'
import { CommonValidations } from '../common/common-validations'
import { getUserId } from '../common/user-utils'
import { UserRole } from '../config/roles'
import { TopicCreated } from '../events/topic-created'

@Command({
  authorize: [UserRole],
  before: [CommonValidations.userValidation]
})
export class CreateTopic {
  public constructor(
    readonly title: string,
    readonly timeToLive: number
  ) {}

  public static async handle(command: CreateTopic , register: Register): Promise<UUID> {
    CommonValidations.validateTopicTitle(command.title)
    CommonValidations.validateTopicTTL(command.timeToLive)

    const userID = getUserId(register)
    const topicID = UUID.generate()
    const createdAt = Date.now()
    const expiredAt = createdAt + command.timeToLive

    register.events(new TopicCreated(topicID, command.title, userID, createdAt, expiredAt))

    return topicID
  }
}
