import ConversationModal from "@/components/Chat/Converstaions/Modal/ConversationModal";
import { Conversation } from "@/gql/graphql";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";
import ConversationItem from "./ConversationItem";
import { useRouter } from "next/router";

interface ConversationListProps {
    session: Session;
    conversations: Array<Conversation>;
    onViewConversation: (
        conversationId: string,
        hasSeenLatestMessage: boolean
    ) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
    session,
    conversations,
    onViewConversation,
}) => {
    const router = useRouter();
    const {
        user: { id: userId },
    } = session;
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
                const participant = conversation.participants?.find(
                    (participant) => participant?.user?.id === userId
                );
                return (
                    <ConversationItem
                        key={conversation.id}
                        userId={userId}
                        conversation={conversation}
                        onClick={() =>
                            onViewConversation(
                                conversation.id!,
                                participant?.hasSeenLastMessage!
                            )
                        }
                        isSelected={
                            conversation.id === router.query.conversationId
                        }
                        hasSeenLatestMessage={
                            participant?.hasSeenLastMessage ?? undefined
                        }
                    />
                );
            })}
        </Box>
    );
};

export default ConversationList;
