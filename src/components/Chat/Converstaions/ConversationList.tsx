import ConversationModal from "@/components/Modal/ConversationModal";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";

interface ConversationListProps {
    session: Session;
}

const ConversationList: React.FC<ConversationListProps> = ({ session }) => {
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
        </Box>
    );
};

export default ConversationList;
