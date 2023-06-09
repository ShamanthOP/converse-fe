import { ThemeConfig, extendTheme } from "@chakra-ui/react";

const config: ThemeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};

export const theme = extendTheme(
    { config },
    {
        colors: {
            brand: {
                100: "#3399FF",
            },
        },
        styles: {
            global: () => ({
                body: {
                    bg: "whiteAlpha.100",
                },
            }),
        },
    }
);
