import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationWrapper from "./Converstaions/ConversationWrapper";
import FeedWrapper from "./Feed/FeedWrapper";
import ModalProvider from "@/context/ModalContext";

interface ChatProps {
    session: Session;
}

const Chat: React.FC<ChatProps> = ({ session }) => {
    return (
        <Flex height="100vh">
            <ModalProvider>
                <ConversationWrapper session={session} />
                <FeedWrapper session={session} />
            </ModalProvider>
        </Flex>
    );
};

export default Chat;
