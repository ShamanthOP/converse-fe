import conversationOperations from "@/graphql/operations/conversation";
import { useQuery } from "@apollo/client";
import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import { BiMessageSquareDots } from "react-icons/bi";

const EmptyFeed: React.FC = () => {
    const { data, loading, error } = useQuery(
        conversationOperations.Queries.conversations
    );
    if (!data?.conversations || loading || error) return null;

    const { conversations } = data;
    const hasConversations = conversations.length;
    const displayText = hasConversations
        ? "Select a Conversation"
        : "Let's get started😛";

    return (
        <Flex height={"100%"} justify={"center"} align={"center"}>
            <Stack spacing={10} align={"center"}>
                <Text fontSize={40}>{displayText}</Text>
                <BiMessageSquareDots fontSize={90} />
            </Stack>
        </Flex>
    );
};

export default EmptyFeed;
