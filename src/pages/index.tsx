import { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import { Box } from "@chakra-ui/react";
import Chat from "@/components/Chat";
import Auth from "@/components/Auth";

const Home: NextPage = () => {
    const { data: session } = useSession();

    const reloadSession = () => {
        const event = new Event("visibilitychange");
        document.dispatchEvent(event);
    };

    return (
        <Box>
            {session?.user.username ? (
                <Chat session={session} />
            ) : (
                <Auth session={session} reloadSession={reloadSession} />
            )}
        </Box>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getServerSession(
        context.req,
        context.res,
        authOptions
    );
    return {
        props: {
            session,
        },
    };
};

export default Home;
