import userOperations from "@/graphql/operations/user";
import { useMutation } from "@apollo/client";
import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiMessageSquareDots } from "react-icons/bi";

interface AuthProps {
    session: Session | null;
    reloadSession: () => void;
}

const Auth: React.FC<AuthProps> = ({ session, reloadSession }) => {
    const [username, setUsername] = useState("");

    const [createUsername, { loading, error }] = useMutation(
        userOperations.Muatations.createUsername
    );

    const onSubmit = async () => {
        if (!username) return;
        try {
            const { data } = await createUsername({ variables: { username } });

            if (!data?.createUsername) {
                throw new Error();
            }

            if (data.createUsername.error) {
                const error = data.createUsername.error;
                throw new Error(error);
            }
            toast.success("Username successfully created 🙌");
            reloadSession();
        } catch (error: any) {
            toast.error(error?.message);
            console.log("Error:", error.message);
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
                        <Button
                            width="100%"
                            onClick={onSubmit}
                            isLoading={loading}
                        >
                            Save
                        </Button>
                    </>
                ) : (
                    <>
                        <Stack spacing={20} align={"center"}>
                            <Stack direction={"row"} align={"center"}>
                                <BiMessageSquareDots fontSize={90} />
                                <Text fontSize="5xl">Converse</Text>
                            </Stack>
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
                        </Stack>
                    </>
                )}
            </Stack>
        </Center>
    );
};

export default Auth;
