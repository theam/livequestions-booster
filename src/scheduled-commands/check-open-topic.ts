import { Booster, ScheduledCommand } from '@boostercloud/framework-core'
import { Register } from '@boostercloud/framework-types'
import { TopicStatus } from '../common/topic-status'
import { TopicStatusUpdated } from '../events/topic-status-updated'
import { OpenTopicReadModel } from '../read-models/open-topic-read-model'

@ScheduledCommand({
  minute: '0/2' // 30 calls per hour, 720 calls per day
})
export class CheckOpenTopic {
  public static async handle(register: Register): Promise<void> {
    
    /// Check for expired open topics and update them to closed
    register.events(
      ...await Booster.readModel(OpenTopicReadModel)
      .filter({ expiredAt: { lte: Date.now()} })
      .search()
      .then ((readmodels) => {
        return (readmodels as OpenTopicReadModel[])
            .map ((readmodel) => { return new TopicStatusUpdated(readmodel.id, TopicStatus.Closed, Date.now()) })
      })
    )
  }
}
