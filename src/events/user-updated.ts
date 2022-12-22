import { Event } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'

@Event
export class UserUpdated {
  public constructor(
    readonly userID: UUID,
    readonly displayName: string
  ) {}

  public entityID(): UUID {
    return this.userID
  }
}
