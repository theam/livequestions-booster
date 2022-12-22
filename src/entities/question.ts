import { Entity, Reduces } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'
import { QuestionStatus } from '../common/question-status'
import { QuestionCreated } from '../events/question-created'
import { QuestionReacted } from '../events/question-reacted'
import { QuestionStatusUpdated } from '../events/question-status-updated'
import { QuestionUpdated } from '../events/question-updated'

@Entity
export class Question {
  public constructor(
    public id: UUID,
    public topicID: UUID,
    public text: string,
    public status: QuestionStatus,
    public creatorID: UUID,
    public isAnonymous: boolean,
    public createdAt: number,
    public updatedAt: number,
    public likes: Array<UUID> // This is failing as a Set<UUID> when generating the schema.
  ) {}

  /// Instead of raising an exception and create an anti-pattern that will cause the reduction system to be unable to reduce further events for this entity object.
  /// Booster is about to provide a No-Operation return value for this case in a future update. In the meanwhile, returning this “trashcan entity” is harmless.
  /// https://github.com/boostercloud/booster/issues/1257
  static questionNotFound = new Question(new UUID(0), new UUID(0), "", QuestionStatus.Deleted, new UUID(0), true, Date.now(), Date.now(), [])

  @Reduces(QuestionCreated)
  public static reduceQuestionCreated(event: QuestionCreated, currentQuestion?: Question): Question {
    return {
      id: event.questionID,
      topicID: event.topicID,
      text: event.question,
      status: QuestionStatus.Unanswered,
      creatorID: event.creatorID,
      isAnonymous: event.isAnonymous,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
      likes: new Array<UUID>()
    }
  }

  @Reduces(QuestionReacted)
  public static reduceQuestionReacted(event: QuestionReacted, currentQuestion?: Question): Question {
    if (!currentQuestion) {
      return Question.questionNotFound
    }

    var likes = currentQuestion.likes

    if (event.like === true) {
      if (!likes.includes(event.userID)) {
        likes.push(event.userID)
      }
    } else {
      likes = likes.filter((userID) => userID !== event.userID)
    }

    return {
      ...currentQuestion,
      updatedAt: event.updatedAt,
      likes: likes
    }
  }

  @Reduces(QuestionStatusUpdated)
  public static reduceQuestionStatusUpdated(event: QuestionStatusUpdated, currentQuestion?: Question): Question {
    if (!currentQuestion) {
      return Question.questionNotFound
    }

    return {
      ...currentQuestion,
      updatedAt: event.updatedAt,
      status: event.status
    }
  }

  @Reduces(QuestionUpdated)
  public static reduceQuestionUpdated(event: QuestionUpdated, currentQuestion?: Question): Question {
    if (!currentQuestion) {
      return Question.questionNotFound
    }

    return {
      ...currentQuestion,
      updatedAt: event.updatedAt,
      text: event.text
    }
  }
}