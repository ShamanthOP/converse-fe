import { Conversation } from "@/gql/graphql";
import {
    Menu,
    MenuItem,
    MenuList,
    Stack,
    Text,
    Avatar,
    Box,
    Flex,
} from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import React, { useState } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";
import { formatUsernames, participantImage } from "@/utils/functions";
import useLongPress from "@/hooks/useLongPress";

const formatRelativeLocale = {
    lastWeek: "eeee",
    yesterday: "'Yesterday",
    today: "p",
    other: "MM/dd/yy",
};

interface ConversationItemProps {
    userId: string;
    conversation: Conversation;
    onClick: () => void;
    onEditConversation?: () => void;
    onDeleteConversation?: (conversationId: string) => void;
    selectedConversationId?: string;
    hasSeenLastMessage?: boolean | undefined;
    onLeaveConversation?: (conversation: Conversation) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
    conversation,
    userId,
    onClick,
    onDeleteConversation,
    selectedConversationId,
    hasSeenLastMessage,
    onEditConversation,
    onLeaveConversation,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const onLongPress = useLongPress<HTMLDivElement>(
        {
            onLongPress(e) {
                setMenuOpen(true);
            },
        },
        { shouldPreventDefault: true }
    );

    const handleClick = (event: React.MouseEvent) => {
        if (event.type === "click") {
            onClick();
        } else if (event.type === "contextmenu") {
            event.preventDefault();
            setMenuOpen(true);
        }
    };

    const showMenu =
        onEditConversation && onDeleteConversation && onLeaveConversation;

    return (
        <Stack
            direction="row"
            align="center"
            justify="space-between"
            p={4}
            cursor="pointer"
            borderRadius={4}
            bg={
                selectedConversationId === conversation.id
                    ? "whiteAlpha.100"
                    : "none"
            }
            _hover={{
                bg:
                    selectedConversationId === conversation.id
                        ? "whiteAlpha.100"
                        : "whiteAlpha.50",
            }}
            onClick={handleClick}
            onContextMenu={handleClick}
            {...onLongPress}
            position="relative"
        >
            {showMenu && (
                <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
                    <MenuList bg={"#2d2d2d"}>
                        <MenuItem
                            icon={<AiOutlineEdit fontSize={20} />}
                            onClick={(event) => {
                                event.stopPropagation();
                                onEditConversation();
                            }}
                            bg={"#2d2d2d"}
                            _hover={{ bg: "whiteAlpha.300" }}
                        >
                            Edit
                        </MenuItem>
                        {conversation.participants?.length! > 2 ? (
                            <MenuItem
                                icon={<BiLogOut fontSize={20} />}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onLeaveConversation(conversation);
                                }}
                                bg={"#2d2d2d"}
                                _hover={{ bg: "whiteAlpha.300" }}
                            >
                                Leave
                            </MenuItem>
                        ) : (
                            <MenuItem
                                icon={<MdDeleteOutline fontSize={20} />}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onDeleteConversation(conversation.id!);
                                }}
                                bg={"#2d2d2d"}
                                _hover={{ bg: "whiteAlpha.300" }}
                            >
                                Delete
                            </MenuItem>
                        )}
                    </MenuList>
                </Menu>
            )}
            <Flex position="absolute" left="-6px">
                {!hasSeenLastMessage && (
                    <GoPrimitiveDot fontSize={18} color="#90EE90" />
                )}
            </Flex>
            {participantImage(conversation.participants!, userId) ? (
                <Avatar
                    src={participantImage(conversation.participants!, userId)}
                />
            ) : (
                <Avatar />
            )}
            <Flex justify="space-between" width="80%" height="100%">
                <Flex direction="column" width="70%" height="100%">
                    <Text
                        fontWeight={600}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                    >
                        {formatUsernames(conversation.participants!, userId)}
                    </Text>
                    {conversation.latestMessage && (
                        <Box width="140%">
                            <Text
                                color="whiteAlpha.700"
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                            >
                                {conversation.latestMessage.body}
                            </Text>
                        </Box>
                    )}
                </Flex>
                <Text color="whiteAlpha.700" textAlign="right">
                    {formatRelative(
                        new Date(conversation.updatedAt),
                        new Date(),
                        {
                            locale: {
                                ...enUS,
                                formatRelative: (token) =>
                                    formatRelativeLocale[
                                        token as keyof typeof formatRelativeLocale
                                    ],
                            },
                        }
                    )}
                </Text>
            </Flex>
        </Stack>
    );
};

export default ConversationItem;
