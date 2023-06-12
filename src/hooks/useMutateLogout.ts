import axios from "axios";
import { useMutation } from "react-query";

const useMutateLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post<string>("/api/auth/logout");
      return data;
    },
  });
};

export default useMutateLogout;
