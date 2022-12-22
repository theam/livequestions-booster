import { Event } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'

@Event
export class QuestionBlocked {
  public constructor(
    readonly userID: UUID,
    readonly questionID: UUID
  ) {}

  public entityID(): UUID {
    return this.userID
  }
}
