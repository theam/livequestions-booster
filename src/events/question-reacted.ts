import { Event } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'

@Event
export class QuestionReacted {
  public constructor(
    readonly questionID: UUID,
    readonly userID: UUID,
    readonly like: boolean,
    readonly updatedAt: number
  ) {}

  public entityID(): UUID {
    return this.questionID
  }
}
