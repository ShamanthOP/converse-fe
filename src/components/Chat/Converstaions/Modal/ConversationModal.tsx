import userOperations from "@/graphql/operations/user";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Stack,
    Input,
    Button,
    Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import UserSearchList from "./UserSearchList";
import { Conversation, Participant, SearchedUser } from "@/gql/graphql";
import ParticipantsList from "./ParticipantsList";
import { toast } from "react-hot-toast";
import conversationOperations from "@/graphql/operations/conversation";
import { Session } from "next-auth";
import { Maybe } from "@/gql/graphql";
import { useRouter } from "next/router";
import ConversationItem from "../ConversationItem";

interface ConversationModalProps {
    isModalOpen: boolean;
    onModalClose: () => void;
    session: Session;
    conversations: Array<Conversation>;
    editingConversation: Conversation | null;
    onViewConversation: (
        conversationId: string,
        hasSeenLastMessage: boolean | undefined
    ) => void;
    getUserParticipant: (conversation: Conversation) => Participant;
}

const ConversationModal: React.FC<ConversationModalProps> = ({
    isModalOpen,
    onModalClose,
    session,
    conversations,
    editingConversation,
    onViewConversation,
    getUserParticipant,
}) => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
    const [existingConversation, setExistingConversation] =
        useState<Conversation | null>(null);

    const {
        user: { id: currentUserId },
    } = session;

    const [searchUsers, { data, loading, error: searchUsersError }] =
        useLazyQuery(userOperations.Queries.searchUsers);

    const [createConversation, { loading: createConversationLoading }] =
        useMutation(conversationOperations.Muatations.createConversation);

    const [updatePartcicpants, { loading: updatedParticipantsLoading }] =
        useMutation(conversationOperations.Muatations.updatePartcicpants);

    const addParticipant = (user: SearchedUser) => {
        setParticipants((prev) => [...prev, user]);
        setUsername("");
    };

    const removeParticipant = (user: SearchedUser) => {
        setParticipants((prev) => prev.filter((p) => p.id !== user.id));
    };

    const onSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        await searchUsers({ variables: { username } });
    };

    const findExistingConversation = (participantIds: Array<string>) => {
        let existingConversation: Conversation | null = null;

        for (const conversation of conversations) {
            const addedParticpants = conversation.participants?.filter(
                (p) => p?.user?.id !== currentUserId
            );
            if (addedParticpants?.length !== participantIds.length) continue;

            let allParticpantsMatching: boolean = false;
            for (const participant of addedParticpants) {
                const partcipantFound = participantIds.find(
                    (p) => p === participant?.user?.id
                );
                if (!partcipantFound) {
                    allParticpantsMatching = false;
                    break;
                }
                allParticpantsMatching = true;
            }

            if (allParticpantsMatching) existingConversation = conversation;
        }

        return existingConversation;
    };

    const onSubmit = () => {
        if (!participants.length) return;

        const participantIds = participants.map((p) => p.id);
        const existing = findExistingConversation(
            participantIds as Array<string>
        );
        if (existing) {
            toast("Conversation already exists");
            setExistingConversation(existing);
            return;
        }

        editingConversation
            ? onUpdateConversation(editingConversation)
            : onCreateConversation();
    };

    const onCreateConversation = async () => {
        const participantIds = [
            currentUserId,
            ...participants.map((participant) => participant.id),
        ] as Maybe<string>[];
        try {
            const { data } = await createConversation({
                variables: { participantIds },
            });
            if (!data?.createConversation) {
                throw new Error("Failed to create conversation");
            }

            const {
                createConversation: { conversationId },
            } = data;
            router.push({ query: { conversationId } });

            setParticipants([]);
            setUsername("");
            onModalClose();
        } catch (e: any) {
            console.log("OncreateConversation", e);
            toast.error(e?.message);
        }
    };

    const onUpdateConversation = async (conversation: Conversation) => {
        const participantIds = participants.map((p) => p.id);

        try {
            if (!conversation.id || !participantIds) return;
            const { data, errors } = await updatePartcicpants({
                variables: {
                    conversationId: conversation.id,
                    participantIds: participantIds as Array<string>,
                },
            });

            if (!data?.updateParticipants || errors) {
                throw new Error("Failed to update participants");
            }
            setParticipants([]);
            setUsername("");
            onModalClose();
        } catch (e: any) {
            console.log("updateConversation error", e);
            toast.error(e.message);
        }
    };

    const onConversationClick = () => {
        if (!existingConversation) return;

        const { hasSeenLastMessage } = getUserParticipant(existingConversation);
        onViewConversation(
            existingConversation.id!,
            hasSeenLastMessage ?? true
        );
        onModalClose();
    };

    useEffect(() => {
        if (editingConversation) {
            setParticipants(
                editingConversation.participants?.map(
                    (p) => p?.user as SearchedUser
                )!
            );
        }
    }, [editingConversation]);

    useEffect(() => {
        setExistingConversation(null);
    }, []);

    useEffect(() => {
        if (!isModalOpen) {
            setParticipants([]);
        }
    }, [isModalOpen]);

    if (searchUsersError) {
        toast.error("Error searching users");
        return null;
    }

    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setParticipants([]);
                    setUsername("");
                    onModalClose();
                }}
                size={{ base: "sm", md: "md" }}
            >
                <ModalOverlay />
                <ModalContent bg={"#2d2d2d"} pb={4}>
                    <ModalHeader>Find or Create a Conversation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={onSearch}>
                            <Stack spacing={4}>
                                <Input
                                    placeholder="Enter a username"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                    }}
                                />
                                <Button
                                    type="submit"
                                    isDisabled={!username}
                                    isLoading={loading}
                                >
                                    Search
                                </Button>
                            </Stack>
                        </form>
                        {data?.searchUsers && (
                            <UserSearchList
                                users={data.searchUsers as SearchedUser[]}
                                participants={participants}
                                addParticipant={addParticipant}
                            />
                        )}
                        {participants.length !== 0 && (
                            <>
                                <ParticipantsList
                                    participants={participants}
                                    removeParticipant={removeParticipant}
                                />
                                <Box>
                                    {existingConversation && (
                                        <ConversationItem
                                            userId={currentUserId}
                                            conversation={existingConversation}
                                            onClick={() =>
                                                onConversationClick()
                                            }
                                        />
                                    )}
                                </Box>
                                <Button
                                    bg={"brand.100"}
                                    width={"100%"}
                                    mt={6}
                                    _hover={{ bg: "brand.100" }}
                                    disabled={!!existingConversation}
                                    isLoading={
                                        createConversationLoading ||
                                        updatedParticipantsLoading
                                    }
                                    onClick={onSubmit}
                                >
                                    {editingConversation
                                        ? "Update Conversation"
                                        : "Create Conversation"}
                                </Button>
                            </>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ConversationModal;
