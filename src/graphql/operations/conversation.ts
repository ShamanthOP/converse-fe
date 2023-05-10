import { gql } from "../../gql/gql";

const conversationOperations = {
    Queries: {
        conversations: gql(`
            query Conversations {
                conversations {
                    id
                    participants {
                        user {
                            id
                            username
                            image
                        }
                        hasSeenLastMessage
                    }
                    latestMessage {
                        id 
                        sender {
                            id
                            username
                        }
                        body
                        createdAt
                    }
                    updatedAt
                }
            }
        `),
    },
    Muatations: {
        createConversation: gql(`
            mutation CreateConversation($participantIds: [String]!) {
                createConversation(participantIds: $participantIds) {
                    conversationId
                }
            }
        `),
    },
    Subscriptions: {
        conversationCreated: gql(`
            subscription ConversationCreated {
                conversationCreated {
                    id
                    participants {
                        user {
                            id
                            username
                            image
                        }
                        hasSeenLastMessage
                    }
                    latestMessage {
                        id 
                        sender {
                            id
                            username
                        }
                        body
                        createdAt
                    }
                    updatedAt
                }
            }
        `),
    },
};

export default conversationOperations;
