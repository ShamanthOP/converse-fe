import { Conversation } from "@/gql/graphql";
import { Stack, Text } from "@chakra-ui/react";

interface ConversationItemProps {
    conversation: Conversation;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
    conversation,
}) => {
    return (
        <Stack p={4} _hover={{ bg: "whiteAlpha.200" }}>
            <Text>{conversation.id}</Text>
        </Stack>
    );
};

export default ConversationItem;
