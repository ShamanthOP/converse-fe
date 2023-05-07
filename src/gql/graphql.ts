/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateUsernameResponse = {
  __typename?: 'CreateUsernameResponse';
  error?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['Boolean']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUsername?: Maybe<CreateUsernameResponse>;
};


export type MutationCreateUsernameArgs = {
  username?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  searchUsers?: Maybe<Array<Maybe<SearchedUser>>>;
};


export type QuerySearchUsersArgs = {
  username?: InputMaybe<Scalars['String']>;
};

export type SearchedUser = {
  __typename?: 'SearchedUser';
  id?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type SearchUsersQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers?: Array<{ __typename?: 'SearchedUser', id?: string | null, username?: string | null, image?: string | null } | null> | null };

export type CreateUsernameMutationVariables = Exact<{
  username: Scalars['String'];
}>;


export type CreateUsernameMutation = { __typename?: 'Mutation', createUsername?: { __typename?: 'CreateUsernameResponse', success?: boolean | null, error?: string | null } | null };


export const SearchUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]} as unknown as DocumentNode<SearchUsersQuery, SearchUsersQueryVariables>;
export const CreateUsernameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUsername"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUsername"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<CreateUsernameMutation, CreateUsernameMutationVariables>;