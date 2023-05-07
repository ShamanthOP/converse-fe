import { Session } from "next-auth";

interface FeedWrapperProps {
    session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = () => {
    return <div>Have a good aday</div>;
};

export default FeedWrapper;
