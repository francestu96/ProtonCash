import { ChakraProvider } from '@chakra-ui/react';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { SessionProvider } from "next-auth/react";
import { extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import "../styles/globals.css";
import { Session } from 'next-auth';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });
const activeChain = process.env.NEXT_PUBLIC_APP_CHAIN || "binance-testnet";

const MyApp = ({Component, pageProps}: AppProps<{session: Session}>) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <SessionProvider session={pageProps.session}>
        <ThirdwebProvider activeChain={activeChain}>
          <Component {...pageProps} />
        </ThirdwebProvider>
      </SessionProvider>
    </ChakraProvider>
  );
};

export default MyApp;
