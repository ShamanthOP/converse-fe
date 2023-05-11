import { Maybe, Participant } from "@/gql/graphql";

export const formatUsernames = (
    participants: Maybe<Maybe<Participant>[]>,
    myUserId: string
): string => {
    let usernames: Array<string> = [];
    if (participants !== null) {
        usernames = participants
            .filter((participant) => participant!.user?.id != myUserId)
            .map((participant) => participant!.user?.username as string);
    }

    return usernames.join(", ");
};
