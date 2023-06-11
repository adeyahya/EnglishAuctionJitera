import axios from "axios";
import { RegisterRequestType, AuthType } from "@/schema/Auth";
import { useMutation } from "react-query";

const useMutateRegister = () => {
  return useMutation({
    mutationFn: async (payload: RegisterRequestType) => {
      const { data } = await axios.post<AuthType>(
        "/api/auth/register",
        payload
      );
      return data;
    },
  });
};

export default useMutateRegister;
