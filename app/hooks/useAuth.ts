import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { ApiError, authAPI } from "../lib/auth";
import { toast } from "react-toastify";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      localStorage.setItem("token", data?.access_token);
      queryClient.setQueryData(["currentUser"], data.user);
      message.success(data?.message || "Login successful!");
      toast.success(data?.message || "Login successful!");
      if(data?.must_change_password){
        router.push("/admin/change-password");
        return;
      }
      router.push("/admin/dashboard");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Login failed. Please try again.");
      message.error(error?.message || "Login failed. Please try again.");
    },
  });
};

export const useChangePassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: authAPI.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
      message.success("Password changed successfully");
      router.push("/admin/dashboard");
    },
    onError: () => {
      toast.error("Password change failed");
      message.error("Password change failed");
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
      toast.success("Logged out successfully");
      message.success("Logged out successfully");
      router.push("/admin-login");
    },
    onError: () => {
      toast.error("Logout failed");
      localStorage.removeItem("token");
      queryClient.clear();
      router.push("/admin-login");
    },
  });
};
