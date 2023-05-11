import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import { useQuery } from "@apollo/client";
import conversationOperations from "@/graphql/operations/conversation";
import { Conversation } from "@/gql/graphql";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface ConversationWrapperProps {
    session: Session;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
    session,
}) => {
    const {
        data: conversationsData,
        loading: conversationsLoading,
        error: conversationsError,
        subscribeToMore,
    } = useQuery(conversationOperations.Queries.conversations);

    const router = useRouter();
    const {
        query: { conversationId },
    } = router;

    console.log("Conversations", conversationsData);

    const onViewConversation = async (conversationId: string) => {
        router.push({ query: { conversationId } });
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
            bg="whiteAlpha.100"
            py={6}
            px={3}
        >
            <ConversationList
                session={session}
                conversations={
                    (conversationsData?.conversations as Array<Conversation>) ||
                    ([] as Array<Conversation>)
                }
                onViewConversation={onViewConversation}
            />
        </Box>
    );
};

export default ConversationWrapper;
