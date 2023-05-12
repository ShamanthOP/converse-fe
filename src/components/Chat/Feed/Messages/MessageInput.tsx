import { Box, Input } from "@chakra-ui/react";
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

    const onSendMessage = (event: React.FormEvent) => {
        event.preventDefault();
        try {
        } catch (e: any) {
            console.log("Error in SendMessage", e);
            toast.error(e?.message);
        }
    };

    return (
        <Box px={4} py={6} width={"100%"}>
            <form onSubmit={() => {}}>
                <Input
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    placeholder="New Message"
                    size={"md"}
                    resize={"none"}
                    _focus={{
                        boxShadow: "none",
                        border: "1px solid",
                        borderColor: "whiteAlpha.400",
                    }}
                />
            </form>
        </Box>
    );
};

export default MessageInput;