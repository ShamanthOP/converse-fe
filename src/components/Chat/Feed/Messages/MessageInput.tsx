import { Message } from "@/gql/graphql";
import messageOperations from "@/graphql/operations/message";
import { useMutation } from "@apollo/client";
import { Box, Input } from "@chakra-ui/react";
import { ObjectId } from "bson";
import { Session } from "next-auth";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface MessageInputProps {
    session: Session;
    conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
    session,
    conversationId,
}) => {
    const [messageBody, setMessageBody] = useState("");
    const [sendMessage] = useMutation(messageOperations.Mutations.sendMessage);

    const onSendMessage = async (event: React.FormEvent) => {
        event.preventDefault();
        if (messageBody === "" || messageBody.trim() === "") {
            return;
        }
        try {
            const { id: senderId } = session.user;
            const messageId = new ObjectId().toString();
            setMessageBody("");
            const { data, errors } = await sendMessage({
                variables: {
                    body: messageBody,
                    senderId,
                    conversationId,
                    id: messageId,
                },
                optimisticResponse: {
                    sendMessage: true,
                },
                update: (cache) => {
                    const existingMessages = cache.readQuery({
                        query: messageOperations.Queries.messages,
                        variables: { conversationId },
                    });

                    cache.writeQuery({
                        query: messageOperations.Queries.messages,
                        variables: { conversationId },
                        data: {
                            ...existingMessages,
                            messages: [
                                {
                                    body: messageBody,
                                    id: messageId,
                                    sender: {
                                        id: session.user.id,
                                        username: session.user.username,
                                    },
                                    createdAt: new Date(Date.now()),
                                },
                                ...(existingMessages?.messages as Array<Message>),
                            ],
                        },
                    });
                },
            });

            if (!data?.sendMessage || errors) {
                throw new Error("Failed to send message");
            }
        } catch (e: any) {
            console.log("Error in SendMessage", e);
            toast.error(e?.message);
        }
    };

    return (
        <Box px={4} py={6} width={"100%"}>
            <form onSubmit={onSendMessage}>
                <Input
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    placeholder="New Message"
                    size={"md"}
                    resize={"none"}
                    _focus={{
                        boxShadow: "none",
                        border: "2px solid",
                        borderColor: "whiteAlpha.400",
                    }}
                />
            </form>
        </Box>
    );
};

export default MessageInput;
