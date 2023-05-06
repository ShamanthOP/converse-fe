import { signIn, signOut, useSession } from "next-auth/react";

const Home = () => {
    const { data, status } = useSession();

    return (
        <div>
            {!data?.user ? (
                <button
                    onClick={() => {
                        signIn("google");
                    }}
                >
                    Sign in
                </button>
            ) : (
                <button
                    onClick={() => {
                        signOut();
                    }}
                >
                    Sign out
                </button>
            )}

            {data?.user?.name}
        </div>
    );
};

export default Home;
