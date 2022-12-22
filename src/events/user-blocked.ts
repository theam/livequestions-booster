import { Event } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'

@Event
export class UserBlocked {
  public constructor(
    readonly userID: UUID,
    readonly blockedUserID: UUID
  ) {}

  public entityID(): UUID {
    return this.userID
  }
}
