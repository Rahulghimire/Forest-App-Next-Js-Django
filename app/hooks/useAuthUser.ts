import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ApiError, authAPI } from "../lib/auth";
import { toast } from "react-toastify";

export const useUserLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data?.access_token);
      localStorage.setItem("refresh_token", data?.refresh_token);
      queryClient.setQueryData(["currentUser"], data.user);
      toast.success(data?.message || "Login successful!");
      if(!data?.user?.password_changed){
        router.push("/change-password");
        return;
      }
      router.push("/user/dashboard");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Login failed. Please try again.");
    },
  });
};

export const useUserChangePassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: authAPI.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
      router.push("/user/dashboard");
    },
    onError: () => {
      toast.error("Password change failed");
    },
  });
};

export const useUserLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      localStorage.removeItem("access_token");
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/");
    },
    onError: () => {
      toast.error("Logout failed");
      localStorage.removeItem("access_token");
      queryClient.clear();
      router.push("/");
    },
  });
};
