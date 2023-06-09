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
        markConversationAsRead: gql(`
            mutation MarkConversationAsRead($userId: String!, $conversationId: String!) {
                markConversationAsRead(userId: $userId, conversationId: $conversationId)
            }
        `),
        deleteConversation: gql(`
            mutation DeleteConversation($conversationId: String!) {
                deleteConversation(conversationId: $conversationId)
            }
        `),
        updatePartcicpants: gql(`
            mutation UpdateParticipants(
                $conversationId: String!
                $participantIds: [String]!
            ) {
                updateParticipants(
                    conversationId: $conversationId
                    participantIds: $participantIds
                )
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
        conversationUpdated: gql(`
            subscription ConversationUpdated {
                conversationUpdated {
                    conversation {
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
                    addedUserIds
                    removedUserIds
                }
            }
        `),
        conversationDeleted: gql(`
            subscription ConversationDeleted {
                conversationDeleted {
                    id
                }
            }
        `),
    },
};

export default conversationOperations;
