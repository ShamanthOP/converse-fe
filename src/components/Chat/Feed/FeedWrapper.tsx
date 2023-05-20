import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessageHeader from "./Messages/MessageHeader";
import MessageInput from "./Messages/MessageInput";
import Messages from "./Messages/Messages";
import EmptyFeed from "./EmptyFeed";

interface FeedWrapperProps {
    session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
    const router = useRouter();
    const { conversationId } = router.query;
    const {
        user: { id: userId },
    } = session;

    return (
        <Flex
            display={{ base: conversationId ? "flex" : "none", md: "flex" }}
            width={"100%"}
            direction={"column"}
        >
            {conversationId && typeof conversationId === "string" ? (
                <>
                    <Flex
                        direction={"column"}
                        justify={"space-between"}
                        overflow={"hidden"}
                        flexGrow={1}
                    >
                        <MessageHeader
                            userId={userId}
                            conversationId={conversationId}
                        />
                        <Messages
                            conversationId={conversationId}
                            userId={userId}
                        />
                    </Flex>
                    <MessageInput
                        session={session}
                        conversationId={conversationId}
                    />
                </>
            ) : (
                <EmptyFeed />
            )}
        </Flex>
    );
};

export default FeedWrapper;
