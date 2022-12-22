import { Event } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'

@Event
export class TopicQuestionDeleted {
  public constructor(
    readonly topicID: UUID,
    readonly questionID: UUID,
    readonly updatedAt: number
  ) {}

  public entityID(): UUID {
    return this.topicID
  }
}
