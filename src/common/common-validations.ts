import { Booster } from "@boostercloud/framework-core";
import { CommandInput, Register, UserEnvelope } from "@boostercloud/framework-types"
import { UUID } from "@boostercloud/framework-types";
import { Question } from "../entities/question";
import { Topic } from "../entities/topic";
import { User } from "../entities/user";
import { ConfigConstants } from "./config-constants";
import { LiveQuestionsErrors } from "./livequestions-errors";
import { TopicStatus } from "./topic-status";
import { getEnvelopeUserId, getUserId } from "./user-utils";

export namespace CommonValidations {
    export async function validateUserExists(register: Register): Promise<User> {
        const user = await Booster.entity(User, getUserId(register))

        if (!user) { 
            throw LiveQuestionsErrors.userNotFound
        }
    
        return user
    }

    export function validateUserIsAuthorized(ownerID: UUID, userID: UUID): void {
        if (ownerID !== userID) {
            throw LiveQuestionsErrors.notAuthorized
        }
    }

    export function validateUserDisplayName(displayName: string) {
        displayName = displayName.trim()

        if (displayName.length < ConfigConstants.minUserDisplayNameLength || displayName.length > ConfigConstants.maxUserDisplayNameLength) {
            throw LiveQuestionsErrors.invalidUserDisplayNameLength
          }
    }

    export async function validateTopicExists(topicID: UUID): Promise<Topic> {
        const topic = await Booster.entity(Topic, topicID)

        if (!topic) {
            throw LiveQuestionsErrors.topicNotFound
        }

        return topic
    }

    export function validateTopicIsOpen(topic: TopicStatus) {
        if (topic === TopicStatus.Deleted) {
            throw LiveQuestionsErrors.topicDeleted
        } else if (topic !== TopicStatus.Open) {
            throw LiveQuestionsErrors.topicNotOpen
        }
    }

    export function validateTopicTitle(title: string) {
        if (title.length < ConfigConstants.minTopicTitleLength || title.length > ConfigConstants.maxTopicTitleLength) {
            throw LiveQuestionsErrors.invalidTopicLength
        }
    }

    export function validateTopicTTL(ttl: number) {
        if (ttl < ConfigConstants.minTopicTTL || ttl > ConfigConstants.maxTopicTTL) {
            throw LiveQuestionsErrors.invalidTopicTTL
        }
    }

    export function validateQuestionIsFromAnotherUser(creatorID: UUID, userID: UUID) {
        if (creatorID === userID) {
            throw LiveQuestionsErrors.questionIsNotFromAnotherUser
        }
    }

    export function validateUserIsBlocked(userID: UUID, blockedIDs: Array<UUID>) {
        const index = blockedIDs.findIndex((id) => id === userID)
        if (index === -1) {
            throw LiveQuestionsErrors.userNotBlocked
        }
    }

    export function validateUserIsNotBlocked(userID: UUID, blockedIDs: Array<UUID>) {
        if (blockedIDs.find((id) => id === userID)) {
            throw LiveQuestionsErrors.userAlreadyBlocked
        }
    }

    export function validateQuestionIsNotBlocked(questionID: UUID, blockedIDs: Array<UUID>) {
        if (blockedIDs.find((id) => id === questionID)) {
            throw LiveQuestionsErrors.questionAlreadyBlocked
        }
    }

    export function validateQuestionLength(question: string) {
        if (question.length < ConfigConstants.minQuestionLength || question.length > ConfigConstants.maxQuestionLength) {
            throw LiveQuestionsErrors.invalidQuestionLength
        }
    }

    export async function validateQuestionExists(questionID: UUID): Promise<Question> {
        const question = await Booster.entity(Question, questionID)

        if (!question) {
            throw LiveQuestionsErrors.questionNotFound
        }

        return question
    }

    // ***** "Before" validations (for Commands): *****

    /**
    * Validates that the user exists and is not marked as deleted.
    */        
    export async function userValidation(input: CommandInput, currentUser?: UserEnvelope): Promise<CommandInput> {
        const userId = getEnvelopeUserId(currentUser)
        const user = await Booster.entity(User, userId)
    
        if (!user || user.isDeleted === true) {
          throw LiveQuestionsErrors.userNotFound
        }

        return input
    }
}