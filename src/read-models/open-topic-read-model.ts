import { Projects, ReadModel } from '@boostercloud/framework-core'
import { ProjectionResult, ReadModelAction, UUID } from '@boostercloud/framework-types'
import { TopicStatus } from '../common/topic-status'
import { Topic } from '../entities/topic'

@ReadModel({
  authorize: []
})
export class OpenTopicReadModel {
  public constructor(
    public id: UUID,
    public expiredAt: number
  ) {}

  @Projects(Topic, 'id')
  public static projectQuestion(entity: Topic, currentReadModel?: OpenTopicReadModel): ProjectionResult<OpenTopicReadModel> {
    return (entity.status === TopicStatus.Open) ? new OpenTopicReadModel(entity.id, entity.expiredAt) : ReadModelAction.Delete
  }
}
