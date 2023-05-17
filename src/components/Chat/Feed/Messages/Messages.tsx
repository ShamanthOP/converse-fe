import SkeletonLoader from "@/components/common/SkeletonLoader";
import { Message } from "@/gql/graphql";
import messageOperations from "@/graphql/operations/message";
import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import MessageItem from "./MessageItem";

interface MessagesProps {
    conversationId: string;
    userId: string;
}

const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {
    const { data, loading, error, subscribeToMore } = useQuery(
        messageOperations.Queries.messages,
        {
            variables: { conversationId },
            onError: ({ message }) => {
                toast.error(message);
            },
        }
    );

    const subscribeToMoreMessages = (conversationId: string) => {
        subscribeToMore({
            document: messageOperations.Subscriptions.messageSent,
            variables: { conversationId },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData) return prev;
                console.log("Subscription message", subscriptionData);
                const newMessage = subscriptionData.data.messageSent;
                return Object.assign({}, prev, {
                    messages:
                        newMessage?.sender?.id === userId
                            ? prev.messages
                            : [
                                  newMessage,
                                  ...(prev.messages as Array<Message>),
                              ],
                });
            },
        });
    };

    useEffect(() => {
        subscribeToMoreMessages(conversationId);
    }, [conversationId]);

    if (error) {
        return null;
    }

    console.log("Messages data", data);

    return (
        <Flex direction={"column"} justify={"flex-end"} overflow={"hidden"}>
            {loading && (
                <Stack spacing={4} px={4}>
                    <SkeletonLoader count={4} height="60px" />
                </Stack>
            )}
            {data?.messages && (
                <Flex
                    direction={"column-reverse"}
                    overflowY={"scroll"}
                    height={"100%"}
                >
                    {data.messages.map((message) => {
                        return (
                            <MessageItem
                                key={message?.id}
                                message={message!}
                                sentByMe={message?.sender?.id === userId}
                            />
                        );
                    })}
                </Flex>
            )}
        </Flex>
    );
};

export default Messages;
