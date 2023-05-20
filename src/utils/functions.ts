import { Maybe, Participant } from "@/gql/graphql";

export const formatUsernames = (
    participants: Maybe<Maybe<Participant>[]>,
    myUserId: string
): string => {
    let usernames: Array<string> = [];
    if (participants !== null) {
        usernames = participants
            .filter((participant) => participant!.user?.id !== myUserId)
            .map((participant) => participant!.user?.username as string);
    }

    return usernames.join(", ");
};

export const participantImage = (
    participants: Maybe<Maybe<Participant>[]>,
    myUserId: string
): string => {
    if (participants != null) {
        if (participants.length == 2) {
            return (
                participants.filter(
                    (participant) => participant?.user?.id !== myUserId
                )[0]?.user?.image ?? ""
            );
        }
    }
    return "";
};
