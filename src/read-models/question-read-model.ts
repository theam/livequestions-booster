import { Projects, ReadModel } from '@boostercloud/framework-core'
import { ProjectionResult, ReadModelAction, UUID } from '@boostercloud/framework-types'
import { QuestionStatus } from '../common/question-status'
import { Question } from '../entities/question'
import { UserRole } from '../config/roles'

@ReadModel({
  authorize: [UserRole]
})
export class QuestionReadModel {
  public constructor(
    public id: UUID,
    public topicID: UUID,
    public text: string,
    public status: QuestionStatus,
    public creatorID: UUID,
    public isAnonymous: boolean,
    public createdAt: number,
    public updatedAt: number,
    public likes: Array<UUID> // This is failing as a Set<UUID> when generating the schema. Why?
  ) {}

  @Projects(Question, 'id')
  public static projectQuestion(entity: Question, currentReadModel?: QuestionReadModel): ProjectionResult<QuestionReadModel> {
    if (entity.status === QuestionStatus.Deleted) {
      return ReadModelAction.Delete
    }

    return new QuestionReadModel(
      entity.id,
      entity.topicID,
      entity.text,
      entity.status,
      entity.creatorID,
      entity.isAnonymous,
      entity.createdAt,
      entity.updatedAt,
      entity.likes
    )
  }
}
