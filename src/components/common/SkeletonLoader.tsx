import { Skeleton } from "@chakra-ui/react";

interface SkeletonLoaderProps {
    count: number;
    height: string;
    width?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    count,
    height,
    width,
}) => {
    return (
        <>
            {[...Array(count)].map((_, index) => {
                return (
                    <Skeleton
                        key={index}
                        startColor="blackAlpha.400"
                        endColor="whiteAlpha.300"
                        height={height}
                        width={{ base: "full" }}
                    />
                );
            })}
        </>
    );
};

export default SkeletonLoader;
