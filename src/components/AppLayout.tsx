import { AppContext } from "@/context/AppContext";
import {
  Box,
  Button,
  HStack,
  Heading,
  Avatar,
  Container,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import Link from "next/link";
import { useContext } from "react";
import Balance from "@/components/Balance";
import { useModal } from "@ebay/nice-modal-react";
import ModalAddDeposit from "@/components/ModalAddDeposit";

const AppLayout = (props: { children: React.ReactNode }) => {
  const context = useContext(AppContext);
  const addDepositModal = useModal(ModalAddDeposit);

  return (
    <Box as="main">
      <Box as="nav" bg="gray.100" py="2">
        <Container maxW="6xl">
          <HStack position="sticky" top="0" left="0" justify="space-between">
            <Box>
              <Heading size="md">English Auction</Heading>
            </Box>
            <HStack align="center" justify="end">
              {context.isAuthenticated ? (
                <>
                  <Balance />
                  <Menu>
                    <MenuButton cursor="pointer" as={Box}>
                      <Avatar
                        cursor="pointer"
                        size="sm"
                        name={context.user?.name}
                      />
                    </MenuButton>
                    <MenuList>
                      <MenuItem>Create New Item</MenuItem>
                      <MenuItem onClick={() => addDepositModal.show()}>
                        Deposit
                      </MenuItem>
                      <MenuItem>Logout</MenuItem>
                    </MenuList>
                  </Menu>
                </>
              ) : (
                <Link href="/login">
                  <Button colorScheme="blue">Login</Button>
                </Link>
              )}
            </HStack>
          </HStack>
        </Container>
      </Box>
      <Container maxW="6xl">{props.children}</Container>
    </Box>
  );
};

export default AppLayout;
