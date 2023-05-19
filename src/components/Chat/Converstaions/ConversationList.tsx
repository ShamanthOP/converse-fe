import ConversationModal from "@/components/Chat/Converstaions/Modal/ConversationModal";
import { Conversation } from "@/gql/graphql";
import { Box, Button, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";
import ConversationItem from "./ConversationItem";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useMutation } from "@apollo/client";
import conversationOperations from "@/graphql/operations/conversation";
import { signOut } from "next-auth/react";

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

    const [deleteConversation] = useMutation(
        conversationOperations.Muatations.deleteConversation
    );

    const onDeleteConversation = (conversationId: string) => {
        try {
            toast.promise(
                deleteConversation({
                    variables: {
                        conversationId,
                    },
                    update: () => {
                        router.replace(
                            typeof process.env.NEXT_PUBLIC_BASE_URL == "string"
                                ? process.env.NEXT_PUBLIC_BASE_URL
                                : ""
                        );
                    },
                }),
                {
                    loading: "Deleting conversation...",
                    success: "Conversation deleted!",
                    error: "Error deleting conversation",
                }
            );
        } catch (e: any) {
            console.log("Deleting conversation error", e);
        }
    };

    const onModalOpen = () => setIsModalOpen(true);
    const onModalClose = () => setIsModalOpen(false);

    const sortedConversations = [...conversations].sort(
        (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
    );

    return (
        <Box width="100%" height={"100%"} position={"relative"}>
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
            {sortedConversations.map((conversation) => {
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
                        onDeleteConversation={onDeleteConversation}
                        isSelected={
                            conversation.id === router.query.conversationId
                        }
                        hasSeenLatestMessage={
                            participant?.hasSeenLastMessage ?? undefined
                        }
                    />
                );
            })}
            <Box
                position={"absolute"}
                bottom={"0"}
                left={"0"}
                width={"100%"}
                px={8}
                py={3}
            >
                <Button width={"100%"} onClick={() => signOut()}>
                    Log out
                </Button>
            </Box>
        </Box>
    );
};

export default ConversationList;
