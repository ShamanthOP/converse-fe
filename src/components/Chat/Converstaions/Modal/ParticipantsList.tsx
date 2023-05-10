import { SearchedUser } from "@/gql/graphql";
import { Flex, Stack, Text } from "@chakra-ui/react";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface ParticipantsListProps {
    participants: Array<SearchedUser>;
    removeParticipant: (user: SearchedUser) => void;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({
    participants,
    removeParticipant,
}) => {
    return (
        <Flex mt={8} gap="10px" flexWrap={"wrap"}>
            {participants.map((participant) => {
                return (
                    <Stack
                        direction={"row"}
                        key={participant.id}
                        align={"center"}
                        borderRadius={4}
                        p={2}
                        bg={"whiteAlpha.400"}
                    >
                        <Text>{participant.username}</Text>
                        <IoIosCloseCircleOutline
                            size={20}
                            cursor={"pointer"}
                            onClick={() => {
                                removeParticipant(participant);
                            }}
                        />
                    </Stack>
                );
            })}
        </Flex>
    );
};

export default ParticipantsList;
