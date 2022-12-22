import { Event } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'

@Event
export class QuestionUpdated {
  public constructor(
    readonly questionID: UUID,
    readonly text: string,
    readonly updatedAt: number
  ) {}

  public entityID(): UUID {
    return this.questionID
  }
}
