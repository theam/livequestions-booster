import { Entity, Reduces } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'
import { TopicStatus } from '../common/topic-status'
import { TopicCreated } from '../events/topic-created'
import { TopicJoined } from '../events/topic-joined'
import { TopicQuestionCreated } from '../events/topic-question-created'
import { TopicQuestionDeleted } from '../events/topic-question-deleted'
import { TopicStatusUpdated } from '../events/topic-status-updated'
import { TopicUpdated } from '../events/topic-updated'

@Entity
export class Topic {
  public constructor(
    public id: UUID,
    public title: string,
    public createdAt: number,
    public updatedAt: number,
    public expiredAt: number,
    public status: TopicStatus,
    public hostID: UUID,
    public questionIDs: Array<UUID>,
    public participantIDs: Array<UUID>
  ) {}

  /// Instead of raising an exception and create an anti-pattern that will cause the reduction system to be unable to reduce further events for this entity object.
  /// Booster is about to provide a No-Operation return value for this case in a future update. In the meanwhile, returning this “trashcan entity” is harmless.
  /// https://github.com/boostercloud/booster/issues/1257
  static topicNotFound = new Topic(new UUID(0), "", Date.now(), Date.now(), Date.now(), TopicStatus.Deleted, new UUID(0), [], [])

  @Reduces(TopicCreated)
  public static reduceTopicCreated(event: TopicCreated, currentTopic?: Topic): Topic {
    return {
      id: event.topicID,
      title: event.title,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
      expiredAt: event.expiredAt,
      status: TopicStatus.Open,
      hostID: event.hostID,
      questionIDs: [],
      participantIDs: []
    }
  }

  @Reduces(TopicStatusUpdated)
  public static reduceTopicStatusUpdated(event: TopicStatusUpdated, currentTopic?: Topic): Topic {
    if (!currentTopic) {
      return Topic.topicNotFound
    }

    return {
      ...currentTopic,
      updatedAt: event.updatedAt,
      status: event.status
    }
  }

  @Reduces(TopicQuestionCreated)
  public static reduceTopicQuestionCreated(event: TopicQuestionCreated, currentTopic?: Topic): Topic {
    if (!currentTopic) {
      return Topic.topicNotFound
    }

    let questionIDs = currentTopic.questionIDs

    if (questionIDs.find((id) => id === event.questionID)) {
      return currentTopic
    }

    questionIDs.push(event.questionID)
    
    return {
      ...currentTopic,
      updatedAt: event.updatedAt,
      questionIDs: questionIDs
    }
  }

  @Reduces(TopicQuestionDeleted)
  public static reduceTopicQuestionDeleted(event: TopicQuestionDeleted, currentTopic?: Topic): Topic {
    if (!currentTopic) {
      return Topic.topicNotFound
    }

    const index = currentTopic.questionIDs.findIndex((id) => id === event.questionID)
    let questionIDs = currentTopic.questionIDs
    
    if (index !== -1) {
      questionIDs.splice(index, 1)
    }

    return {
      ...currentTopic,
      updatedAt: event.updatedAt,
      questionIDs: questionIDs
    }
  }

  @Reduces(TopicJoined)
  public static reduceTopicJoined(event: TopicJoined, currentTopic?: Topic): Topic {
    if (!currentTopic) {
      return Topic.topicNotFound
    }

    let participantIDs = currentTopic.participantIDs
    participantIDs.push(event.userID)

    return {
      ...currentTopic,
      updatedAt: event.updatedAt,
      participantIDs: participantIDs
    }
  }

  @Reduces(TopicUpdated)
  public static reduceTopicUpdated(event: TopicUpdated, currentTopic?: Topic): Topic {
    if (!currentTopic) {
      return Topic.topicNotFound
    }

    return {
      ...currentTopic,
      updatedAt: event.updatedAt,
      title: event.title
    }
  }
}
