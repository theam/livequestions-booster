import { Event } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'

@Event
export class TopicCreated {
  public constructor(
    readonly topicID: UUID,
    readonly title: string,
    readonly hostID: UUID,
    readonly createdAt: number,
    readonly expiredAt: number
  ) {}

  public entityID(): UUID {
    return this.topicID
  }
}
