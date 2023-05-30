import ConversationModal from "@/components/Chat/Converstaions/Modal/ConversationModal";
import { Conversation, Participant } from "@/gql/graphql";
import { Box, Button, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useContext, useState } from "react";
import ConversationItem from "./ConversationItem";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useMutation } from "@apollo/client";
import conversationOperations from "@/graphql/operations/conversation";
import { signOut } from "next-auth/react";
import { ModalContext, ModalInterface } from "@/context/ModalContext";

interface ConversationListProps {
    session: Session;
    conversations: Array<Conversation>;
    onViewConversation: (
        conversationId: string,
        hasSeenLastMessage: boolean | undefined
    ) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
    session,
    conversations,
    onViewConversation,
}) => {
    const router = useRouter();
    const {
        query: { conversationId },
    } = router;
    const {
        user: { id: userId },
    } = session;

    const [editingConversation, setEditingConversation] =
        useState<Conversation | null>(null);

    const { isModalOpen, openModal, closeModal } =
        useContext<ModalInterface>(ModalContext);

    const [updateParticipants, { loading: updatedParticipantsLoading }] =
        useMutation(conversationOperations.Muatations.updatePartcicpants);

    const [deleteConversation] = useMutation(
        conversationOperations.Muatations.deleteConversation
    );

    const onLeaveConversation = async (conversation: Conversation) => {
        const participantIds = conversation.participants
            ?.filter((participant) => {
                return participant?.user?.id !== userId;
            })
            .map((p) => p?.user?.id);

        try {
            if (!conversation.id || !participantIds) return;
            const { data, errors } = await updateParticipants({
                variables: {
                    conversationId: conversation.id,
                    participantIds: participantIds as Array<string>,
                },
            });

            if (!data || errors) {
                throw new Error("Failed to update participants!");
            }
        } catch (e: any) {
            console.log("updateParticipants error", e.message);
            toast.error(e.message);
        }
    };

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

    const getUserParticipant = (conversation: Conversation) => {
        return conversation.participants?.find(
            (p) => p?.user?.id === userId
        ) as Participant;
    };

    const onEditConversation = (conversation: Conversation) => {
        setEditingConversation(conversation);
        openModal();
    };

    const toggleModalClose = () => {
        setEditingConversation(null);
        closeModal();
    };

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
                onClick={openModal}
            >
                <Text color={"whiteAlpha.800"} fontWeight={500}>
                    Find or start a conversation
                </Text>
            </Box>
            <ConversationModal
                isModalOpen={isModalOpen}
                onModalClose={toggleModalClose}
                session={session}
                conversations={conversations}
                editingConversation={editingConversation}
                getUserParticipant={getUserParticipant}
                onViewConversation={onViewConversation}
            />
            {sortedConversations.map((conversation) => {
                // const participant = conversation.participants?.find(
                //     (participant) => participant?.user?.id === userId
                // );
                const { hasSeenLastMessage } = getUserParticipant(conversation);
                return (
                    <ConversationItem
                        key={conversation.id}
                        userId={userId}
                        conversation={conversation}
                        onClick={() =>
                            onViewConversation(
                                conversation.id!,
                                hasSeenLastMessage ?? true
                            )
                        }
                        onDeleteConversation={onDeleteConversation}
                        selectedConversationId={conversationId as string}
                        hasSeenLastMessage={hasSeenLastMessage ?? true}
                        onEditConversation={() =>
                            onEditConversation(conversation)
                        }
                        onLeaveConversation={onLeaveConversation}
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
