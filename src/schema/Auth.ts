import { Type } from "@sinclair/typebox";

export const LoginRequestDTO = Type.Object({
  email: Type.String({
    format: "email",
  }),
  password: Type.String({
    minLength: 8,
  }),
});

export const AuthResponseDTO = Type.Object({
  id: Type.String(),
  email: Type.String({
    format: "email",
  }),
  name: Type.String(),
});

export const RegisterRequestDTO = Type.Object({
  email: Type.String({
    format: "email",
  }),
  password: Type.String({
    minLength: 8,
  }),
  name: Type.String(),
});
