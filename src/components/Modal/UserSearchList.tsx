import { SearchedUser } from "@/gql/graphql";
import { Avatar, Button, Center, Flex, Stack, Text } from "@chakra-ui/react";

interface UserSearchListProps {
    users: Array<SearchedUser>;
}

const UserSearchList: React.FC<UserSearchListProps> = ({ users }) => {
    return (
        <>
            {users.length === 0 ? (
                <Flex mt={6} justify={"center"}>
                    <Text>No Users found</Text>
                </Flex>
            ) : (
                <Stack mt={6}>
                    {users.map((user) => {
                        return (
                            <Stack
                                key={user.id}
                                direction={"row"}
                                align={"center"}
                                spacing={4}
                                py={2}
                                px={4}
                                borderRadius={6}
                                _hover={{ bg: "whiteAlpha.200" }}
                            >
                                <Avatar src={user.image ? user.image : ""} />
                                <Flex
                                    justify={"space-between"}
                                    align={"center"}
                                    width={"100%"}
                                >
                                    <Text color={"whiteAlpha.800"}>
                                        {user.username}
                                    </Text>
                                    <Button
                                        bg={"brand.100"}
                                        _hover={{ bg: "brand.100" }}
                                    >
                                        Select
                                    </Button>
                                </Flex>
                            </Stack>
                        );
                    })}
                </Stack>
            )}
        </>
    );
};

export default UserSearchList;
