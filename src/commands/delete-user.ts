import { Booster, Command } from '@boostercloud/framework-core'
import { Register } from '@boostercloud/framework-types'
import { QuestionStatus } from '../common/question-status'
import { TopicStatus } from '../common/topic-status'
import { getUserId } from '../common/user-utils'
import { UserRole } from '../config/roles'
import { TopicStatusUpdated } from '../events/topic-status-updated'
import { UserDeleted } from '../events/user-deleted'
import { TopicReadModel } from '../read-models/topic-read-model'
import { QuestionReadModel } from '../read-models/question-read-model'
import { QuestionStatusUpdated } from '../events/question-status-updated'
import { ManagementClient } from 'auth0'
import { currentEnvironment } from '../config/environment'
import { CommonValidations } from '../common/common-validations'

@Command({
  authorize: [UserRole],
  before: [CommonValidations.userValidation]
})
export class DeleteUser {
  public constructor() {}


  public static async handle(command: DeleteUser , register: Register): Promise<void> {
    const userID = getUserId(register)
    const environment = currentEnvironment()

    /// Delete user from Auth0
    const management = new ManagementClient({
      domain: process.env[`AUTH0_DOMAIN_${environment.name.toUpperCase()}`]!,
      clientId: process.env[`AUTH0_CLIENT_ID_${environment.name.toUpperCase()}`],
      clientSecret: process.env[`AUTH0_CLIENT_SECRET_${environment.name.toUpperCase()}`],
      scope: 'delete:users'
    })

    await management.deleteUser({ id: userID })
  
    const userDeleted = new UserDeleted(userID)
    register.events(userDeleted)

    /// Mark all topics as deleted where the deleted user is a host
    const topicsToDelete = await Booster.readModel(TopicReadModel)
    .filter({ hostID: { eq: userID }, status: { ne: TopicStatus.Deleted } })
    .search()
    .then ((readmodels) => { return (readmodels as TopicReadModel[]) })
    
    if (topicsToDelete.length > 0) {
      topicsToDelete.forEach ((readmodel) => { register.events(new TopicStatusUpdated(readmodel.id, TopicStatus.Deleted, Date.now())) })
    }

    /// Mark all questions as deleted where the deleted user is the creator
    const questionsToDelete = await Booster.readModel(QuestionReadModel)
    .filter({ creatorID : { eq: userID }, status: { ne: QuestionStatus.Deleted }})
    .search()
    .then ((readmodels) => { return (readmodels as QuestionReadModel[]) })
    
    if (questionsToDelete.length > 0) {
      questionsToDelete.forEach ((readmodel) => { register.events(new QuestionStatusUpdated(readmodel.id, QuestionStatus.Deleted, Date.now())) })
    }    
  }
}

