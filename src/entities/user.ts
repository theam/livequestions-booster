import { Entity, Reduces } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'
import { QuestionBlocked } from '../events/question-blocked'
import { UserBlocked } from '../events/user-blocked'
import { UserCreated } from '../events/user-created'
import { UserDeleted } from '../events/user-deleted'
import { UserUnblocked } from '../events/user-unblocked'
import { UserUpdated } from '../events/user-updated'

@Entity
export class User {
  public constructor(
    public id: UUID,
    readonly displayName: string,
    readonly username: string,
    readonly email: string,
    readonly isDeleted: boolean,
    readonly blockedUserIDs: Array<UUID>,
    readonly blockedQuestionIDs: Array<UUID>
  ) {}

  /// Instead of raising an exception and create an anti-pattern that will cause the reduction system to be unable to reduce further events for this entity object.
  /// Booster is about to provide a No-Operation return value for this case in a future update. In the meanwhile, returning this “trashcan entity” is harmless.
  /// https://github.com/boostercloud/booster/issues/1257
  static userNotFound = new User(new UUID(0), "", "", "", true, [], [])

  @Reduces(UserCreated)
  public static createUser(event: UserCreated, currentUser?: User): User {
    if (currentUser) {
      return { 
        ...currentUser,
        displayName: event.displayName,
        username: event.username,
        email: event.email,
        isDeleted: false
      }
    }   

    return new User(event.userID, event.displayName, event.username, event.email, false, [], [])
  }

  @Reduces(UserUpdated)
  public static updateUser(event: UserUpdated, currentUser?: User): User {
    if (!currentUser) {
      return User.userNotFound
    }

    return {
      ...currentUser,
      displayName: event.displayName
    }
  }

  @Reduces(UserDeleted)
  public static deleteUser(event: UserDeleted, currentUser?: User): User {
    if (!currentUser) {
      return User.userNotFound
    }

    return {
      ...currentUser,
      isDeleted: true
    }
  }

  @Reduces(QuestionBlocked)
  public static blockQuestion(event: QuestionBlocked, currentUser?: User): User {
    if (!currentUser) {
      return User.userNotFound
    }

    let blockedQuestionIDs = currentUser.blockedQuestionIDs

    if (blockedQuestionIDs.find((id) => id === event.questionID)) {
      return currentUser
    }

    blockedQuestionIDs.push(event.questionID)

    return {
      ...currentUser,
      blockedQuestionIDs: blockedQuestionIDs
    }
  }

  @Reduces(UserUnblocked)
  public static unblockUser(event: UserUnblocked, currentUser?: User): User {
    if (!currentUser) {
      return User.userNotFound
    }

    const blockedUserIDs = currentUser.blockedUserIDs.filter((userID) => userID !== event.unblockedUserId)
    
    return {
      ...currentUser,
      blockedUserIDs: blockedUserIDs
    }
  }

  @Reduces(UserBlocked)
  public static blockUser(event: UserBlocked, currentUser?: User): User {
    if (!currentUser) {
      return User.userNotFound
    }

    let blockedUserIDs = currentUser.blockedUserIDs

    if (blockedUserIDs.find((id) => id === event.blockedUserID)) {
      return currentUser
    }

    blockedUserIDs.push(event.blockedUserID)

    return {
      ...currentUser,
      blockedQuestionIDs: blockedUserIDs
    }
  }
}
