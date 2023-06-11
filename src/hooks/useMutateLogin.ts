import axios from "axios";
import { LoginRequestType } from "@/schema/Auth";
import { useMutation } from "react-query";

const useMutateLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginRequestType) => {
      const { data } = await axios.post<string>("/api/auth/login", payload);
      return data;
    },
  });
};

export default useMutateLogin;
