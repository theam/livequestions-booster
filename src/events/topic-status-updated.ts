import { Event } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'
import { TopicStatus } from '../common/topic-status'

@Event
export class TopicStatusUpdated {
  public constructor(
    readonly topicID: UUID,
    readonly status: TopicStatus,
    readonly updatedAt: number
  ) {}

  public entityID(): UUID {
    return this.topicID
  }
}
