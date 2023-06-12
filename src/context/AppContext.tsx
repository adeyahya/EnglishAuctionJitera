import axios from "axios";
import { createContext, useState, useCallback, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { AuthType } from "@/schema/Auth";
import { Box, Spinner } from "@chakra-ui/react";
import { AuctionWithBidType } from "@/schema/Auction";
import { useQueryClient } from "react-query";

type ContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuthState: () => Promise<void>;
  user?: AuthType;
};

export const AppContext = createContext<ContextType>({
  isAuthenticated: false,
  isLoading: true,
  checkAuthState: () => new Promise(() => {}),
});

const Loader = () => {
  return (
    <Box w="100vw" h="100vh" position="relative">
      <Spinner
        size="xl"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      />
    </Box>
  );
};

const AppContextProvider = (props: { children: React.ReactNode }) => {
  const mountedRef = useRef<boolean>(false);
  const queryClient = useQueryClient();
  const checkAuthState = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { data } = await axios.get<AuthType>("/api/auth");
      setState((prev) => ({ ...prev, isAuthenticated: true, user: data }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: undefined,
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const [state, setState] = useState<ContextType>({
    isAuthenticated: false,
    isLoading: true,
    checkAuthState,
  });

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const initSocket = async () => {
      await fetch("/api/socket");
      const socketClient = io({
        autoConnect: true,
        reconnection: true,
        transports: ["websocket"],
      });
      socketClient.connect();
      socketClient.on("auction", (data: AuctionWithBidType) => {
        const prevData: AuctionWithBidType[] =
          queryClient.getQueryData("/api/auction") ?? [];
        const nextData = prevData.map((auction) => {
          if (auction.id === data.id) return data;
          return auction;
        });
        queryClient.setQueryData("/api/auction", nextData);
      });
    };

    initSocket();
    checkAuthState();
  }, [checkAuthState, queryClient]);

  return (
    <AppContext.Provider value={state}>
      {state.isLoading ? <Loader /> : props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
