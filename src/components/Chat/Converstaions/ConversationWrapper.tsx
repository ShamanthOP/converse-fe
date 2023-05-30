import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import conversationOperations from "@/graphql/operations/conversation";
import { Conversation, Participant } from "@/gql/graphql";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import messageOperations from "@/graphql/operations/message";

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

    useSubscription(conversationOperations.Subscriptions.conversationUpdated, {
        onData: ({ client, data }) => {
            const { data: subscriptionData } = data;
            if (!subscriptionData) {
                return;
            }

            const updatedConversation =
                subscriptionData.conversationUpdated?.conversation;
            const addedUserIds =
                subscriptionData.conversationUpdated?.addedUserIds;
            const removedUserIds =
                subscriptionData.conversationUpdated?.removedUserIds;

            const updatedConversationId = updatedConversation?.id;
            const latestMessage = updatedConversation?.latestMessage;

            console.log("NEW DATA DEBUG", removedUserIds);

            //Check if the user is being removed
            if (removedUserIds && removedUserIds.length) {
                const isUserRemoved = removedUserIds.find(
                    (id) => id === userId
                );
                if (isUserRemoved) {
                    const conversationData = client.readQuery({
                        query: conversationOperations.Queries.conversations,
                    });
                    if (!conversationData) return;

                    client.writeQuery({
                        query: conversationOperations.Queries.conversations,
                        data: {
                            conversations:
                                conversationData.conversations?.filter(
                                    (conversation) => {
                                        return (
                                            conversation?.id !==
                                            updatedConversationId
                                        );
                                    }
                                ),
                        },
                    });

                    if (conversationId === updatedConversationId) {
                        router.replace(
                            typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
                                ? process.env.NEXT_PUBLIC_BASE_URL
                                : ""
                        );
                    }

                    return;
                }
            }
            if (addedUserIds && addedUserIds.length) {
                const isBeingAdded = addedUserIds.find((id) => id === userId);

                if (isBeingAdded) {
                    const conversationData = client.readQuery({
                        query: conversationOperations.Queries.conversations,
                    });
                    if (!conversationData) return;

                    if (!updatedConversation) return;
                    client.writeQuery({
                        query: conversationOperations.Queries.conversations,
                        data: {
                            conversations: [
                                ...(conversationData.conversations || []),
                                updatedConversation,
                            ],
                        },
                    });
                }
            }

            /**
             * Already viewing conversation where
             * new message is received; no need
             * to manually update cache due to
             * message subscription
             */
            if (updatedConversationId === conversationId) {
                onViewConversation(conversationId!, false);
                return;
            }

            const existingMessages = client.readQuery({
                query: messageOperations.Queries.messages,
            });
            if (!existingMessages || !existingMessages.messages) return;

            /**
             * Check if lastest message is already present
             * in the message query
             */
            const hasLatestMessage = existingMessages.messages.find(
                (message) => message?.id === latestMessage?.id
            );

            /**
             * Update query as re-fetch won't happen if you
             * view a conversation you've already viewed due
             * to caching
             */
            if (!hasLatestMessage) {
                if (!updatedConversationId || !latestMessage) return;
                client.writeQuery({
                    query: messageOperations.Queries.messages,
                    variables: { conversationId: updatedConversationId },
                    data: {
                        ...existingMessages,
                        messages: [latestMessage, ...existingMessages.messages],
                    },
                });
            }
        },
    });

    useSubscription(conversationOperations.Subscriptions.conversationDeleted, {
        onData: ({ client, data }) => {
            const { data: subscriptionData } = data;
            if (!subscriptionData) {
                return;
            }

            const existingConversations = client.readQuery({
                query: conversationOperations.Queries.conversations,
            });
            if (!existingConversations) return;
            const { conversations } = existingConversations;
            client.writeQuery({
                query: conversationOperations.Queries.conversations,
                data: {
                    conversations: conversations?.filter((conversation) => {
                        if (!conversation) return false;
                        return (
                            conversation.id !==
                            subscriptionData.conversationDeleted?.id
                        );
                    }),
                },
            });
            router.push({
                pathname: "/",
                query: {},
            });
        },
    });

    const onViewConversation = async (
        conversationId: string,
        hasSeenLastMessage: boolean | undefined
    ) => {
        router.push({ query: { conversationId } });
        if (hasSeenLastMessage) return;
        try {
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
                                        image
                                    }
                                    hasSeenLastMessage
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
