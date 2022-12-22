import { Projects, ReadModel } from '@boostercloud/framework-core'
import { ProjectionResult, ReadModelAction, UUID } from '@boostercloud/framework-types'
import { User } from '../entities/user'
import { UserRole } from '../config/roles'

@ReadModel({
  authorize: [UserRole]
})
export class UserReadModel {
  public constructor(
    public id: UUID,
    public displayName: string,
    public username: string,
    public blockedUserIDs: Array<UUID>,
    public blockedQuestionIDs: Array<UUID>
  ) {}

  @Projects(User, 'id')
  public static projectUserInfo(entity: User, currentReadModel?: UserReadModel): ProjectionResult<UserReadModel> {
    if (entity.isDeleted) {
      return ReadModelAction.Delete
    }

    return new UserReadModel(
      entity.id,
      entity.displayName,
      entity.username,
      entity.blockedUserIDs,
      entity.blockedQuestionIDs
    )
  }
}
