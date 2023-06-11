import axios from "axios";
import type { AppProps } from "next/app";
import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import AppContextProvider from "@/context/AppContext";
import NiceModal from "@ebay/nice-modal-react";

axios.defaults.withCredentials = true;

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider>
          <AppContextProvider>
            <NiceModal.Provider>
              <Component {...pageProps} />
            </NiceModal.Provider>
          </AppContextProvider>
        </ChakraProvider>
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
