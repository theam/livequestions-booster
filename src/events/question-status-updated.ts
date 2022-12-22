import { Event } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'
import { QuestionStatus } from '../common/question-status'

@Event
export class QuestionStatusUpdated {
  public constructor(
    readonly questionID: UUID,
    readonly status: QuestionStatus,
    readonly updatedAt: number
  ) {}

  public entityID(): UUID {
    return this.questionID
  }
}
