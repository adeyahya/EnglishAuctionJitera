import { RegisterRequestDTO, RegisterRequestType } from "@/schema/Auth";
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
import useMutateRegister from "@/hooks/useMutateRegister";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterRequestType>({
    resolver: typeboxResolver(RegisterRequestDTO),
  });
  const password = watch("password");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const { mutateAsync, isLoading, error } = useMutateRegister();
  const errorMessage = (error as any)?.response?.data?.message;
  const onSubmit = handleSubmit(async(data) => {
    await mutateAsync(data);
    router.replace("/login");
  });
  const isIncorrectPasswordConfirmation =
    password && passwordConfirmation && password !== passwordConfirmation;

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
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input {...register("name")} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
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
        <FormControl isInvalid={!!isIncorrectPasswordConfirmation}>
          <FormLabel>Password Confirmation</FormLabel>
          <Input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => {
              setPasswordConfirmation(e.target.value);
            }}
          />
          <FormErrorMessage>Invalid Password Confirmation</FormErrorMessage>
        </FormControl>
      </Stack>
      <Stack mt="6">
        <Button
          isDisabled={
            !!isIncorrectPasswordConfirmation || !passwordConfirmation
          }
          isLoading={isLoading}
          type="submit"
          colorScheme="blue"
        >
          Register
        </Button>
        <Link href="/login">
          <Button w="full">Login</Button>
        </Link>
      </Stack>
    </Container>
  );
};

export default LoginPage;
