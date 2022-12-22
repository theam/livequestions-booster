import { Event } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'

@Event
export class QuestionCreated {
  public constructor(
    readonly questionID: UUID,
    readonly topicID: UUID,
    readonly creatorID: UUID,
    readonly question: string,
    readonly createdAt: number,
    readonly isAnonymous: boolean
  ) {}

  public entityID(): UUID {
    return this.questionID
  }
}
