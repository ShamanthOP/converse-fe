/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n            query Conversations {\n                conversations {\n                    id\n                    participants {\n                        user {\n                            id\n                            username\n                            image\n                        }\n                        hasSeenLastMessage\n                    }\n                    latestMessage {\n                        id \n                        sender {\n                            id\n                            username\n                        }\n                        body\n                        createdAt\n                    }\n                    updatedAt\n                }\n            }\n        ": types.ConversationsDocument,
    "\n            mutation CreateConversation($participantIds: [String]!) {\n                createConversation(participantIds: $participantIds) {\n                    conversationId\n                }\n            }\n        ": types.CreateConversationDocument,
    "\n            subscription ConversationCreated {\n                conversationCreated {\n                    id\n                    participants {\n                        user {\n                            id\n                            username\n                            image\n                        }\n                        hasSeenLastMessage\n                    }\n                    latestMessage {\n                        id \n                        sender {\n                            id\n                            username\n                        }\n                        body\n                        createdAt\n                    }\n                    updatedAt\n                }\n            }\n        ": types.ConversationCreatedDocument,
    "\n            query SearchUsers($username: String!) {\n                searchUsers(username: $username) {\n                    id\n                    username\n                    image\n                }\n            }\n        ": types.SearchUsersDocument,
    "\n            mutation CreateUsername($username: String!) {\n                createUsername(username: $username) {\n                    success\n                    error\n                }\n            }\n        ": types.CreateUsernameDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n            query Conversations {\n                conversations {\n                    id\n                    participants {\n                        user {\n                            id\n                            username\n                            image\n                        }\n                        hasSeenLastMessage\n                    }\n                    latestMessage {\n                        id \n                        sender {\n                            id\n                            username\n                        }\n                        body\n                        createdAt\n                    }\n                    updatedAt\n                }\n            }\n        "): (typeof documents)["\n            query Conversations {\n                conversations {\n                    id\n                    participants {\n                        user {\n                            id\n                            username\n                            image\n                        }\n                        hasSeenLastMessage\n                    }\n                    latestMessage {\n                        id \n                        sender {\n                            id\n                            username\n                        }\n                        body\n                        createdAt\n                    }\n                    updatedAt\n                }\n            }\n        "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n            mutation CreateConversation($participantIds: [String]!) {\n                createConversation(participantIds: $participantIds) {\n                    conversationId\n                }\n            }\n        "): (typeof documents)["\n            mutation CreateConversation($participantIds: [String]!) {\n                createConversation(participantIds: $participantIds) {\n                    conversationId\n                }\n            }\n        "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n            subscription ConversationCreated {\n                conversationCreated {\n                    id\n                    participants {\n                        user {\n                            id\n                            username\n                            image\n                        }\n                        hasSeenLastMessage\n                    }\n                    latestMessage {\n                        id \n                        sender {\n                            id\n                            username\n                        }\n                        body\n                        createdAt\n                    }\n                    updatedAt\n                }\n            }\n        "): (typeof documents)["\n            subscription ConversationCreated {\n                conversationCreated {\n                    id\n                    participants {\n                        user {\n                            id\n                            username\n                            image\n                        }\n                        hasSeenLastMessage\n                    }\n                    latestMessage {\n                        id \n                        sender {\n                            id\n                            username\n                        }\n                        body\n                        createdAt\n                    }\n                    updatedAt\n                }\n            }\n        "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n            query SearchUsers($username: String!) {\n                searchUsers(username: $username) {\n                    id\n                    username\n                    image\n                }\n            }\n        "): (typeof documents)["\n            query SearchUsers($username: String!) {\n                searchUsers(username: $username) {\n                    id\n                    username\n                    image\n                }\n            }\n        "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n            mutation CreateUsername($username: String!) {\n                createUsername(username: $username) {\n                    success\n                    error\n                }\n            }\n        "): (typeof documents)["\n            mutation CreateUsername($username: String!) {\n                createUsername(username: $username) {\n                    success\n                    error\n                }\n            }\n        "];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;