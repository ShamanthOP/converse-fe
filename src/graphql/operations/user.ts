import { gql } from "../../gql/gql";

const userOperations = {
    Queries: {},
    Muatations: {
        createUsername: gql(`
            mutation CreateUsername($username: String!) {
                createUsername(username: $username) {
                    success
                    error
                }
            }
        `),
    },
    Subscriptions: {},
};

export default userOperations;
