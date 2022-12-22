import { Event } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'

@Event
export class TopicJoined {
  public constructor(
    readonly topicID: UUID,
    readonly userID: UUID,
    readonly updatedAt: number
  ) {}

  public entityID(): UUID {
    return this.topicID
  }
}
