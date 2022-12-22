import { Event } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'

@Event
export class UserUnblocked {
  public constructor(
    readonly userId: UUID,
    readonly unblockedUserId: UUID,
  ) {}

  public entityID(): UUID {
    return this.userId
  }
}
