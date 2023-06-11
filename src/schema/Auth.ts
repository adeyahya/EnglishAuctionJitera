import { Static, Type } from "@sinclair/typebox";

export const LoginRequestDTO = Type.Object({
  email: Type.String({
    pattern: "^\\S+@\\S+\\.\\S+$",
  }),
  password: Type.String({
    minLength: 8,
  }),
});
export type LoginRequestType = Static<typeof LoginRequestDTO>;

export const AuthResponseDTO = Type.Object({
  id: Type.String(),
  email: Type.String({
    pattern: "^\\S+@\\S+\\.\\S+$",
  }),
  name: Type.String(),
});

export const RegisterRequestDTO = Type.Object({
  email: Type.String({
    pattern: "^\\S+@\\S+\\.\\S+$",
  }),
  password: Type.String({
    minLength: 8,
  }),
  name: Type.String(),
});
