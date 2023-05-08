import { gql } from "../../gql/gql";

const conversationOperations = {
    Queries: {},
    Muatations: {
        createConversation: gql(`
            mutation CreateConversation($participantIds: [String]!) {
                createConversation(participantIds: $participantIds) {
                    conversationId
                }
            }
        `),
    },
    Subscriptions: {},
};

export default conversationOperations;
