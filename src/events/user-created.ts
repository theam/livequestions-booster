import { Event } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'

@Event
export class UserCreated {
  public constructor(
    readonly userID: UUID,
    readonly displayName: string,
    readonly username: string,
    readonly email: string
    ) {}

  public entityID(): UUID {
    return this.userID
  }
}
