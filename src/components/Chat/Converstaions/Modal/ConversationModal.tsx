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
} from "@chakra-ui/react";
import { useState } from "react";
import UserSearchList from "./UserSearchList";
import { SearchedUser } from "@/gql/graphql";
import ParticipantsList from "./ParticipantsList";
import { toast } from "react-hot-toast";
import conversationOperations from "@/graphql/operations/conversation";
import { Session } from "next-auth";
import { Maybe } from "@/gql/graphql";
import { useRouter } from "next/router";

interface ConversationModalProps {
    isModalOpen: boolean;
    onModalClose: () => void;
    session: Session;
}

const ConversationModal: React.FC<ConversationModalProps> = ({
    isModalOpen,
    onModalClose,
    session,
}) => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [participants, setParticipants] = useState<Array<SearchedUser>>([]);

    const {
        user: { id: currentUserId },
    } = session;

    const [searchUsers, { data, loading, error }] = useLazyQuery(
        userOperations.Queries.searchUsers
    );

    const [createConversation, { loading: createConversationLoading }] =
        useMutation(conversationOperations.Muatations.createConversation);

    const addParticipant = (user: SearchedUser) => {
        if (!participants.find((participant) => participant.id === user.id)) {
            setParticipants((prev) => [...prev, user]);
        }
        setUsername("");
    };

    const removeParticipant = (user: SearchedUser) => {
        setParticipants((prev) => prev.filter((p) => p.id !== user.id));
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

    const onSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        await searchUsers({ variables: { username } });
    };

    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setParticipants([]);
                    setUsername("");
                    onModalClose();
                }}
            >
                <ModalOverlay />
                <ModalContent bg={"#2d2d2d"} pb={4}>
                    <ModalHeader>Create a Conversation</ModalHeader>
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
                                addParticipant={addParticipant}
                            />
                        )}
                        {participants.length !== 0 && (
                            <>
                                <ParticipantsList
                                    participants={participants}
                                    removeParticipant={removeParticipant}
                                />
                                <Button
                                    bg={"brand.100"}
                                    width={"100%"}
                                    mt={6}
                                    _hover={{ bg: "brand.100" }}
                                    isLoading={createConversationLoading}
                                    onClick={() => {
                                        onCreateConversation();
                                    }}
                                >
                                    Create Conversation
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
