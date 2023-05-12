import SkeletonLoader from "@/components/common/SkeletonLoader";
import messageOperations from "@/graphql/operations/message";
import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import { toast } from "react-hot-toast";

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
                    overflow={"scroll"}
                    height={"100%"}
                >
                    {data.messages.map((message) => {
                        return <div key={message?.id}>{message?.body}</div>;
                    })}
                </Flex>
            )}
        </Flex>
    );
};

export default Messages;
