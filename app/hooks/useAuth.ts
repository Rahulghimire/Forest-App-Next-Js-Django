import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { ApiError, authAPI } from "../lib/auth";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {

      console.log("Dsfdsdffsddfsd",data)
      localStorage.setItem("token", data?.access_token);
      queryClient.setQueryData(["currentUser"], data.user);
      message.success(data?.message || "Login successful!");
      if(data?.must_change_password){
        router.push("/admin/change-password");
        return;
      }
      router.push("/admin/dashboard");
    },
    onError: (error: ApiError) => {
      message.error(error?.message || "Login failed. Please try again.");
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.clear();
      message.success("Logged out successfully");
      router.push("/admin-login");
    },
    onError: () => {
      localStorage.removeItem("token");
      queryClient.clear();
      router.push("/admin-login");
    },
  });
};
