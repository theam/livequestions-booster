import { ConfigConstants } from './config-constants'

export namespace LiveQuestionsErrors {
    export const notAuthorized = new Error('Not authorized.')

    export const userNotDeleted = new Error("Failed to delete the user.")
    export const userAlreadyExists = new Error("The user already exists.")
    export const userNotFound = new Error("The user was not found.")
    export const invalidUserDisplayNameLength = new Error(`The display name must be between ${ConfigConstants.minUserDisplayNameLength} and ${ConfigConstants.maxUserDisplayNameLength} characters.`)
    export const invalidUsername = new Error("The username can only contain letters, numbers and underscores.")
    export const invalidUsernameLength = new Error(`The username must be between ${ConfigConstants.minUsernameLength} and ${ConfigConstants.maxUsernameLength} characters.`)
    export const usernameAlreadyTaken = new Error("The username is already taken.")
    export const invalidEmailFormat = new Error("The email format is not valid.")
    export const userAlreadyBlocked = new Error('The user is already blocked.')
    export const userNotBlocked = new Error('The user is not blocked.')

    export const topicNotFound = new Error('The topic was not found.')
    export const topicNotOpen = new Error('The topic is not open.')
    export const topicDeleted = new Error('The topic was deleted.')
    export const invalidTopicTTL = new Error(`The topic expiration time must be between ${ConfigConstants.minTopicTTLInDays } and ${ConfigConstants.maxTopicTTLInDays} days.`)
    export const invalidTopicLength = new Error(`The title should have at least ${ConfigConstants.minTopicTitleLength} characters and at most ${ConfigConstants.maxTopicTitleLength} characters.`)
    export const topicAlreadyExists = new Error('The topic already exists.')
    export const topicAlreadyJoined = new Error('You are already participating in this topic.')
    export const topicAlreadyClosed = new Error('The topic is already closed.')
    export const topicAlreadyDeleted = new Error('The topic is already deleted.')
    export const openTopicNotSupported = new Error('Reopening a topic is not supported yet.')
    
    export const invalidQuestionLength = new Error(`The question should have at least ${ConfigConstants.minQuestionLength} characters and at most ${ConfigConstants.maxQuestionLength} characters.`)
    export const questionNotFound = new Error('The question was not found.')
    export const questionAlreadyDeleted = new Error('The question was deleted.')
    export const questionIsNotFromAnotherUser = new Error('The question is not from another user.')
    export const questionAlreadyBlocked = new Error('The question is already blocked.')
    export const cannotReactToOwnQuestion = new Error('You cannot like your own question!')
}