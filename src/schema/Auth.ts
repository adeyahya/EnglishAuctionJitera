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

export const AuthDTO = Type.Object({
  id: Type.String(),
  email: Type.String({
    pattern: "^\\S+@\\S+\\.\\S+$",
  }),
  name: Type.String(),
});
export type AuthType = Static<typeof AuthDTO>;

export const RegisterRequestDTO = Type.Object({
  email: Type.String({
    pattern: "^\\S+@\\S+\\.\\S+$",
  }),
  password: Type.String({
    minLength: 8,
  }),
  name: Type.String(),
});
export type RegisterRequestType = Static<typeof RegisterRequestDTO>;
