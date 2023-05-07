import userOperations from "@/graphql/operations/user";
import { useMutation } from "@apollo/client";
import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface AuthProps {
    session: Session | null;
    reloadSession: () => void;
}

const Auth: React.FC<AuthProps> = ({ session, reloadSession }) => {
    const [username, setUsername] = useState("");

    const [createUsername, { data, loading, error }] = useMutation(
        userOperations.Muatations.createUsername
    );

    console.log("Mutation", data, loading, error);

    const onSubmit = async () => {
        if (!username) return;
        try {
            await createUsername({ variables: { username } });
        } catch (error) {
            console.log("Error:", error);
        }
    };

    return (
        <Center height="100vh">
            <Stack align="center" spacing={8}>
                {session ? (
                    <>
                        <Text fontSize="3xl">Create a username</Text>
                        <Input
                            placeholder="Enter a username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                        />
                        <Button width="100%" onClick={onSubmit}>
                            Save
                        </Button>
                    </>
                ) : (
                    <>
                        <Text fontSize="3xl">Converse</Text>
                        <Button
                            onClick={() => signIn("google")}
                            leftIcon={
                                <Image
                                    height="20px"
                                    src="/images/googlelogo.png"
                                    alt="Logo"
                                />
                            }
                        >
                            Continue with Google
                        </Button>
                    </>
                )}
            </Stack>
        </Center>
    );
};

export default Auth;
