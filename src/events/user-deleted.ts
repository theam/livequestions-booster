import { Event } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'

@Event
export class UserDeleted {
  public constructor(
    readonly userID: UUID,
  ) {}

  public entityID(): UUID {
    return this.userID
  }
}
