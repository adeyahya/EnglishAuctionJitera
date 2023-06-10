import {
  Container,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";

const LoginPage = () => {
  return (
    <Container maxW="xl" pt="44">
      <Box mb="8">
        <Heading>English Auction</Heading>
        <Text fontSize="xl">Welcome to the English Auction</Text>
      </Box>
      <Stack>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" required />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" required />
        </FormControl>
      </Stack>
      <Stack mt="6">
        <Button colorScheme="blue">Login</Button>
        <Button>Register</Button>
      </Stack>
    </Container>
  );
};

export default LoginPage;
