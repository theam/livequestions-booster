import { Register, UserEnvelope } from "@boostercloud/framework-types"
import { LiveQuestionsErrors } from "./livequestions-errors"

export const getUserId = (register: Register) => {
    const id = register.currentUser?.id

    if (!id) {
        throw LiveQuestionsErrors.userNotFound
    }

    return id
}

export const getEnvelopeUserId = (envelope: UserEnvelope | undefined) => {
    const id = envelope?.id

    if (!id) {
        throw LiveQuestionsErrors.userNotFound
    }

    return id!
}