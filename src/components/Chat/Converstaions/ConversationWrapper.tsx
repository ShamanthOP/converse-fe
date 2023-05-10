import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import { useQuery } from "@apollo/client";
import conversationOperations from "@/graphql/operations/conversation";
import { Conversation } from "@/gql/graphql";

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
    } = useQuery(conversationOperations.Queries.conversations);

    console.log("Conversations", conversationsData);

    return (
        <Box
            width={{ base: "100%", md: "400px" }}
            bg="whiteAlpha.200"
            py={6}
            px={3}
        >
            <ConversationList
                session={session}
                conversations={
                    (conversationsData?.conversations as Array<Conversation>) ||
                    ([] as Array<Conversation>)
                }
            />
        </Box>
    );
};

export default ConversationWrapper;
