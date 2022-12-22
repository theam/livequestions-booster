import { Projects, ReadModel } from '@boostercloud/framework-core'
import { ProjectionResult, ReadModelAction, UUID } from '@boostercloud/framework-types'
import { TopicStatus } from '../common/topic-status'
import { Topic } from '../entities/topic'
import { UserRole } from '../config/roles'

@ReadModel({
  authorize: [UserRole]
})
export class TopicReadModel {
  public constructor(
    public id: UUID,
    public title: string,
    public createdAt: number,
    public updatedAt: number,
    public expiredAt: number,
    public status: TopicStatus,
    public hostID: UUID,
    public questionsCount: number,
    public participantIDs: Array<UUID>
  ) {}

  @Projects(Topic, 'id')
  public static projectTopic(entity: Topic, currentReadModel?: TopicReadModel): ProjectionResult<TopicReadModel> {
    if (entity.status === TopicStatus.Deleted) {
      return ReadModelAction.Delete
    }

    return new TopicReadModel(
      entity.id,
      entity.title,
      entity.createdAt,
      entity.updatedAt,
      entity.expiredAt,
      entity.status,
      entity.hostID,
      entity.questionIDs.length,
      entity.participantIDs
    )
  }
}
