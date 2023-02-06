import { RocketFilesUserConfiguration } from "@boostercloud/rocket-file-uploads-types"

export namespace ConfigConstants {
    
    // Validation
    export const minUserDisplayNameLength = 1
    export const maxUserDisplayNameLength = 30
    export const minUsernameLength = 3
    export const maxUsernameLength = 25

    export const minTopicTitleLength = 5
    export const maxTopicTitleLength = 120
    export const minTopicTTL = 1000 * 60 * 60 * 24 // 1 day in milliseconds
    export const maxTopicTTL = 1000 * 60 * 60 * 24 * 30 // 30 days in milliseconds
    export const minTopicTTLInDays = minTopicTTL / (1000 * 60 * 60 * 24)
    export const maxTopicTTLInDays = maxTopicTTL / (1000 * 60 * 60 * 24)

    export const minQuestionLength = 5
    export const maxQuestionLength = 150

    export const rocketFilesConfigurationDefault: RocketFilesUserConfiguration = {
        storageName: 'questionablystorage',
        containerName: '', // Not needed in AWS.
        directories: ['files']
      }
}