import { gql } from "../../gql/gql";

const messageOperations = {
    Queries: {
        messages: gql(`
            query Messages($conversationId: String!) {
                messages(conversationId: $conversationId) {
                    id
                    sender {
                        id
                        username
                        image
                    }
                    body
                    createdAt
                }
            }
        `),
    },
    Mutations: {
        sendMessage: gql(`
            mutation SendMessage(
                $id: String!
                $conversationId: String!
                $senderId: String!
                $body: String!
            ) {
                sendMessage(
                    id: $id
                    conversationId: $conversationId
                    senderId: $senderId
                    body: $body
                )
            }
        `),
    },
    Subscriptions: {
        messageSent: gql(`
            subscription MessageSent($conversationId: String!) {
                messageSent(conversationId: $conversationId) {
                    id
                    sender {
                        id
                        username
                        image
                    }
                    body
                    createdAt
                }
            }
        `),
    },
};

export default messageOperations;
