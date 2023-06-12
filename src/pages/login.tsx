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
import Link from "next/link";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();
  const context = useContext(AppContext);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginRequestType>({
    resolver: typeboxResolver(LoginRequestDTO as any),
  });
  const { mutateAsync, isLoading, error } = useMutateLogin();
  const errorMessage = (error as any)?.response?.data?.message;
  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(data);
    await context.checkAuthState();
    router.replace("/");
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
        <Link href="/register">
          <Button w="full">Register</Button>
        </Link>
      </Stack>
    </Container>
  );
};

export default LoginPage;
