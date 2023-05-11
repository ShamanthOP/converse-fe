import conversationOperations from "@/graphql/operations/conversation";
import { formatUsernames } from "@/utils/functions";
import { useQuery } from "@apollo/client";
import { Button, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface MessageHeaderProps {
    userId: string;
    conversationId: string;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
    userId,
    conversationId,
}) => {
    const router = useRouter();

    const { data, loading } = useQuery(
        conversationOperations.Queries.conversations
    );
    const conversation = data?.conversations?.find(
        (conversation) => conversation?.id === conversationId
    );

    return (
        <Stack
            direction={"row"}
            align={"center"}
            spacing={6}
            py={5}
            px={{ base: 4, md: 0 }}
            borderBottom={"2px solid"}
            borderColor={"whiteAlpha.200"}
        >
            <Button
                display={{ md: "none" }}
                onClick={() => {
                    router.replace("?conversationId", "/", { shallow: true });
                }}
            >
                Back
            </Button>
            {/* {loading && SkeletonLoader} */}
            {!conversation && !loading && <Text>Conversation not found</Text>}
            {conversation && (
                <Stack direction={"row"}>
                    <Text color={"whiteAlpha.600"}>To: </Text>
                    <Text fontWeight={600}>
                        {formatUsernames(conversation.participants!, userId)}
                    </Text>
                </Stack>
            )}
        </Stack>
    );
};

export default MessageHeader;
