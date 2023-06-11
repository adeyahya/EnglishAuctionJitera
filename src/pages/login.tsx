import { LoginRequestDTO, LoginRequestType } from "@/schema/Auth";
import {
  Container,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Box,
  Heading,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { typeboxResolver } from "@hookform/resolvers/typebox";
import useMutateLogin from "@/hooks/useMutateLogin";

const LoginPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginRequestType>({
    resolver: typeboxResolver(LoginRequestDTO as any),
  });
  const { mutate, isLoading, error } = useMutateLogin();
  const errorMessage = (error as any)?.response?.data?.message;
  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  return (
    <Container as="form" maxW="xl" pt="44" onSubmit={onSubmit}>
      <Box mb="8">
        <Heading>English Auction</Heading>
        <Text fontSize="xl">Welcome to the English Auction</Text>
      </Box>
      <Stack>
        {errorMessage ? (
          <Alert status="error">
            <AlertIcon />
            {errorMessage}
          </Alert>
        ) : null}
        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input type="email" {...register("email")} />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Password</FormLabel>
          <Input type="password" {...register("password")} />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>
      </Stack>
      <Stack mt="6">
        <Button isLoading={isLoading} type="submit" colorScheme="blue">
          Login
        </Button>
        <Button>Register</Button>
      </Stack>
    </Container>
  );
};

export default LoginPage;
