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
    const { data, loading, error, subscribeToMore, refetch } = useQuery(
        messageOperations.Queries.messages,
        {
            variables: { conversationId },
            onError: ({ message }) => {
                toast.error(message);
            },
        }
    );

    const subscribeToMoreMessages = (conversationId: string) => {
        console.log("Inside subscription", conversationId);
        try {
            return subscribeToMore({
                document: messageOperations.Subscriptions.messageSent,
                variables: { conversationId },
                updateQuery: (prev, { subscriptionData }) => {
                    console.log(
                        "Inside SUBSCRIPTION DATA",
                        prev,
                        subscriptionData
                    );
                    if (!subscriptionData) {
                        console.log("No subscription data");
                        return prev;
                    }
                    const newMessage = subscriptionData.data.messageSent;
                    console.log(
                        "Subscription DATA",
                        subscriptionData,
                        newMessage,
                        userId
                    );
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
        } catch (e: any) {
            console.log(e.message);
        }
    };

    useEffect(() => {
        refetch({ conversationId });
        const unsubscribe = subscribeToMoreMessages(conversationId);
        if (unsubscribe) return () => unsubscribe();
    }, [conversationId]);

    if (error) {
        return null;
    }

    console.log("Messages data", data, conversationId);

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
