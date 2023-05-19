import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import { gql, useMutation, useQuery } from "@apollo/client";
import conversationOperations from "@/graphql/operations/conversation";
import { Conversation, Participant } from "@/gql/graphql";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SkeletonLoader from "@/components/common/SkeletonLoader";

interface ConversationWrapperProps {
    session: Session;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
    session,
}) => {
    const router = useRouter();
    const {
        query: { conversationId },
    } = router;
    const {
        user: { id: userId },
    } = session;

    const {
        data: conversationsData,
        loading: conversationsLoading,
        error: conversationsError,
        subscribeToMore,
    } = useQuery(conversationOperations.Queries.conversations);

    const [markConversationAsRead] = useMutation(
        conversationOperations.Muatations.markConversationAsRead
    );

    const onViewConversation = async (
        conversationId: string,
        hasSeenLatestMessage: boolean | undefined
    ) => {
        router.push({ query: { conversationId } });

        if (hasSeenLatestMessage) return;
        try {
            console.log(
                "OnviewConversation",
                conversationId,
                hasSeenLatestMessage
            );
            await markConversationAsRead({
                variables: {
                    userId,
                    conversationId,
                },
                optimisticResponse: {
                    markConversationAsRead: true,
                },
                update: (cache) => {
                    const participantsFragment = cache.readFragment<{
                        participants: Array<Participant>;
                    }>({
                        id: `Conversation:${conversationId}`,
                        fragment: gql`
                            fragment Participants on Conversation {
                                participants {
                                    user {
                                        id
                                        username
                                    }
                                    hasSeenLatestMessage
                                }
                            }
                        `,
                    });
                    if (!participantsFragment) return;

                    const participants = [...participantsFragment.participants];
                    const userParticipantIndex = participants.findIndex(
                        (participant) => participant.user?.id === userId
                    );
                    if (userParticipantIndex < 0) return;

                    const userParticipant = participants[userParticipantIndex];
                    participants[userParticipantIndex] = {
                        ...userParticipant,
                        hasSeenLastMessage: true,
                    };

                    cache.writeFragment({
                        id: `Conversation:${conversationId}`,
                        fragment: gql`
                            fragment UpdateParticipant on Conversation {
                                participants
                            }
                        `,
                        data: {
                            participants,
                        },
                    });
                },
            });
        } catch (e: any) {
            console.log(e?.message);
        }
    };

    const subscribeToNewConversations = () => {
        subscribeToMore({
            document: conversationOperations.Subscriptions.conversationCreated,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                    return prev;
                }
                console.log(
                    "Conversations subscription data and prev",
                    subscriptionData,
                    prev
                );
                const newConversation =
                    subscriptionData.data.conversationCreated;
                return Object.assign({}, prev, {
                    conversations: [
                        newConversation,
                        ...(prev.conversations as Array<Conversation>),
                    ],
                });
            },
        });
    };

    useEffect(() => {
        subscribeToNewConversations();
    }, []);

    return (
        <Box
            display={{ base: conversationId ? "none" : "flex", md: "flex" }}
            width={{ base: "100%", md: "400px" }}
            flexDirection={"column"}
            bg="whiteAlpha.100"
            gap={4}
            py={6}
            px={3}
        >
            {conversationsLoading ? (
                <SkeletonLoader count={7} height="80px" />
            ) : (
                <ConversationList
                    session={session}
                    conversations={
                        (conversationsData?.conversations as Array<Conversation>) ||
                        ([] as Array<Conversation>)
                    }
                    onViewConversation={onViewConversation}
                />
            )}
        </Box>
    );
};

export default ConversationWrapper;
