import ConversationModal from "@/components/Chat/Converstaions/Modal/ConversationModal";
import { Conversation } from "@/gql/graphql";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";
import ConversationItem from "./ConversationItem";

interface ConversationListProps {
    session: Session;
    conversations: Array<Conversation>;
}

const ConversationList: React.FC<ConversationListProps> = ({
    session,
    conversations,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onModalOpen = () => setIsModalOpen(true);
    const onModalClose = () => setIsModalOpen(false);

    return (
        <Box width="100%">
            <Box
                py={2}
                px={4}
                mb={4}
                bg="blackAlpha.400"
                borderRadius={4}
                cursor="pointer"
                onClick={onModalOpen}
            >
                <Text color={"whiteAlpha.800"} fontWeight={500}>
                    Find or start a conversation
                </Text>
            </Box>
            <ConversationModal
                isModalOpen={isModalOpen}
                onModalClose={onModalClose}
                session={session}
            />
            {conversations.map((conversation) => {
                return (
                    <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                    />
                );
            })}
        </Box>
    );
};

export default ConversationList;
