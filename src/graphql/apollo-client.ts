import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getSession } from "next-auth/react";

const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL,
    // ? process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL
    // : "http://localhost:4000/graphql",
    credentials: "include",
});

const wsLink =
    typeof window !== "undefined"
        ? new GraphQLWsLink(
              createClient({
                  url: process.env
                      .NEXT_PUBLIC_GRAPHQL_SERVER_SUBSCRIPTION_URL as string,
                  //   ? process.env.NEXT_PUBLIC_GRAPHQL_SERVER_SUBSCRIPTION_URL
                  //   : "ws://localhost:4000/graphql/subscriptions",
                  connectionParams: async () => ({
                      session: await getSession(),
                  }),
              })
          )
        : null;

const link =
    typeof window !== "undefined" && wsLink != null
        ? split(
              ({ query }) => {
                  const definition = getMainDefinition(query);
                  return (
                      definition.kind === "OperationDefinition" &&
                      definition.operation === "subscription"
                  );
              },
              wsLink,
              httpLink
          )
        : httpLink;

export const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});
