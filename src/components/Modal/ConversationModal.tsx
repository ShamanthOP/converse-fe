import userOperations from "@/graphql/operations/user";
import { useLazyQuery } from "@apollo/client";
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

interface ConversationModalProps {
    isModalOpen: boolean;
    onModalClose: () => void;
}

const ConversationModal: React.FC<ConversationModalProps> = ({
    isModalOpen,
    onModalClose,
}) => {
    const [username, setUsername] = useState("");

    const [searchUsers, { data, loading, error }] = useLazyQuery(
        userOperations.Queries.searchUsers
    );

    console.log("Users Serach", data);
    const onSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        await searchUsers({ variables: { username } });
    };

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={onModalClose}>
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
                            <UserSearchList users={data.searchUsers} />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ConversationModal;
